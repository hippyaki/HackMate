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

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());


// routes
app.use("/api/users", userRoutes);
app.use("/api/hackers", hackerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
