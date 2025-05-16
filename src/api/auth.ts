import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import { ErrorResponse, LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "../types/auth";

dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET_TOKEN!;

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req: Request<{}, {}, LoginRequest>, res: Response<LoginResponse | ErrorResponse>) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.json({message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

export default router;
