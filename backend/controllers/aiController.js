const { getMonthlySummary } = require("./expenseController");

exports.getAiInsight = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "userId required" });
    }

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    // reuse correct calculation
    const fakeReq = {
      query: { userId, month, year },
    };

    let summaryData;
    const fakeRes = {
      json: (data) => (summaryData = data),
      status: () => fakeRes,
    };

    await getMonthlySummary(fakeReq, fakeRes);

    if (!summaryData || !summaryData.success) {
      return res.json({ success: true, text: "", haveData: false });
    }

    const {
      totalIncome,
      totalExpense,
      balance,
      transactions,
    } = summaryData;

    const expenseTx = transactions.filter(t => t.type === "expense");
    const expenseCount = expenseTx.length;

    const categoryMap = {};
    expenseTx.forEach(t => {
      const cat = t.category || "Other";
      categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(Number(t.amount));
    });

    const [topCategory, topAmount] =
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];

    const avgExpense =
      expenseCount > 0 ? Math.round(totalExpense / expenseCount) : 0;

    let text = "";

    if (totalIncome === 0 && totalExpense === 0) {
      text = "Abhi tak is mahine koi transaction nahi hua.";
    } else if (totalExpense === 0) {
      text = `Is mahine income ₹${totalIncome}. Abhi tak koi expense nahi hua. Great start!`;
    } else if (balance < 0) {
      text = `⚠️ Is mahine income ₹${totalIncome} aur kharcha ₹${totalExpense} ho gaya. Overspend ₹${Math.abs(balance)}. "${topCategory}" sabse zyada hai.`;
    } else {
      text = `🎉 Is mahine income ₹${totalIncome}, expense ₹${totalExpense}, aur savings ₹${balance}. Top spend "${topCategory}" (₹${topAmount}). Avg expense ₹${avgExpense}.`;
    }

    return res.json({
      success: true,
      text,
      haveData: true,
    });
  } catch (err) {
    console.error("AI insight error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
