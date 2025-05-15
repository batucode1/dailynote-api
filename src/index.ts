import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
mongoose
  .connect(
    "mongodb+srv://batucode:bBOGRnHllJNzBycn@cluster0.d1ahkpg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("m-MongoDB connected"))
  .catch((eroor) => console.error("MongoDB connection error", eroor));
app.use("/routes/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
