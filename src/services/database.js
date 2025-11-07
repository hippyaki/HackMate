import { getFirestore, collection, addDoc } from "firebase/firestore";
import app from './authService';

const db = getFirestore(app);

async function saveUserData(user) {
    try {
        const docRef = await addDoc(collection(db, "users"), {
            name: user.name,
            email: user.email,
            age: user.age,
            createdAt: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// saveUserData({ name: "John Doe", email: "john@example.com", age: 25 });

async function fetchUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
}

// fetchUsers();