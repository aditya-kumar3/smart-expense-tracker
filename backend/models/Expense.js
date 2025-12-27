// backend/models/Expense.js
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["income", "expense"],
      default: "expense",
      required: true,
    },

    // 🔥 NEW: income source (sirf income ke liye use hoga)
    source: {
      type: String,
      enum: ["salary", "freelance", "other"],
      default: null,
    },

    category: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
