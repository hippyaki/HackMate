const userRoutes = require('./src/routes/users');
const hackerRoutes = require('./src/routes/hackers');
const express = require("express");
const app = express();


const allowedOrigins = [
  "https://hackmate-rv8q.onrender.com",
  "https://hackmate-gdg.onrender.com",
  "https://hackmate-gdg.web.app",
  "https://hackmate-gdg.firebaseapp.com",
  "localhost",
];

app.use(express.json());

app.use((req, res, next) => {
  const origin = req.get("origin"); // undefined if header not present
  const secFetchMode = req.get("sec-fetch-mode"); // may be undefined for older browsers/clients

  if (!origin && secFetchMode === "navigate") {
    return res.status(401).send("Unauthorized");
  }

  if (origin) {
    if (!allowedOrigins.includes(origin)) {
      return res.status(401).send("Unauthorized");
    }

    res.header("Access-Control-Allow-Origin", origin);
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  } else {
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});



// routes
app.use("/api/users", userRoutes);
app.use("/api/hackers", hackerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
