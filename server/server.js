const userRoutes = require('./src/routes/users');
const hackerRoutes = require('./src/routes/hackers');
const express = require("express");
const app = express();


app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/hackers", hackerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
