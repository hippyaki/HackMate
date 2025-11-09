const userRoutes = require('./src/routes/users');
const hackerRoutes = require('./src/routes/hackers');
const express = require("express");
const app = express();


// app.use(cors());
app.use(express.json());

//Important Headers for public uses
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

// routes
app.use("/api/users", userRoutes);
app.use("/api/hackers", hackerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
