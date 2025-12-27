const Expense = require("../models/Expense");

exports.getAlerts = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId required",
      });
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    // load current month
    const current = await Expense.find({
      userId,
      date: { $gte: currentMonthStart },
    }).lean();

    // load previous month
    const previous = await Expense.find({
      userId,
      date: { $gte: previousMonthStart, $lt: currentMonthStart },
    }).lean();

    const currentTotal = current.reduce(
      (s, e) => s + (Number(e.amount) || 0),
      0
    );
    const previousTotal = previous.reduce(
      (s, e) => s + (Number(e.amount) || 0),
      0
    );

    // find top category
    const catMap = {};
    current.forEach((e) => {
      catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount || 0);
    });
    const topCategory =
      Object.entries(catMap).sort((a, b) => b[1] - a[1])[0] || ["None", 0];

    const alerts = [];

    // alert #1: heavy spending
    if (previousTotal > 0 && currentTotal > previousTotal * 1.2) {
      alerts.push(
        `🔥 Spending increased by ${Math.round(
          ((currentTotal - previousTotal) / previousTotal) * 100
        )}% compared to last month`
      );
    }

    // alert #2: heavy category
    if (topCategory[1] > currentTotal * 0.35) {
      alerts.push(`🍽 High spend spotted on ${topCategory[0]}`);
    }

    // alert #3: very controlled
    if (currentTotal < previousTotal * 0.6 && currentTotal > 0) {
      alerts.push(`🏆 Amazing control this month. Keep it up!`);
    }

    // default
    if (alerts.length === 0) {
      alerts.push("🙂 Money flow smooth. No alerts this month.");
    }

    return res.json({
      success: true,
      alerts,
    });
  } catch (err) {
    console.error("Alert Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to generate alerts",
    });
  }
};
