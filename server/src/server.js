import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import hackerRoutes from "./routes/hackers.js";

const app = express();
app.use(cors());
app.use(express.json());

// routes
app.use("/api/users", userRoutes);
app.use("/api/hackers", hackerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
