// backend/models/Goal.js
const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true, // e.g. "iPhone 16", "Emergency Fund"
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    // optional monthly target
    monthlyTarget: {
      type: Number,
    },
    // kitna save ho chuka (we can update from frontend later)
    savedSoFar: {
      type: Number,
      default: 0,
    },
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Goal", goalSchema);
