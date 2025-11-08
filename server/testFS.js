const { db } = require("./src/services/firestore");

async function test() {
  try {
    const snapshot = await db.collection("users").get();
    console.log("Users:", snapshot.docs.map(d => d.data()));
  } catch (err) {
    console.error(err);
  }
}

test();