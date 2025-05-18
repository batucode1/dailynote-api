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
  DailyNoteResponseGet,
} from "../types/dailynote";
import { DailyNote } from "../models/DailyNote";
import { setgid } from "process";
dotenv.config();
const router = Router();
const JWT_SECRET = process.env.JWT_MY_TOKEN!;

router.post(
  "/register",
  async (
    req: Request<{}, {}, RegisterRequest>,
    res: Response<RegisterResponse | ErrorResponse>
  ) => {
    try {
      const { email, password } = req.body;

      console.log("📥 Kayıt verisi:", email, password);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("⚠️ Kullanıcı zaten var");
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashedPassword });

      console.log("💾 Kayıt edilmek istenen kullanıcı:", user);

      await user.save(); // 🔥 Burası çalışmazsa kullanıcı kaydedilmez

      console.log("✅ Kullanıcı veritabanına kaydedildi");

      return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
      console.error("❌ Register error:", err);
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
router.get(
  "/getDailyNote",
  authMiddleware,
  async (
    req: Request,
    res: Response<DailyNoteResponseGet | DailyErrorResponse>
  ) => {
    const userId = (req as any).user.userId;
    const dateQuery = req.query.date as string;

    try {
      const notes = await DailyNote.find({ userId });
      const startOfDay = new Date(dateQuery);
      const endOfDay = new Date(dateQuery);
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay.setHours(23, 59, 59, 999);
      const note = await DailyNote.findOne({
        userId,
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      });
      if (!note) {
        return res.status(404).json({ error: "Günlük notu bulunamadı" });
      }
      return res.status(200).json({
        _id: note._id.toString(),
        userId: note.userId.toString(),
        index: note.index,
        content: note.content,
        date: note.date.toISOString(),
        mood: note.mood,
      });
    } catch (error) {
      return res.status(500).json({ error: "Sunucu hatası" });
    }
  }
);

export default router;
