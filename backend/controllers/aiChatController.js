const Expense = require("../models/Expense");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req, res) => {
  try {
    const { userId, question } = req.body;
    if (!userId || !question) {
      return res.status(400).json({ message: "userId and question required" });
    }

    // 1️⃣ Fetch this month transactions
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await Expense.find({
      userId,
      date: { $gte: startOfMonth },
    }).lean();

    // 2️⃣ Calculate stats
    let income = 0;
    let expense = 0;
    const categoryMap = {};

    transactions.forEach((t) => {
      const amt = Math.abs(Number(t.amount) || 0);
      if (t.type === "income") income += amt;
      if (t.type === "expense") {
        expense += amt;
        const cat = t.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      }
    });

    const savings = income - expense;
    const topCategory =
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || [];

    // 3️⃣ Build AI context (THIS IS KEY)
    const context = `
User finance data (current month):
- Total income: ₹${income}
- Total expense: ₹${expense}
- Savings: ₹${savings}
- Top spending category: ${topCategory[0] || "N/A"} (₹${topCategory[1] || 0})
- Number of transactions: ${transactions.length}

User question:
"${question}"

Rules:
- Answer clearly in Hinglish
- No repetition
- No fake numbers
- Only use given data
- Give short, helpful answer
`;

    // 4️⃣ Call Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(context);
    const text = result.response.text();

    return res.json({
      success: true,
      answer: text,
    });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ success: false, message: "AI failed" });
  }
};
