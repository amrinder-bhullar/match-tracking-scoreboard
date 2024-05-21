import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    raids: {
      type: Number,
      default: 0,
    },
    stops: {
      type: Number,
      default: 0,
    },
    out: {
      type: Number,
      default: 0,
    },
    doubleTouch: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Team || mongoose.model("Team", TeamSchema);
