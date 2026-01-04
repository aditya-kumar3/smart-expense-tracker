// backend/controllers/insightController.js

const Expense = require("../models/Expense");

const MONTHLY_BUDGET = 20000;

function calcInsights(transactions) {
  const now = new Date();
  
  // Separate arrays for this month and last month
  const thisMonthIncome = [];
  const thisMonthExpense = [];
  const lastMonthIncome = [];
  const lastMonthExpense = [];

  transactions.forEach((txn) => {
    const d = new Date(txn.date);
    const sameYear = d.getFullYear() === now.getFullYear();
    const type = (txn.type || "").toLowerCase().trim();
    const isIncome = type === "income";
    const isExpense = type === "expense";

    // This month
    if (sameYear && d.getMonth() === now.getMonth()) {
      if (isIncome) {
        thisMonthIncome.push(txn);
      } else if (isExpense) {
        thisMonthExpense.push(txn);
      }
    }
    // Last month
    else if (sameYear && d.getMonth() === (now.getMonth() - 1 + 12) % 12) {
      if (isIncome) {
        lastMonthIncome.push(txn);
      } else if (isExpense) {
        lastMonthExpense.push(txn);
      }
    }
  });

  // 🔥 FIX: Calculate totals SEPARATELY
  const thisMonthTotalIncome = thisMonthIncome.reduce(
    (sum, txn) => sum + Math.abs(Number(txn.amount) || 0),
    0
  );
  const thisMonthTotalExpense = thisMonthExpense.reduce(
    (sum, txn) => sum + Math.abs(Number(txn.amount) || 0),
    0
  );
  const lastMonthTotalExpense = lastMonthExpense.reduce(
    (sum, txn) => sum + Math.abs(Number(txn.amount) || 0),
    0
  );

  // Transaction counts
  const thisMonthExpenseCount = thisMonthExpense.length;
  const thisMonthIncomeCount = thisMonthIncome.length;
  const thisMonthCount = thisMonthExpenseCount + thisMonthIncomeCount;

  // 🔥 FIX: Savings = Income - Expense
  const savings = thisMonthTotalIncome - thisMonthTotalExpense;
  const isOverspent = savings < 0;

  // Remaining budget (based on expense only)
  const remainingBudget = MONTHLY_BUDGET - thisMonthTotalExpense;

  // Mood and summary
  let mood = "neutral";
  let summaryText = "You're on track this month. ⚖️";

  if (isOverspent) {
    mood = "bad";
    summaryText = `⚠️ You overspent by ₹${Math.abs(savings).toLocaleString("en-IN")}! Expenses exceeded income. Let's control next month. 💪`;
  } else if (savings > 0) {
    mood = "good";
    summaryText = `🎉 Great job! You saved ₹${savings.toLocaleString("en-IN")} this month. Keep it up! 🏆`;
  } else if (remainingBudget > 3000) {
    mood = "good";
    summaryText = `Nice! You still have ₹${remainingBudget.toLocaleString("en-IN")} left in your budget. 🏆`;
  } else if (remainingBudget < 0) {
    mood = "bad";
    summaryText = `You crossed budget by ₹${Math.abs(remainingBudget).toLocaleString("en-IN")}. Next month we save harder 💪`;
  }

  // 🔥 FIX: Category summary - ONLY EXPENSES
  const catMap = new Map();
  thisMonthExpense.forEach((e) => {
    const key = e.category || "Other";
    const amt = Math.abs(Number(e.amount) || 0);
    catMap.set(key, (catMap.get(key) || 0) + amt);
  });

  const categories = Array.from(catMap.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount);

  // Top category
  const topCategory = categories.length > 0 ? categories[0] : null;

  // 🔥 FIX: Trend comparison - ONLY EXPENSES
  let trendText;
  if (lastMonthTotalExpense === 0 && thisMonthTotalExpense === 0) {
    trendText = "You're just getting started. Perfect time to build strong money habits.";
  } else if (lastMonthTotalExpense === 0 && thisMonthTotalExpense > 0) {
    trendText = "This is your first active month. I'll start comparing trends from next month.";
  } else {
    const diff = thisMonthTotalExpense - lastMonthTotalExpense;
    const percent = Math.round((Math.abs(diff) / lastMonthTotalExpense) * 100);
    if (diff > 0) {
      trendText = `Spending is up by ~${percent}% vs last month. Keep an eye on your top categories.`;
    } else if (diff < 0) {
      trendText = `Nice! Spending dropped by ~${percent}% vs last month. Keep this momentum.`;
    } else {
      trendText = "You spent almost the same as last month. Try changing one category at a time.";
    }
  }

  // Suggestion text
  let suggestionText;
  if (isOverspent) {
    suggestionText = "You spent more than you earned. Next month, set strict limits on your highest spend category.";
  } else if (savings > 0) {
    suggestionText = `You have ₹${savings.toLocaleString("en-IN")} in savings. Consider investing or building an emergency fund.`;
  } else if (remainingBudget >= 0) {
    suggestionText = "You still have room in your budget. Move some of it into savings at month end.";
  } else {
    suggestionText = "You crossed your budget. Next month, set limits on your highest spend category.";
  }

  const tips = [
    {
      title: "Where most of your money goes",
      emoji: "📌",
      text: topCategory
        ? `Your highest spend is in "${topCategory.label}" with ₹${topCategory.amount.toLocaleString("en-IN")}.`
        : "I'll highlight your biggest category once you add a few expenses.",
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
      // 🔥 NEW: Include all financial metrics
      totalIncome: Math.round(thisMonthTotalIncome),
      totalExpense: Math.round(thisMonthTotalExpense),
      savings: Math.round(savings),
      isOverspent,
      thisMonthTotal: Math.round(thisMonthTotalExpense), // For backward compatibility
      thisMonthCount,
      thisMonthExpenseCount,
      thisMonthIncomeCount,
      remainingBudget: Math.round(remainingBudget),
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

    // Fetch all transactions
    const transactions = await Expense.find({ userId }).sort({ date: 1 });

    console.log(`📊 Insights: Found ${transactions.length} transactions for user ${userId}`);

    const data = calcInsights(transactions);

    console.log("📊 Calculated insights:", {
      totalIncome: data.summary.totalIncome,
      totalExpense: data.summary.totalExpense,
      savings: data.summary.savings,
      categories: data.categories.length,
    });

    return res.json(data);
  } catch (err) {
    console.error("Insight error:", err);
    res.status(500).json({ message: "Failed to generate insights" });
  }
};

module.exports = { getInsights };