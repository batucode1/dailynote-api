import mongoose from "mongoose";
import { ref } from "process";

const DailyNoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  date: { type: Date, required: true },
  mood: { type: String, required: true },
  index: { type: Number, required: true },
});

export const DailyNote = mongoose.model("DailyNote", DailyNoteSchema);