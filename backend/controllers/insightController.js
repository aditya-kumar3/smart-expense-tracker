// backend/controllers/insightController.js

const Expense = require("../models/Expense");

const MONTHLY_BUDGET = 20000;

function calcInsights(expenses) {
  const now = new Date();
  const thisMonth = [];
  const lastMonth = [];

  expenses.forEach((exp) => {
    const d = new Date(exp.date);
    const sameYear = d.getFullYear() === now.getFullYear();

    if (sameYear && d.getMonth() === now.getMonth()) {
      thisMonth.push(exp);
    } else if (
      sameYear &&
      d.getMonth() === (now.getMonth() - 1 + 12) % 12
    ) {
      lastMonth.push(exp);
    }
  });

  const thisMonthTotal = thisMonth.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );
  const lastMonthTotal = lastMonth.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );
  const thisMonthCount = thisMonth.length;

  const remainingBudget = MONTHLY_BUDGET - thisMonthTotal;

  let mood = "neutral";
  let summaryText = "You’re on track this month. ⚖️";

  if (remainingBudget > 3000) {
    mood = "good";
    summaryText = `Nice! You still have ₹${remainingBudget} left in your budget. 🏆`;
  } else if (remainingBudget < 0) {
    mood = "bad";
    summaryText = `You overspent by ₹${Math.abs(
      remainingBudget
    )} this month. Next month we save harder 💪`;
  }

  // category summary
  const catMap = new Map();
  expenses.forEach((e) => {
    const key = e.category || "Other";
    const amt = Number(e.amount) || 0;
    catMap.set(key, (catMap.get(key) || 0) + amt);
  });

  const categories = Array.from(catMap.entries()).map(([label, amount]) => ({
    label,
    amount,
  }));

  let topCategory = null;
  categories.forEach((c) => {
    if (!topCategory || c.amount > topCategory.amount) {
      topCategory = c;
    }
  });

  // change vs last month
  let trendText;
  if (lastMonthTotal === 0 && thisMonthTotal === 0) {
    trendText =
      "You’re just getting started. Perfect time to build strong money habits.";
  } else if (lastMonthTotal === 0 && thisMonthTotal > 0) {
    trendText =
      "This is your first active month. I’ll start comparing trends from next month.";
  } else {
    const diff = thisMonthTotal - lastMonthTotal;
    const percent = Math.round((Math.abs(diff) / lastMonthTotal) * 100);
    if (diff > 0) {
      trendText = `Spending is up by ~${percent}% vs last month. Keep an eye on your top categories.`;
    } else if (diff < 0) {
      trendText = `Nice! Spending dropped by ~${percent}% vs last month. Keep this momentum.`;
    } else {
      trendText =
        "You spent almost the same as last month. Try changing one category at a time.";
    }
  }

  const suggestionText =
    remainingBudget >= 0
      ? "You still have room in your budget. Move some of it into savings at month end."
      : "You crossed your budget. Next month, set limits on your highest spend category.";

  const tips = [
    {
      title: "Where most of your money goes",
      emoji: "📌",
      text: topCategory
        ? `Your highest spend is in “${topCategory.label}” with ~₹${topCategory.amount.toLocaleString(
            "en-IN"
          )}.`
        : "I’ll highlight your biggest category once you add a few expenses.",
    },
    {
      title: "Spending trend vs last month",
      emoji: "📊",
      text: trendText,
    },
    {
      title: "AI suggestion for next month",
      emoji: "🤖",
      text: suggestionText,
    },
  ];

  return {
    summary: {
      thisMonthTotal,
      thisMonthCount,
      remainingBudget,
      mood,
      summaryText,
      budget: MONTHLY_BUDGET,
    },
    categories,
    tips,
  };
}

// POST /api/insights/summary
const getInsights = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const expenses = await Expense.find({ userId }).sort({ date: 1 });

    const data = calcInsights(expenses);

    return res.json(data);
  } catch (err) {
    console.error("Insight error:", err);
    res.status(500).json({ message: "Failed to generate insights" });
  }
};

module.exports = { getInsights };
