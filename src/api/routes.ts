import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";
import dotenv from "dotenv";
import {
  ErrorResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/auth";
import authMiddleware from "../middleware/authMiddleware";

import {
  DailyNoteRequest,
  DailyNoteResponse,
  DailyErrorResponse,
} from "../types/dailynote";
import { DailyNote } from "../models/DailyNote";
dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET_TOKEN!;

router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse | ErrorResponse>
  ) => {
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
  }
);

router.post(
  "/login",
  async (
    req: Request<{}, {}, LoginRequest>,
    res: Response<LoginResponse | ErrorResponse>
  ) => {
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

      return res.json({ message: "Login successful", token });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Server error" });
    }
  }
);
interface AuthenticatedRequest extends Request<{}, {}, DailyNoteRequest> {
  user: {
    userId: string;
  };
}

router.post(
  "/daily-note",
  authMiddleware,
  async (
    req: Request<{}, {}, DailyNoteRequest>,
    res: Response<DailyNoteResponse | DailyErrorResponse>
  ) => {
    const userId = (req as any).user.userId;

    const { content, date, mood, index } = req.body;

    if (!content || !date || !mood || index === undefined) {
      return res.status(400).json({ error: "Eksik bilgi" });
    }

    try {
      const newNote = new DailyNote({
        userId,
        content,
        date: new Date(date),
        mood,
        index,
      });

      await newNote.save();
      res.status(201).json({ message: "Günlük kaydedildi", note: newNote });
    } catch (err) {
      console.error("Günlük kayıt hatası:", err);
      res.status(500).json({ error: "Sunucu hatası" });
    }
  }
);

export default router;
