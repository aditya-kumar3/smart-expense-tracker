const Expense = require ("../models/Expense");

/* =========================
   ADD EXPENSE / INCOME
========================= */
async function addExpense(req, res) {
  try {
    const {
      userId,
      amount,
      type, // "income" | "expense"
      category,
      paymentMethod,
      note,
      date,
      title,
      source, // salary | freelance | other
    } = req.body;

    if (!userId || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "userId, amount aur type required hain.",
      });
    }

    if (type === "income" && !source) {
      return res.status(400).json({
        success: false,
        message: "Income ke liye source required hai.",
      });
    }

    const safeTitle =
      title ||
      category ||
      (type === "income" ? "Income added" : "Expense added");

    const expense = await Expense.create({
      userId,
      title: safeTitle,
      amount: Math.abs(Number(amount)), // 🔥 normalize
      type,
      source: type === "income" ? source : null,
      category: category || "General",
      paymentMethod: paymentMethod || "N/A",
      note: note || "",
      date: date ? new Date(date) : new Date(),
    });

    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (err) {
    console.error("Add expense error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error while adding expense.",
    });
  }
}

/* =========================
   LIST TRANSACTIONS
========================= */
async function listExpenses(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .lean();

    // 🔥 UI friendly sign
    const formatted = expenses.map((t) => ({
      ...t,
      displayAmount:
        t.type === "income"
          ? `+₹${t.amount}`
          : `-₹${t.amount}`,
    }));

    return res.json({
      success: true,
      expenses: formatted,
    });
  } catch (err) {
    console.error("List expenses error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error while loading expenses.",
    });
  }
}

/* =========================
   MONTHLY SUMMARY (FIXED)
========================= */
async function getMonthlySummary(req, res) {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "userId, month aur year required hain.",
      });
    }

    const m = Number(month);
    const y = Number(year);

    const start = new Date(y, m - 1, 1);
    const end = new Date(y, m, 0, 23, 59, 59, 999);

    const transactions = await Expense.find({
      userId,
      date: { $gte: start, $lte: end },
    })
      .sort({ date: 1 })
      .lean();

    let totalIncome = 0;
    let totalExpense = 0;
    let salaryIncome = 0;
    let otherIncome = 0;

    transactions.forEach((t) => {
      const amt = Math.abs(Number(t.amount) || 0);

      if (t.type === "income") {
        totalIncome += amt;
        if (t.source === "salary") salaryIncome += amt;
        else otherIncome += amt;
      }

      if (t.type === "expense") {
        totalExpense += amt;
      }
    });

    const balance = totalIncome - totalExpense;

    const formatted = transactions.map((t) => ({
      ...t,
      displayAmount:
        t.type === "income"
          ? `+₹${t.amount}`
          : `-₹${t.amount}`,
    }));

    return res.json({
      success: true,
      totalIncome,
      salaryIncome,
      otherIncome,
      totalExpense,
      balance,
      transactions: formatted,
    });
  } catch (err) {
    console.error("Monthly summary error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error while loading summary.",
    });
  }
}

module.exports = {
  addExpense,
  listExpenses,
  getMonthlySummary,
};
