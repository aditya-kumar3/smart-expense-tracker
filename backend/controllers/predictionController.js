// backend/controllers/predictionController.js

const Expense = require("../models/Expense");

exports.getPrediction = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    // last 3 months ka start (including current month)
    const startRange = new Date(currentYear, currentMonthIndex - 2, 1);
    const endRange = new Date(currentYear, currentMonthIndex + 1, 1);

    const expenses = await Expense.find({
      userId,
      date: { $gte: startRange, $lt: endRange },
    }).lean();

    // month-wise totals
    const monthMap = {};
    expenses.forEach((e) => {
      const d = new Date(e.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`; // e.g. "2025-10"
      monthMap[key] = (monthMap[key] || 0) + (Number(e.amount) || 0);
    });

    const monthKeys = Object.keys(monthMap).sort(); // oldest -> latest

    const lastThreeTotals = monthKeys.map((key) => monthMap[key]);
    const monthsCount = lastThreeTotals.length || 1;

    const totalAll = lastThreeTotals.reduce((s, v) => s + v, 0);
    const avgMonthly = totalAll / monthsCount;

    const currentKey = `${currentYear}-${currentMonthIndex}`;
    const currentTotal = monthMap[currentKey] || 0;

    // simple prediction: avg + small trend factor
    const trendFactor = currentTotal > avgMonthly ? 0.12 : 0.06;
    const predicted = Math.round(avgMonthly * (1 + trendFactor));

    // next month label
    const nextMonthDate = new Date(currentYear, currentMonthIndex + 1, 1);
    const nextMonthLabel = nextMonthDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });

    // small rule-based text
    let advice = "";
    if (currentTotal === 0) {
      advice =
        "Is month abhi tak koi kharcha record nahi hua. Fresh start hai, budget tight rakho aur smart planning karo. 💡";
    } else if (currentTotal < avgMonthly * 0.8) {
      advice =
        "Is month ka spending abhi average se kaafi kam hai. Discipline strong lag rahi hai, bas consistency banaye rakho. 💪";
    } else if (currentTotal <= avgMonthly * 1.2) {
      advice =
        "Spending almost average level pe hai. Thoda food/entertainment categories pe nazar rakho aur month-end tak ₹ savings target decide karo. 📊";
    } else {
      advice =
        "Is month spending average se thoda high hai. Top 1-2 categories cut karo, warna next month prediction bhi heavy ho sakta hai. ⚠️";
    }

    return res.json({
      success: true,
      currentMonth: {
        label: now.toLocaleString("default", {
          month: "long",
          year: "numeric",
        }),
        total: currentTotal,
      },
      averageMonthly: Math.round(avgMonthly),
      predictedNextMonth: {
        label: nextMonthLabel,
        total: predicted,
      },
      last3Months: monthKeys.map((key) => {
        const [y, m] = key.split("-");
        const d = new Date(Number(y), Number(m), 1);
        return {
          label: d.toLocaleString("default", { month: "short", year: "2-digit" }),
          total: monthMap[key],
        };
      }),
      advice,
    });
  } catch (err) {
    console.error("Prediction error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to calculate prediction",
    });
  }
};
