// backend/controllers/expenseController.js
const Expense = require("../models/Expense");

// -------------------- ADD EXPENSE / INCOME --------------------
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
      source, // 👈 NEW (salary | freelance | other)
    } = req.body;

    if (!userId || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: "userId, amount aur type required hain.",
      });
    }

    // income ke liye source mandatory
    if (type === "income" && !source) {
      return res.status(400).json({
        success: false,
        message: "Income ke liye source (salary/freelance/other) required hai.",
      });
    }

    const safeTitle =
      title ||
      category ||
      (type === "income" ? "Income added" : "Expense added");

    const expense = await Expense.create({
      userId,
      title: safeTitle,
      amount: Number(amount),
      type,
      source: type === "income" ? source : null, // 👈 core logic
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

// -------------------- LIST EXPENSES --------------------
async function listExpenses(req, res) {
  try {
    const { userId } = req.query;
    const query = {};
    if (userId) query.userId = userId;

    const expenses = await Expense.find(query)
      .sort({ date: -1 })
      .lean();

    return res.json({
      success: true,
      expenses,
    });
  } catch (err) {
    console.error("List expenses error:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Server error while loading expenses.",
    });
  }
}

// -------------------- MONTHLY SUMMARY --------------------
async function getMonthlySummary(req, res) {
  try {
    const { userId, month, year } = req.query;

    if (!userId || !month || !year) {
      return res.status(400).json({
        success: false,
        message: "userId, month aur year required hain summary ke liye.",
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
      const amt = Number(t.amount) || 0;

      if (t.type === "income") {
        totalIncome += amt;
        if (t.source === "salary") salaryIncome += amt;
        else otherIncome += amt;
      } else {
        totalExpense += amt;
      }
    });

    const balance = totalIncome - totalExpense;

    return res.json({
      success: true,
      totalIncome,
      salaryIncome,
      otherIncome,
      totalExpense,
      balance,
      transactions,
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
