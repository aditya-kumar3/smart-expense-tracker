// backend/controllers/aiController.js
const Expense = require("../models/Expense");

exports.getAiInsight = async (req, res) => {
  try {
    const { userId } = req.body;

    // 🔥 DEBUG LOG - Ye confirm karega ki NEW code chal raha hai
    console.log("========================================");
    console.log("🚀 NEW AI CONTROLLER VERSION 2.0");
    console.log("========================================");

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await Expense.find({
      userId,
      date: { $gte: startOfMonth },
    }).lean();

    // 🔥 DEBUG: Print each transaction
    console.log("📊 Total Transactions:", transactions.length);
    transactions.forEach((t, i) => {
      console.log(`   ${i + 1}. Type: "${t.type}" | Amount: ${t.amount} | Category: ${t.category}`);
    });

    if (!transactions.length) {
      return res.json({
        success: true,
        text: "",
        haveData: false,
      });
    }

    // 🔥 SEPARATE INCOME AND EXPENSE
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};

    transactions.forEach((t) => {
      const amt = Math.abs(Number(t.amount) || 0);
      const type = (t.type || "").toLowerCase().trim();

      console.log(`   Processing: type="${type}", amount=${amt}`);

      if (type === "income") {
        totalIncome += amt;
      } else if (type === "expense") {
        totalExpense += amt;
        const cat = t.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      }
    });

    // 🔥 DEBUG: Print calculated values
    console.log("💰 CALCULATED VALUES:");
    console.log(`   Income: ₹${totalIncome}`);
    console.log(`   Expense: ₹${totalExpense}`);
    console.log(`   Savings: ₹${totalIncome - totalExpense}`);
    console.log("========================================");

    const savings = totalIncome - totalExpense;
    const isOverspent = savings < 0;

    const expenseCount = transactions.filter(
      (t) => (t.type || "").toLowerCase() === "expense"
    ).length;

    const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const [topCategory, topAmount] = categoryEntries.length > 0 
      ? categoryEntries[0] 
      : ["N/A", 0];

    const avgExpense = expenseCount > 0 ? Math.round(totalExpense / expenseCount) : 0;

    // Generate hint
    let hint = "";

    if (totalIncome === 0 && totalExpense === 0) {
      hint = "Abhi tak is mahine koi transaction nahi. Dashboard se add karo! 📝";
    } else if (totalExpense === 0 && totalIncome > 0) {
      hint = `Is mahine income ₹${totalIncome.toLocaleString("en-IN")} hai. Koi expense nahi! 💰`;
    } else if (totalIncome === 0 && totalExpense > 0) {
      hint = `Is mahine ₹${totalExpense.toLocaleString("en-IN")} spend kiye. Top: "${topCategory}" (₹${topAmount.toLocaleString("en-IN")}). 📊`;
    } else if (isOverspent) {
      hint = `⚠️ Income ₹${totalIncome.toLocaleString("en-IN")}, Kharcha ₹${totalExpense.toLocaleString("en-IN")}. ₹${Math.abs(savings).toLocaleString("en-IN")} overspent! 💪`;
    } else {
      hint = `🎉 Income ₹${totalIncome.toLocaleString("en-IN")}, Kharcha ₹${totalExpense.toLocaleString("en-IN")}, Savings ₹${savings.toLocaleString("en-IN")}! Top: "${topCategory}" (₹${topAmount.toLocaleString("en-IN")}). 💰`;
    }

    console.log("📝 Generated Hint:", hint);

    return res.json({
      success: true,
      text: hint,
      haveData: true,
    });
  } catch (err) {
    console.error("AI insight error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};