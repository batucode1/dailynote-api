import mongoose from "mongoose";

const DailyDreamSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dream: { type: String, required: true },
  date: { type: Date, required: true },
  mood: { type: String, required: true },
  index: { type: Number, required: true },
});

export const DailyDream = mongoose.model("DailyDream", DailyDreamSchema);
