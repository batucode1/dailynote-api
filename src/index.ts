import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./api/auth";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("m-MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error", error));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
