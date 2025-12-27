// backend/controllers/goalController.js

const Goal = require("../models/Goal");
const Expense = require("../models/Expense");

// create / update goal
exports.upsertGoal = async (req, res) => {
  try {
    const { userId, name, targetAmount, monthlyTarget, deadline } = req.body;

    if (!userId || !name || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: "userId, name & targetAmount required",
      });
    }

    const goal = await Goal.findOneAndUpdate(
      { userId, name },
      {
        userId,
        name,
        targetAmount,
        monthlyTarget: monthlyTarget || null,
        deadline: deadline || null,
        isActive: true,
      },
      { upsert: true, new: true }
    );

    return res.json({ success: true, goal });
  } catch (err) {
    console.error("upsertGoal error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save goal",
    });
  }
};

// get goal + progress based on current month savings
exports.getGoalStatus = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const goal = await Goal.findOne({ userId, isActive: true }).lean();

    if (!goal) {
      return res.json({
        success: true,
        goal: null,
        progress: null,
      });
    }

    // simple saving calc: income - expense of current month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth, $lt: nextMonth },
    }).lean();

    const spent = expenses.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );

    // yaha tum chaaho to income model se income bhi minus/add kar sakte ho
    // abhi simple version: assume budget = goal.monthlyTarget or targetAmount / 6
    const assumedBudget =
      goal.monthlyTarget || Math.round(goal.targetAmount / 6);

    const savedThisMonth = Math.max(0, assumedBudget - spent);
    const totalSaved = (goal.savedSoFar || 0) + savedThisMonth;
    const progressPercent = Math.min(
      100,
      Math.round((totalSaved / goal.targetAmount) * 100)
    );

    return res.json({
      success: true,
      goal,
      progress: {
        savedThisMonth,
        totalSaved,
        progressPercent,
        assumedBudget,
      },
    });
  } catch (err) {
    console.error("getGoalStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load goal status",
    });
  }
};
