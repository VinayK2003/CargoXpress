import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(express.json()); // For parsing application/json
app.use("/api/auth", authRoutes); // Authentication routes

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
