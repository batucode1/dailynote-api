import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
const router = express.Router();
const JWT_SECRET = "jwt_token_secret";

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.find({ email });
  if (existingUser) res.status(400).json({ error: "User already exists" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User created successfully" });
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) res.status(400).json({ error: "Invalid credentials" });
  const isMatch = await bcrypt.compare(password, user!.password);
  if (!isMatch) res.status(400).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user!._id }, JWT_SECRET, {
    expiresIn: "2d",
  });
  res.json({ token });
});

export default router;
