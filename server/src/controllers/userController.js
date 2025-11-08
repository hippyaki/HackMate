const { collection, getDocs, addDoc } = require("firebase/firestore");
const { db } = require("../services/firestore.js");

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// POST add user
const addUser = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    if (!name || !username || !email) {
      return res.status(400).json({ error: "All fields (name, username, email) are required" });
    }

    const docRef = await addDoc(collection(db, "users"), {
      name,
      username,
      email,
      createdAt: Date.now(),
    });

    res.status(201).json({ id: docRef.id, message: "User added successfully" });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Error adding user" });
  }
};

module.exports = {
  getAllUsers,
  addUser,
};
