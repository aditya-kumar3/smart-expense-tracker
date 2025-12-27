// backend/controllers/aiController.js
const Expense = require("../models/Expense");

exports.getAiInsight = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth },
    }).lean();

    // agar koi expense hi nahi hai, 200 bhejo but text empty
    if (!expenses.length) {
      return res.json({
        success: true,
        text: "",
        haveData: false,
      });
    }

    const total = expenses.reduce(
      (sum, e) => sum + (Number(e.amount) || 0),
      0
    );

    const categoryMap = {};
    expenses.forEach((e) => {
      const cat = e.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Number(e.amount || 0);
    });

    const [topCategory, topAmount] =
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0];

    const avg = total / Math.max(1, expenses.length);

    const hint = `Is mahine tumne total ₹${total.toFixed(
      0
    )} spend kiye, jisme sabse zyada kharcha "${topCategory}" pe gaya (₹${topAmount.toFixed(
      0
    )}). Average transaction lagbhag ₹${avg.toFixed(
      0
    )} hai. Agar next month iss top category ko thoda control karo, to saving easily badh sakti hai.`;

    return res.json({
      success: true,
      text: hint,
      haveData: true,
    });
  } catch (err) {
    console.error("AI insight error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while generating insight",
    });
  }
};
