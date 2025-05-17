import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./api/routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 5002;
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use((req, res, next) => {
  console.log("🔁 Gelen istek:", req.method, req.url);
  next();
});

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("m-MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error", error));
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
