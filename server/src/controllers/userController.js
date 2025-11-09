const { db } = require("../services/firestore.js");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get(); // Admin SDK
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// GET single user by uuid
const getUserByUid = async (req, res) => {
  try {
    const { uuid } = req.query;

    // Query the collection for a document where the uuid field matches
    const userQuery = await db.collection("users").where("uuid", "==", uuid).get();

    if (userQuery.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    // Assuming uuid is unique, take the first match
    const userSnap = userQuery.docs[0];
    res.status(200).json({ id: userSnap.id, ...userSnap.data() });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};


// POST add user
const addUser = async (req, res) => {
  try {
    const { uuid, name, username, email, photoURL } = req.body;

    if (!name || !uuid || !email) {
      return res.status(400).json({ error: "All fields (name, uuid, email) are required" });
    }

    const docRef = await db.collection("users").add({
      uuid,
      name,
      username,
      email,
      photoURL,
      createdAt: Date.now(),
    });

    res.status(201).json({ id: docRef.id, message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Error adding user" });
  }
};

// GET check if username exists
const checkUID = async (req, res) => {
  try {
    const { uuid } = req.query;

    const snapshot = await db.collection("users").where("uuid", "==", uuid).get();

    if (snapshot.empty) {
      return res.status(200).json({ exists: false });
    }

    // Assuming uuid is unique, we take the first document
    const userDoc = snapshot.docs[0].data();
    const username = userDoc.username; // get the username field

    res.status(200).json({ exists: true, username });
  } catch (error) {
    console.error("Error checking uuid:", error);
    res.status(500).json({ error: "Error checking uuid" });
  }
};


// PUT update user
const updateUser = async (req, res) => {
  try {
    const { uuid } = req.body;
    const updates = { ...req.body, updatedAt: Date.now() };

    await db.collection("users").doc(uuid).update(updates);

    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
};

module.exports = {
  getAllUsers,
  getUserByUid,
  addUser,
  checkUID,
  updateUser
};
