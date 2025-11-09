const { db } = require("../services/firestore.js");

// GET all hackers
const getAllHackers = async (req, res) => {
  try {
    const snapshot = await db.collection("hackers").get();
    const hackers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(hackers);
  } catch (error) {
    console.error("Error fetching hackers:", error);
    res.status(500).json({ message: "Failed to fetch hackers" });
  }
};

// GET hacker by Username
const getHackerById = async (req, res) => {
  try {
    const { username } = req.query
    // const q = await db.collection("hackers").where("username", "==", username.trim()).limit(1).get();
    const hackerSnap = await db.collection("hackers").where("username", "==", username).get();
    // console.log("Username query:", username);
    // console.log("Hacker query result:", hackerSnap);

    if (hackerSnap.empty) {
      return res.status(404).json({ message: "Hacker not found" });
    }
    const hackers = hackerSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(hackers[0]);
  } catch (error) {
    console.error("Error fetching hacker:", error);
    res.status(500).json({ message: "Failed to fetch hacker" });
  }
};

// POST new hacker
const createHacker = async (req, res) => {
  try {
    const {
      uid,
      username,
      name,
      bio = "",
      tags = [],
      location = {},
      scoreVector = {},
      subscribedTo = [],
      postsTokenId = "",
      visibility = "public",
      photoURL = ""
    } = req.body;

    if (!uid || !username) {
      return res.status(400).json({ message: "uid and username are required" });
    }

    // Ensure username is unique
    const snapshot = await db.collection("hackers").where("username", "==", username).get();
    if (!snapshot.empty) {
      return res.status(409).json({ message: "Username already taken" });
    }

    await db.collection("hackers").doc(uid).set({
      uid,
      username,
      name: name || "",
      bio,
      tags,
      location,
      scoreVector,
      subscribedTo,
      subscribersCount: 0,
      postsTokenId,
      visibility,
      photoURL,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    res.status(201).json({ message: "Hacker created successfully", uid });
  } catch (error) {
    console.error("Error creating hacker:", error);
    res.status(500).json({ message: "Failed to create hacker" });
  }
};

// PUT update hacker
const updateHacker = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim() === "") {
      return res.status(400).json({ message: "Username is required to find the hacker." });
    }

    const q = await db.collection("hackers")
      .where("username", "==", username.trim())
      .limit(1)
      .get();

    if (q.empty) {
      return res.status(404).json({ message: "Hacker with given username not found." });
    }

    const docRef = db.collection("hackers").doc(q.docs[0].id);
    const updates = { ...req.body, updatedAt: Date.now() };
    delete updates.username;

    if (Array.isArray(updates.subscribedTo)) {
      const snap = await docRef.get();
      const existingData = snap.data();
      const currentSubscribed = Array.isArray(existingData.subscribedTo)
        ? existingData.subscribedTo
        : [];

      updates.subscribedTo = Array.from(
        new Set([...currentSubscribed, ...updates.subscribedTo])
      );
    }

    await docRef.update(updates);
    const updatedSnap = await docRef.get();

    return res.status(200).json({
      message: "Hacker updated successfully",
      id: docRef.id,
      data: updatedSnap.data(),
    });
  } catch (error) {
    console.error("Error updating hacker:", error);
    return res.status(500).json({ message: "Failed to update hacker" });
  }
};


// DELETE hacker
const deleteHacker = async (req, res) => {
  try {
    const { uid } = req.body;
    await db.collection("hackers").doc(uid).delete();

    res.status(200).json({ message: "Hacker deleted successfully" });
  } catch (error) {
    console.error("Error deleting hacker:", error);
    res.status(500).json({ message: "Failed to delete hacker" });
  }
};

// POST /hackers/match
// Request body: { username: "gdg-noida", tags: ["web development", "dsa problem solving"] }
const getHackerMatches = async (req, res) => {
  try {
    const { tags: inputTags, username } = req.body;

    if (!Array.isArray(inputTags) || inputTags.length === 0) {
      return res.status(400).json({ message: "tags array is required in request body" });
    }
    if (!username) {
      return res.status(400).json({ message: "username is required in request body" });
    }

    // Fetch all hackers (we’ll filter to 50 after scoring)
    const snapshot = await db.collection("hackers").get();
    const hackers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Compute match scores
    const hackersWithScore = hackers.map(hacker => {
      const hackerTags = (hacker.tags || []).map(t => t.name);
      const commonTags = hackerTags.filter(tag => inputTags.includes(tag));
      return { ...hacker, matchScore: commonTags.length };
    });

    // Sort by match score descending and pick top 50
    const top50 = hackersWithScore
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 50);

    // Fetch user doc by username
    const userSnap = await db.collection("hackers").where("username", "==", username).limit(1).get();

    if (userSnap.empty) {
      return res.status(404).json({ message: "User not found" });
    }

    const userDoc = userSnap.docs[0];
    const userData = userDoc.data();
    const subscribedTo = userData.subscribedTo || [];

    // Filter out hackers that the user is already subscribed to
    const filteredMatches = top50.filter(hacker => !subscribedTo.includes(hacker.username));

    res.status(200).json(filteredMatches);
  } catch (error) {
    console.error("Error fetching hacker matches:", error);
    res.status(500).json({ message: "Failed to fetch hacker matches" });
  }
};



// POST /hackers/subs
// Request body: { subscribedTo: ["user1", "user2", ...] }

const getHackerSubs = async (req, res) => {
  try {
    const { subscribedTo } = req.body;

    if (!Array.isArray(subscribedTo) || subscribedTo.length === 0) {
      return res.status(400).json({ message: "subscribedTo array is required in request body" });
    }

    // Firestore only allows up to 10 items in 'in' query at once
    const chunks = [];
    for (let i = 0; i < subscribedTo.length; i += 10) {
      chunks.push(subscribedTo.slice(i, i + 10));
    }

    let allHackers = [];

    for (const chunk of chunks) {
      const snapshot = await db
        .collection("hackers")
        .where("username", "in", chunk)
        .get();

      const hackers = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      allHackers = [...allHackers, ...hackers];
    }

    if (allHackers.length === 0) {
      return res.status(404).json({ message: "No hackers found for the given usernames." });
    }

    res.status(200).json(allHackers);
  } catch (error) {
    console.error("Error fetching subscribed hackers:", error);
    res.status(500).json({ message: "Failed to fetch subscribed hackers" });
  }
};


module.exports = {
  getAllHackers,
  getHackerById,
  createHacker,
  updateHacker,
  deleteHacker,
  getHackerMatches,
  getHackerSubs
};
