// backend/controllers/aiChatController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Expense = require("../models/Expense");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

exports.chatWithAI = async (req, res) => {
  try {
    const { userId, question } = req.body;

    console.log("🤖 CHAT CONTROLLER V2.0 - New Version");

    if (!userId || !question) {
      return res.status(400).json({
        success: false,
        answer: "userId & question required",
      });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await Expense.find({
      userId,
      date: { $gte: startOfMonth },
    }).lean();

    // 🔥 FIX: SEPARATE INCOME AND EXPENSE
    let totalIncome = 0;
    let totalExpense = 0;
    const categoryMap = {};

    transactions.forEach((t) => {
      const amt = Math.abs(Number(t.amount) || 0);
      const type = (t.type || "").toLowerCase().trim();

      if (type === "income") {
        totalIncome += amt;
      } else if (type === "expense") {
        totalExpense += amt;
        const cat = t.category || "Other";
        categoryMap[cat] = (categoryMap[cat] || 0) + amt;
      }
    });

    // Calculate savings
    const savings = totalIncome - totalExpense;
    const isOverspent = savings < 0;

    // Expense count
    const expenseCount = transactions.filter(
      (t) => (t.type || "").toLowerCase() === "expense"
    ).length;

    // Top category
    const categoryEntries = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
    const [topCategory, topAmount] = categoryEntries.length > 0
      ? categoryEntries[0]
      : ["koi category nahi", 0];

    console.log("💰 Calculated:", { totalIncome, totalExpense, savings, topCategory });

    // 🔥 FIX: Build proper summary for context
    const spendingSummary = `
Income: ₹${totalIncome}
Expenses: ₹${totalExpense}
Savings: ₹${savings} ${isOverspent ? "(Overspent!)" : ""}
Expense Count: ${expenseCount}
Top Category: ${topCategory} (₹${topAmount})
Categories: ${categoryEntries.map(([c, v]) => `${c}: ₹${v}`).join(", ") || "No expenses"}
    `.trim();

    // 🔥 FIX: Smart fallback answers based on question
    const fallbackAnswer = (() => {
      const q = question.toLowerCase();

      // No data case
      if (totalIncome === 0 && totalExpense === 0) {
        return "Abhi tak is mahine koi transaction nahi hai. Dashboard se income aur expenses add karo! 📝";
      }

      // Status lines
      const incomeText = `Income: ₹${totalIncome.toLocaleString("en-IN")}`;
      const expenseText = `Kharcha: ₹${totalExpense.toLocaleString("en-IN")}`;
      const savingsText = isOverspent 
        ? `⚠️ Tum ₹${Math.abs(savings).toLocaleString("en-IN")} overspent ho!`
        : `✅ Savings: ₹${savings.toLocaleString("en-IN")}`;
      const topCatText = totalExpense > 0 
        ? `Top spend: "${topCategory}" (₹${topAmount.toLocaleString("en-IN")})`
        : "";

      // Question-specific answers
      if (q.includes("save") || q.includes("saving") || q.includes("bacha") || q.includes("kitna")) {
        if (isOverspent) {
          return `${incomeText}, ${expenseText}. ${savingsText} Next month budget tight rakho! 💪`;
        }
        return `🎉 ${incomeText}, ${expenseText}. ${savingsText} Great job! Keep it up! 💰`;
      }

      if (q.includes("income") || q.includes("earn") || q.includes("kamai") || q.includes("salary")) {
        return `${incomeText} is mahine. ${savingsText}`;
      }

      if (q.includes("expense") || q.includes("spend") || q.includes("kharcha") || q.includes("kharch")) {
        return `${expenseText} across ${expenseCount} transactions. ${topCatText}. ${savingsText}`;
      }

      if (q.includes("top") || q.includes("sabse") || q.includes("zyada") || q.includes("highest") || q.includes("max")) {
        if (totalExpense === 0) {
          return "Abhi tak koi expense nahi hua is mahine! 🎉";
        }
        return `Sabse zyada kharcha "${topCategory}" pe hua: ₹${topAmount.toLocaleString("en-IN")}. Isko 15-20% kam karo next month! 💡`;
      }

      if (q.includes("category") || q.includes("breakdown")) {
        if (categoryEntries.length === 0) {
          return "Abhi koi expense categories nahi hain. Expenses add karo dashboard se!";
        }
        const catList = categoryEntries.map(([c, v]) => `${c}: ₹${v.toLocaleString("en-IN")}`).join(", ");
        return `Category breakdown: ${catList}. ${savingsText}`;
      }

      if (q.includes("budget") || q.includes("limit")) {
        return `${incomeText}, ${expenseText}. ${savingsText} Monthly budget set karo aur categories pe limits rakho! 📊`;
      }

      if (q.includes("tip") || q.includes("advice") || q.includes("suggest")) {
        if (isOverspent) {
          return `⚠️ Tum overspent ho! "${topCategory}" pe ₹${topAmount.toLocaleString("en-IN")} gaya. Isko 30% cut karo next month. Emergency fund bhi banao! 💪`;
        }
        return `👍 Good going! "${topCategory}" pe thoda aur control karo, aur savings ko invest karo. SIP start karo agar nahi ki! 📈`;
      }

      if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("kaise")) {
        return `Hey! 👋 Main tumhara finance buddy hun. ${incomeText}, ${expenseText}, ${savingsText}. Kuch aur puchna ho toh batao! 😊`;
      }

      // Default comprehensive answer
      return `📊 Is mahine: ${incomeText}, ${expenseText}. ${savingsText} ${topCatText ? topCatText + "." : ""} Kuch specific puchna ho toh batao! 🙂`;
    })();

    // Agar API key nahi hai, fallback use karo
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY missing, using fallback.");
      return res.json({ success: true, answer: fallbackAnswer });
    }

    // 🔥 FIX: Proper Gemini prompt with CORRECT data
    const prompt = `
Tum ek friendly Indian financial coach ho. Hinglish mein answer do. Emojis use karo. 3-5 lines mein concise answer do.

IMPORTANT RULES:
1. Income aur Expense ALAG hain - KABHI mix mat karo!
2. Savings = Income - Expense
3. Sirf actual data use karo, random numbers mat banao
4. Agar income ke baare mein pucha to income batao
5. Agar savings ke baare mein pucha to savings batao
6. Friendly aur supportive tone rakho

User ka sawaal: "${question}"

User ka ACTUAL financial data (current month):
${spendingSummary}

CORRECT information ke saath helpful answer do.
`.trim();

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log("✅ Gemini response received");

      return res.json({
        success: true,
        answer: text || fallbackAnswer,
      });
    } catch (llmErr) {
      console.error("Gemini failed, using fallback:", llmErr.message);
      return res.json({
        success: true,
        answer: fallbackAnswer,
      });
    }
  } catch (err) {
    console.error("AI Chat Error:", err);
    return res.status(500).json({
      success: false,
      answer: "Server thoda confuse ho gaya. Try again! 😅",
    });
  }
};