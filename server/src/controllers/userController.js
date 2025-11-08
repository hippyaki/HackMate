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

// GET single user by UID
const getUserByUid = async (req, res) => {
  try {
    const { uid } = req.body;
    const userSnap = await db.collection("users").doc(uid).get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ id: userSnap.id, ...userSnap.data() });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

// POST add user
const addUser = async (req, res) => {
  try {
    const { uid, name, username, email, photoURL } = req.body;

    if (!name || !username || !email) {
      return res.status(400).json({ error: "All fields (name, username, email) are required" });
    }

    const docRef = await db.collection("users").add({
      uid,
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
    const { uid } = req.params;

    const snapshot = await db.collection("users").where("uid", "==", uid).get();

    if (snapshot.empty) {
      return res.status(200).json({ exists: false });
    }

    res.status(200).json({ exists: true });
  } catch (error) {
    console.error("Error checking uid:", error);
    res.status(500).json({ error: "Error checking uid" });
  }
};

// PUT update hacker
const updateUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = { ...req.body, updatedAt: Date.now() };

    await db.collection("users").doc(uid).update(updates);

    res.status(200).json({ message: "Hacker updated successfully" });
  } catch (error) {
    console.error("Error updating hacker:", error);
    res.status(500).json({ message: "Failed to update hacker" });
  }
};

module.exports = {
  getAllUsers,
  getUserByUid,
  addUser,
  checkUID,
  updateUser
};
