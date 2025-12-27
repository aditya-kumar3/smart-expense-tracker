// backend/controllers/aiChatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require("../models/Expense");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

exports.chatWithAI = async (req, res) => {
  try {
    const { userId, question } = req.body;

    if (!userId || !question) {
      return res.status(400).json({
        success: false,
        answer: "userId & question required",
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startOfMonth },
    }).lean();

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
      Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0] || [
        "kisi bhi category",
        0,
      ];

    // --- fallback rule-based answer (agar Gemini crash kare to bhi yeh milega) ---
    const fallbackAnswer = (() => {
      const spentLine =
        total > 0
          ? `Is mahine tumne approx ₹${total.toFixed(
              0
            )} spend kiye, jisme sabse zyada kharcha "${topCategory}" pe hai (₹${topAmount.toFixed(
              0
            )}).`
          : "Abhi tak is mahine koi kharcha track nahi hua hai.";

      if (question.toLowerCase().includes("sabse zyada")) {
        return `${spentLine} Agar tum is top category ko 10–20% reduce karo, to next month ki saving clearly better ho sakti hai. 💰`;
      }

      if (question.toLowerCase().includes("kitna save")) {
        return `${spentLine} Exact saving tumhare income pe depend karegi, lekin agar unnecessary spends ko thoda trim karo to har mahine +₹1000–₹2000 extra save ho sakte hain. 📈`;
      }

      return `${spentLine} Jo bhi doubt ho spending ke bare mein, try karo categories pe limit set karne ka – jaise food, travel, subs, etc. Small tweaks se bhi kaafi farq aata hai. 🙂`;
    })();

    // agar API key hi nahi hai, seedha fallback bhej do
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing, using fallback answer.");
      return res.json({ success: true, answer: fallbackAnswer });
    }

    // Gemini prompt
    const prompt = `
Tum ek friendly financial coach ho, Hinglish + emojis mein 4–7 short lines mein answer do.

User ka sawaal: ${question}

Spending data (current month):
Total spend: ₹${total}
Top category: ${topCategory} (₹${topAmount})
Category-wise: ${Object.entries(categoryMap)
      .map(([c, v]) => `${c}: ₹${v}`)
      .join(", ")}
Jo data diya hai sirf usi par base hoke jawab do, random numbers mat banao.
`;

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return res.json({
        success: true,
        answer: text || fallbackAnswer,
      });
    } catch (llmErr) {
      console.error("Gemini call failed, using fallback:", llmErr);
      return res.json({
        success: true,
        answer: fallbackAnswer,
      });
    }
  } catch (err) {
    console.error("AI Chat Error (outer):", err);
    return res.status(500).json({
      success: false,
      answer:
        "Server side thoda confuse ho gaya. Thodi der baad dobara try kar lena. 😅",
    });
  }
};
