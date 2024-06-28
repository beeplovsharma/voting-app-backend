import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema(
  {
    phase: {
      type: String,
      enum: ["voting", "result"],
      default: "voting",
    },
    whoChanged: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aadhaar",
    },
  },
  { timestamps: true }
);

const Phase = mongoose.model("Phase", phaseSchema);
export default Phase;
