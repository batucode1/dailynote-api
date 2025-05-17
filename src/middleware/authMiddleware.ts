import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

import {
  DailyNoteRequest,
  DailyNoteResponse,
  DailyErrorResponse,
} from "../types/dailynote";
const JWT_SECRET = process.env.JWT_SECRET_TOKEN!;

export default function authMiddleware(
  req: Request,
  res: Response<DailyNoteResponse | DailyErrorResponse>,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: ",Yetkisiz" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    //bela
    next();
  } catch (error) {
    return res.status(401).json({ error: "Geçersiz Token" });
  }
}
