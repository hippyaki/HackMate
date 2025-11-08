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

// GET hacker by UID
const getHackerById = async (req, res) => {
  try {
    const { uid } = req.params;
    const hackerSnap = await db.collection("hackers").doc(uid).get();

    if (!hackerSnap.exists) {
      return res.status(404).json({ message: "Hacker not found" });
    }

    res.status(200).json({ id: hackerSnap.id, ...hackerSnap.data() });
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
    const { uid } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };

    await db.collection("hackers").doc(uid).update(updates);

    res.status(200).json({ message: "Hacker updated successfully" });
  } catch (error) {
    console.error("Error updating hacker:", error);
    res.status(500).json({ message: "Failed to update hacker" });
  }
};

// DELETE hacker
const deleteHacker = async (req, res) => {
  try {
    const { uid } = req.params;
    await db.collection("hackers").doc(uid).delete();

    res.status(200).json({ message: "Hacker deleted successfully" });
  } catch (error) {
    console.error("Error deleting hacker:", error);
    res.status(500).json({ message: "Failed to delete hacker" });
  }
};

module.exports = {
  getAllHackers,
  getHackerById,
  createHacker,
  updateHacker,
  deleteHacker,
};
