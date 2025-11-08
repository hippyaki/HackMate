import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../services/firestore.js";

export const getAllUsers = async (req, res) => {
  try {
    const snapshot = await getDocs(collection(db, "users"));
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, username, email } = req.body;
    const docRef = await addDoc(collection(db, "users"), {
      name,
      username,
      email,
      createdAt: Date.now()
    });
    res.json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: "Error adding user" });
  }
};
