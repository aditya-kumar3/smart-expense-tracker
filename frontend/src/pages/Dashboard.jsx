// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Bell,
  PlusCircle,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  TrendingUp,
  Sparkles,
  Zap,
  Crown,
  ChevronRight,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Gem,
  BarChart3,
  Coins,
  Receipt,
  Star,
  Calendar,
  Info,
} from "lucide-react";

import AppShell from "../compnents/layout/AppShell";
import { fetchTransactions, createTransaction } from "../services/transactions";
import { fetchGoalStatus, saveGoal } from "../services/goals";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const CHART_COLORS = ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19", "#ff6b9d"];
// ════════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ════════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ═══════════════════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════════════════
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    paymentMethod: "",
    note: "",
    source: "",
  });

  const [goal, setGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    monthlyTarget: "",
    deadline: "",
  });
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState("");

  // ═══════════════════════════════════════════════════════════════════════════
  // CALCULATIONS - 100% ACCURATE
  // ═══════════════════════════════════════════════════════════════════════════
  const summary = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      const amount = Math.abs(Number(t.amount) || 0);
      const type = (t.type || "").toLowerCase().trim();

      if (type === "income") {
        totalIncome += amount;
      } else if (type === "expense") {
        totalExpense += amount;
      }
    });

    return {
      totalIncome: Math.round(totalIncome),
      totalExpense: Math.round(totalExpense),
      balance: Math.round(totalIncome - totalExpense),
    };
  }, [transactions]);

  // Goal Progress
  const goalProgress = useMemo(() => {
    if (!goal) return null;

    const targetAmount = Number(goal.targetAmount) || 0;
    const monthlyTarget = Number(goal.monthlyTarget) || 0;
    const savedAmount = Math.max(0, summary.balance);

    const progressPercent =
      targetAmount > 0
        ? Math.min(100, Math.round((savedAmount / targetAmount) * 100))
        : 0;

    const remainingAmount = Math.max(0, targetAmount - savedAmount);
    const isOnTrack = monthlyTarget > 0 ? savedAmount >= monthlyTarget : true;

    let daysRemaining = null;
    if (goal.deadline) {
      const deadlineDate = new Date(goal.deadline);
      const today = new Date();
      const diffTime = deadlineDate - today;
      daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }

    return {
      savedAmount,
      progressPercent,
      remainingAmount,
      isOnTrack,
      daysRemaining,
      monthlyTarget,
    };
  }, [goal, summary.balance]);

  // Category Data for Pie Chart
  const categoryData = useMemo(() => {
    const categoryMap = {};

    transactions.forEach((t) => {
      const type = (t.type || "").toLowerCase().trim();
      if (type !== "expense") return;

      const category = t.category || "Other";
      const amount = Math.abs(Number(t.amount) || 0);
      categoryMap[category] = (categoryMap[category] || 0) + amount;
    });

    return Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [transactions]);

  // Trend Data for Area Chart
  const trendData = useMemo(() => {
    const sortedTx = [...transactions].sort(
      (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    );

    let runningBalance = 0;

    return sortedTx.map((t) => {
      const amount = Math.abs(Number(t.amount) || 0);
      const type = (t.type || "").toLowerCase().trim();

      if (type === "income") {
        runningBalance += amount;
      } else {
        runningBalance -= amount;
      }

      return {
        date: new Date(t.date || t.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        value: Math.round(runningBalance),
      };
    });
  }, [transactions]);

  // Smart Alerts
  const alerts = useMemo(() => {
    const alertList = [];
    const { totalIncome, totalExpense, balance } = summary;

    if (totalExpense > totalIncome && totalIncome > 0) {
      alertList.push({
        type: "danger",
        title: "Overspending Alert!",
        message: `You've spent ₹${(totalExpense - totalIncome).toLocaleString("en-IN")} more than your income.`,
      });
    }

    if (totalIncome > 0 && totalExpense > totalIncome * 0.8 && totalExpense <= totalIncome) {
      const spentPercent = Math.round((totalExpense / totalIncome) * 100);
      alertList.push({
        type: "warning",
        title: "High Spending Warning",
        message: `You've used ${spentPercent}% of your income.`,
      });
    }

    if (totalIncome > 0 && balance > 0 && balance >= totalIncome * 0.2) {
      const savedPercent = Math.round((balance / totalIncome) * 100);
      alertList.push({
        type: "success",
        title: "Great Savings! 🎉",
        message: `You've saved ${savedPercent}% of your income!`,
      });
    }

    if (goal && goalProgress && goalProgress.progressPercent >= 100) {
      alertList.push({
        type: "success",
        title: "Goal Achieved! 🏆",
        message: `You've reached your "${goal.name}" goal!`,
      });
    }

    if (goal && goalProgress && goalProgress.progressPercent >= 75 && goalProgress.progressPercent < 100) {
      alertList.push({
        type: "info",
        title: "Almost There!",
        message: `You're ${goalProgress.progressPercent}% towards "${goal.name}"!`,
      });
    }

    if (totalIncome === 0 && totalExpense === 0) {
      alertList.push({
        type: "info",
        title: "Welcome! 👋",
        message: "Add your first transaction to start tracking.",
      });
    }

    return alertList;
  }, [summary, goal, goalProgress]);

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA LOADING
  // ═══════════════════════════════════════════════════════════════════════════
  const loadTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const now = new Date();
      const response = await fetchTransactions({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      const txList = Array.isArray(response)
        ? response
        : response?.transactions || response?.data || [];

      setTransactions(txList);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGoal = useCallback(async () => {
    try {
      if (!user?.id) return;

      const response = await fetchGoalStatus(user.id);

      if (response?.goal) {
        setGoal(response.goal);
        setGoalForm({
          name: response.goal.name || "",
          targetAmount: response.goal.targetAmount?.toString() || "",
          monthlyTarget: response.goal.monthlyTarget?.toString() || "",
          deadline: response.goal.deadline
            ? new Date(response.goal.deadline).toISOString().slice(0, 10)
            : "",
        });
      }
    } catch (err) {
      console.error("Goal load error:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadTransactions();
    loadGoal();
  }, [loadTransactions, loadGoal]);

  // ═══════════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const showToastMsg = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      showToastMsg("Please enter a valid amount", "error");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload = {
        userId: user.id,
        amount: Math.round(Math.abs(Number(form.amount))),
        type: form.type.toLowerCase().trim(),
        category: form.category || (form.type === "income" ? "Salary" : "Other"),
        paymentMethod: form.paymentMethod || "cash",
        note: form.note || "",
        source: form.type === "income" ? (form.source || "salary") : undefined,
      };

      await createTransaction(payload);

      setForm({
        amount: "",
        type: "expense",
        category: "",
        paymentMethod: "",
        note: "",
        source: "",
      });

      await loadTransactions();

      showToastMsg(
        form.type === "income"
          ? `💰 Income of ₹${payload.amount.toLocaleString("en-IN")} added!`
          : `💸 Expense of ₹${payload.amount.toLocaleString("en-IN")} recorded!`,
        "success"
      );
    } catch (err) {
      setError(err.message || "Failed to add transaction");
      showToastMsg("Failed to add transaction", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoalFormChange = (e) => {
    const { name, value } = e.target;
    setGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();

    if (!goalForm.name?.trim() || !goalForm.targetAmount) {
      setGoalError("Please enter goal name and target amount");
      return;
    }

    try {
      setGoalLoading(true);
      setGoalError("");

      const payload = {
        userId: user.id,
        name: goalForm.name.trim(),
        targetAmount: Math.round(Number(goalForm.targetAmount)),
        monthlyTarget: goalForm.monthlyTarget
          ? Math.round(Number(goalForm.monthlyTarget))
          : undefined,
        deadline: goalForm.deadline || undefined,
      };

      await saveGoal(payload);
      await loadGoal();

      showToastMsg("🎯 Goal saved successfully!", "success");
    } catch (err) {
      setGoalError(err.message || "Failed to save goal");
      showToastMsg("Failed to save goal", "error");
    } finally {
      setGoalLoading(false);
    }
  };

  // Options
  const categoryOptions = [
    { value: "food", label: "🍔 Food & Dining" },
    { value: "transport", label: "🚗 Transport" },
    { value: "shopping", label: "🛍️ Shopping" },
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "bills", label: "📄 Bills & Utilities" },
    { value: "health", label: "🏥 Health" },
    { value: "education", label: "📚 Education" },
    { value: "travel", label: "✈️ Travel" },
    { value: "groceries", label: "🛒 Groceries" },
    { value: "other", label: "📦 Other" },
  ];

  const paymentOptions = [
    { value: "upi", label: "📱 UPI" },
    { value: "cash", label: "💵 Cash" },
    { value: "card", label: "💳 Card" },
    { value: "netbanking", label: "🏦 Net Banking" },
    { value: "wallet", label: "👛 Wallet" },
  ];

  const incomeSourceOptions = [
    { value: "salary", label: "💼 Salary" },
    { value: "freelance", label: "💻 Freelance" },
    { value: "business", label: "🏪 Business" },
    { value: "investment", label: "📈 Investment" },
    { value: "rental", label: "🏠 Rental" },
    { value: "other", label: "📦 Other" },
  ];

  const currentMonth = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const getAlertIcon = (type) => {
    switch (type) {
      case "danger": return <AlertCircle size={18} />;
      case "warning": return <Bell size={18} />;
      case "success": return <Sparkles size={18} />;
      default: return <Info size={18} />;
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="chart-tooltip">
        <p className="chart-tooltip-label">{label}</p>
        <p className="chart-tooltip-value">
          ₹ {Number(payload[0].value).toLocaleString("en-IN")}
        </p>
      </div>
    );
  };
    // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <AppShell>
      {/* Background */}
      <div className="dashboard-bg">
        <div className="bg-gradient" />
        <div className="bg-glow" />
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            <span className="toast-icon">
              {toast.type === "success" && <CheckCircle2 size={18} />}
              {toast.type === "error" && <AlertCircle size={18} />}
              {toast.type === "info" && <Info size={18} />}
              {toast.type === "warning" && <Bell size={18} />}
            </span>
            <span className="toast-message">{toast.message}</span>
            <button className="toast-close" onClick={() => setToast(null)}>
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="dashboard">
        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="alerts-section">
            {alerts.slice(0, 2).map((alert, index) => (
              <div key={index} className={`alert-card alert-${alert.type}`}>
                <div className={`alert-icon alert-icon-${alert.type}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="alert-content">
                  <h4 className="alert-title">{alert.title}</h4>
                  <p className="alert-message">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <div className="header-logo">
              <Wallet size={26} className="text-white" />
              <div className="header-crown">
                <Crown size={12} className="text-black" />
              </div>
            </div>
            <div className="header-info">
              <h1 className="header-title">
                <span className="title-gradient">SMART EXPENSE</span>
                <span className="header-badge">PRO</span>
              </h1>
              <p className="header-subtitle">{currentMonth} • Dashboard</p>
            </div>
          </div>

          <div className="header-right">
            <div className="header-welcome">
              <span className="welcome-text">
                Welcome, {user.name?.split(" ")[0] || "User"} 👋
              </span>
            </div>
            <button className="header-btn btn-ghost" onClick={() => navigate("/summary")}>
              <BarChart3 size={18} />
              <span className="btn-text">Reports</span>
            </button>
            <button className="header-btn btn-danger" onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Balance Card */}
        <div className="balance-card">
          <div className="balance-header">
            <div className="balance-left">
              <div className="balance-icon">
                <Gem size={22} className="text-indigo-400" />
              </div>
              <div className="balance-info">
                <span className="balance-label">Total Balance</span>
                <span className="balance-live">
                  <span className="live-dot"></span>
                  LIVE
                </span>
              </div>
            </div>
            <button className="balance-toggle" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          <div className="balance-amount">
            {showBalance ? (
              <span className={`amount-value ${summary.balance >= 0 ? "positive" : "negative"}`}>
                {summary.balance < 0 && "- "}₹ {Math.abs(summary.balance).toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="amount-hidden">₹ ••••••</span>
            )}
          </div>

          <div className="balance-stats">
            <div className="stat-box stat-income">
              <div className="stat-icon-box income">
                <ArrowUpRight size={16} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Income</span>
                <span className="stat-value text-emerald-400">
                  {showBalance ? `₹ ${summary.totalIncome.toLocaleString("en-IN")}` : "₹ ••••"}
                </span>
              </div>
            </div>

            <div className="stat-box stat-expense">
              <div className="stat-icon-box expense">
                <ArrowDownRight size={16} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Expense</span>
                <span className="stat-value text-rose-400">
                  {showBalance ? `₹ ${summary.totalExpense.toLocaleString("en-IN")}` : "₹ ••••"}
                </span>
              </div>
            </div>
          </div>

          {summary.totalIncome > 0 && (
            <div className="balance-footer">
              {summary.balance >= 0 ? (
                <>
                  <Sparkles size={16} className="text-emerald-400" />
                  <span>
                    You've saved <strong className="text-emerald-400">
                      {Math.round((summary.balance / summary.totalIncome) * 100)}%
                    </strong> of your income
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-rose-400" />
                  <span>
                    Overspent by <strong className="text-rose-400">
                      ₹{Math.abs(summary.balance).toLocaleString("en-IN")}
                    </strong>
                  </span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="quick-stat-card stat-crystal">
            <div className="qs-icon crystal">
              <TrendingUp size={20} />
            </div>
            <div className="qs-info">
              <span className="qs-label">Total Income</span>
              <span className="qs-value crystal">₹ {summary.totalIncome.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="quick-stat-card stat-pink">
            <div className="qs-icon pink">
              <ArrowDownRight size={20} />
            </div>
            <div className="qs-info">
              <span className="qs-label">Total Expense</span>
              <span className="qs-value pink">₹ {summary.totalExpense.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="content-grid">
          {/* Left Column */}
          <div className="content-left">
            {/* Charts Row */}
            <div className="charts-row">
              {/* Pie Chart */}
              <div className="chart-card card-aurora">
                <div className="chart-header">
                  <div className="chart-icon aurora">
                    <PieChartIcon size={18} />
                  </div>
                  <div className="chart-info">
                    <h3 className="chart-title">Expense Categories</h3>
                    <p className="chart-subtitle">{categoryData.length} categories</p>
                  </div>
                </div>
                <div className="chart-body">
                  {categoryData.length === 0 ? (
                    <div className="chart-empty">
                      <PieChartIcon size={40} className="text-white/20" />
                      <p>No expense data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={3}
                        >
                          {categoryData.map((_, index) => (
                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ fontSize: "11px" }} formatter={(value) => <span className="text-white/60">{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Area Chart */}
              <div className="chart-card card-crystal">
                <div className="chart-header">
                  <div className="chart-icon crystal">
                    <TrendingUp size={18} />
                  </div>
                  <div className="chart-info">
                    <h3 className="chart-title">Balance Trend</h3>
                    <p className="chart-subtitle">This month</p>
                  </div>
                </div>
                <div className="chart-body">
                  {trendData.length === 0 ? (
                    <div className="chart-empty">
                      <LineChartIcon size={40} className="text-white/20" />
                      <p>No data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={200}>
                      <AreaChart data={trendData}>
                        <defs>
                          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#667eea" stopOpacity={0.4} />
                            <stop offset="100%" stopColor="#667eea" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="value" stroke="#667eea" strokeWidth={2} fill="url(#balanceGradient)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="transactions-card card-pink">
              <div className="transactions-header">
                <div className="transactions-info">
                  <div className="transactions-icon">
                    <Receipt size={18} />
                  </div>
                  <div>
                    <h3 className="transactions-title">Recent Transactions</h3>
                    <p className="transactions-count">{transactions.length} total entries</p>
                  </div>
                </div>
                <button className="view-all-btn" onClick={() => navigate("/summary")}>
                  View All <ChevronRight size={16} />
                </button>
              </div>

              <div className="transactions-body">
                {loading ? (
                  <div className="transactions-loading">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                  </div>
                ) : transactions.length === 0 ? (
                  <div className="transactions-empty">
                    <Receipt size={48} className="text-white/20" />
                    <p>No transactions yet</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {transactions.slice(0, 6).map((tx, index) => {
                      const isIncome = (tx.type || "").toLowerCase().trim() === "income";
                      const amount = Math.abs(Number(tx.amount) || 0);

                      return (
                        <div key={tx._id || index} className="transaction-item">
                          <div className="tx-left">
                            <div className={`tx-icon ${isIncome ? "income" : "expense"}`}>
                              {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                            </div>
                            <div className="tx-details">
                              <span className="tx-category">{tx.category || "General"}</span>
                              <span className="tx-meta">
                                {tx.paymentMethod || "Cash"} • {new Date(tx.date || tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                          </div>
                          <span className={`tx-amount ${isIncome ? "income" : "expense"}`}>
                            {isIncome ? "+" : "-"}₹{amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="content-right">
            {/* Goal Card */}
            <div className="goal-card card-gold">
              <div className="goal-header">
                <div className="goal-icon">
                  <Target size={18} />
                </div>
                <div className="goal-info">
                  <h3 className="goal-title">Savings Goal</h3>
                  <p className="goal-subtitle">{goal ? "Track your progress" : "Set a savings target"}</p>
                </div>
              </div>

              {goal && goalProgress ? (
                <div className="goal-progress-section">
                  {/* Progress Ring */}
                  <div className="progress-ring-container">
                    <svg className="progress-ring" viewBox="0 0 120 120">
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="50%" stopColor="#f093fb" />
                          <stop offset="100%" stopColor="#2af598" />
                        </linearGradient>
                      </defs>
                      <circle className="progress-bg" cx="60" cy="60" r="50" strokeWidth="10" />
                      <circle
                        className="progress-bar"
                        cx="60"
                        cy="60"
                        r="50"
                        strokeWidth="10"
                        stroke="url(#progressGradient)"
                        strokeDasharray={`${2 * Math.PI * 50}`}
                        strokeDashoffset={`${2 * Math.PI * 50 * (1 - goalProgress.progressPercent / 100)}`}
                      />
                    </svg>
                    <div className="progress-text">
                      <span className="progress-percent">{goalProgress.progressPercent}%</span>
                      <span className="progress-label">Complete</span>
                    </div>
                  </div>

                  <h4 className="goal-name">🎯 {goal.name}</h4>

                  <div className="goal-stats">
                    <div className="goal-stat">
                      <span className="gs-label">Target</span>
                      <span className="gs-value gold">₹{goal.targetAmount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="goal-stat">
                      <span className="gs-label">Saved</span>
                      <span className="gs-value green">₹{goalProgress.savedAmount?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="goal-stat">
                      <span className="gs-label">Remaining</span>
                      <span className="gs-value pink">₹{goalProgress.remainingAmount?.toLocaleString("en-IN")}</span>
                    </div>
                    {goalProgress.daysRemaining !== null && (
                      <div className="goal-stat">
                        <span className="gs-label">Days Left</span>
                        <span className="gs-value blue">{goalProgress.daysRemaining}</span>
                      </div>
                    )}
                  </div>

                  {goal.monthlyTarget > 0 && (
                    <div className={`track-badge ${goalProgress.isOnTrack ? "on-track" : "off-track"}`}>
                      {goalProgress.isOnTrack ? (
                        <><CheckCircle2 size={14} /> On track this month!</>
                      ) : (
                        <><AlertCircle size={14} /> Need ₹{Math.max(0, goalProgress.monthlyTarget - goalProgress.savedAmount).toLocaleString("en-IN")} more</>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="goal-empty">
                  <Target size={40} className="text-white/20" />
                  <p>No goal set yet</p>
                  <p className="text-xs text-white/30">Create one below</p>
                </div>
              )}

              {/* Goal Form */}
              <form onSubmit={handleSaveGoal} className="goal-form">
                <div className="input-with-icon">
                  <Star size={16} className="input-icon" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Goal name (e.g., New Phone)"
                    value={goalForm.name}
                    onChange={handleGoalFormChange}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-row">
                  <input
                    type="number"
                    name="targetAmount"
                    placeholder="Target ₹"
                    value={goalForm.targetAmount}
                    onChange={handleGoalFormChange}
                    className="form-input"
                    required
                  />
                  <input
                    type="number"
                    name="monthlyTarget"
                    placeholder="Monthly ₹"
                    value={goalForm.monthlyTarget}
                    onChange={handleGoalFormChange}
                    className="form-input"
                  />
                </div>

                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon" />
                  <input
                    type="date"
                    name="deadline"
                    value={goalForm.deadline}
                    onChange={handleGoalFormChange}
                    className="form-input"
                  />
                </div>

                <button type="submit" className="btn btn-gold btn-full" disabled={goalLoading}>
                  {goalLoading ? <span className="btn-spinner"></span> : <><Target size={16} /> <span>{goal ? "Update Goal" : "Set Goal"}</span></>}
                </button>

                {goalError && <p className="form-error">{goalError}</p>}
              </form>
            </div>

            {/* Quick Add Card */}
            <div className="add-card card-aurora">
              <div className="add-header">
                <div className="add-icon">
                  <PlusCircle size={18} />
                </div>
                <div className="add-info">
                  <h3 className="add-title">Quick Add</h3>
                  <p className="add-subtitle">New transaction</p>
                </div>
              </div>

              <form onSubmit={handleAddTransaction} className="add-form">
                <div className="form-row">
                  <div className="input-with-icon">
                    <Coins size={16} className="input-icon" />
                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount ₹"
                      value={form.amount}
                      onChange={handleFormChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <select name="type" value={form.type} onChange={handleFormChange} className="form-select">
                    <option value="expense">💸 Expense</option>
                    <option value="income">💰 Income</option>
                  </select>
                </div>

                {form.type === "income" && (
                  <select name="source" value={form.source} onChange={handleFormChange} className="form-select" required>
                    <option value="">Select source</option>
                    {incomeSourceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}

                <select name="category" value={form.category} onChange={handleFormChange} className="form-select" required>
                  <option value="">Select category</option>
                  {(form.type === "income" ? incomeSourceOptions : categoryOptions).map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <select name="paymentMethod" value={form.paymentMethod} onChange={handleFormChange} className="form-select">
                  <option value="">Payment method</option>
                  {paymentOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>

                <textarea
                  name="note"
                  placeholder="Note (optional)"
                  value={form.note}
                  onChange={handleFormChange}
                  className="form-textarea"
                  rows={2}
                />

                <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                  {submitting ? <span className="btn-spinner"></span> : <><Zap size={16} /> <span>{form.type === "income" ? "Add Income" : "Add Expense"}</span></>}
                </button>

                {error && <p className="form-error">{error}</p>}
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="dashboard-footer">
          <Gem size={14} className="text-indigo-400" />
          <span>Smart Expense</span>
          <span className="footer-dot">•</span>
          <span>Made with 💜</span>
          <span className="footer-dot">•</span>
          <span className="footer-edition">ADITYA EDITION</span>
        </footer>
      </div>
            {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* STYLES */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <style>{`
        /* BASE */
        .dashboard {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          padding: 1rem;
          padding-bottom: 2rem;
        }
        @media (min-width: 768px) {
          .dashboard { padding: 1.5rem 2rem; }
        }

        /* BACKGROUND */
        .dashboard-bg {
          position: fixed;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
        }
        .bg-gradient {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 0% 0%, rgba(102,126,234,0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(240,147,251,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(42,245,152,0.08) 0%, transparent 50%),
            linear-gradient(180deg, #030014 0%, #0a0520 50%, #050210 100%);
        }
        .bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(102,126,234,0.05) 0%, transparent 50%);
          animation: glowPulse 10s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.8; }
        }
        @media (max-width: 640px) {
          .bg-glow { animation: none; opacity: 0.5; }
        }

        /* ANIMATIONS */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.95); }
        }

        /* TOAST */
        .toast-container {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
          animation: fadeInUp 0.3s ease-out;
        }
        .toast {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: 0.875rem;
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
          min-width: 280px;
          box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5);
        }
        .toast-success { background: rgba(42,245,152,0.15); }
        .toast-error { background: rgba(255,65,108,0.15); }
        .toast-info { background: rgba(102,126,234,0.15); }
        .toast-warning { background: rgba(245,175,25,0.15); }
        .toast-icon { flex-shrink: 0; }
        .toast-success .toast-icon { color: #2af598; }
        .toast-error .toast-icon { color: #ff416c; }
        .toast-info .toast-icon { color: #667eea; }
        .toast-warning .toast-icon { color: #f5af19; }
        .toast-message { flex: 1; font-size: 0.875rem; color: white; font-weight: 500; }
        .toast-close {
          padding: 0.25rem;
          border-radius: 0.375rem;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
        }

        /* ALERTS */
        .alerts-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
          animation: fadeInUp 0.4s ease-out;
        }
        .alert-card {
          display: flex;
          align-items: flex-start;
          gap: 0.875rem;
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
        }
        .alert-danger { background: linear-gradient(135deg, rgba(255,107,157,0.1), rgba(255,65,108,0.05)); border-color: rgba(255,107,157,0.2); }
        .alert-warning { background: linear-gradient(135deg, rgba(245,175,25,0.1), rgba(252,246,186,0.05)); border-color: rgba(245,175,25,0.2); }
        .alert-success { background: linear-gradient(135deg, rgba(42,245,152,0.1), rgba(18,194,233,0.05)); border-color: rgba(42,245,152,0.2); }
        .alert-info { background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(240,147,251,0.05)); border-color: rgba(102,126,234,0.2); }
        .alert-icon { padding: 0.5rem; border-radius: 0.625rem; flex-shrink: 0; }
        .alert-icon-danger { background: rgba(255,107,157,0.2); color: #ff6b9d; }
        .alert-icon-warning { background: rgba(245,175,25,0.2); color: #f5af19; }
        .alert-icon-success { background: rgba(42,245,152,0.2); color: #2af598; }
        .alert-icon-info { background: rgba(102,126,234,0.2); color: #667eea; }
        .alert-content { flex: 1; min-width: 0; }
        .alert-title { font-size: 0.875rem; font-weight: 600; color: white; margin-bottom: 0.25rem; }
        .alert-message { font-size: 0.8125rem; color: rgba(255,255,255,0.7); line-height: 1.4; }

        /* HEADER */
        .dashboard-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
          animation: fadeInUp 0.4s ease-out;
        }
        .header-left { display: flex; align-items: center; gap: 0.875rem; }
        .header-logo {
          position: relative;
          padding: 0.875rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          box-shadow: 0 10px 30px -10px rgba(102,126,234,0.5);
        }
        .header-crown {
          position: absolute;
          top: -5px;
          right: -5px;
          padding: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #bf953f, #fcf6ba);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .header-title { display: flex; align-items: center; gap: 0.625rem; flex-wrap: wrap; }
        .title-gradient {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (min-width: 640px) { .title-gradient { font-size: 1.5rem; } }
        .header-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.625rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, #667eea, #f093fb);
          color: white;
        }
        .header-subtitle { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
        .header-right { display: flex; align-items: center; gap: 0.625rem; }
        .header-welcome { display: none; }
        @media (min-width: 768px) { .header-welcome { display: block; margin-right: 0.5rem; } }
        .welcome-text { font-size: 0.875rem; font-weight: 500; color: white; }
        .header-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: 0.625rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.15s;
        }
        .header-btn:hover { transform: translateY(-1px); }
        .btn-ghost { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); }
        .btn-danger { background: linear-gradient(135deg, #ff416c, #ff4b2b); color: white; }
        .btn-text { display: none; }
        @media (min-width: 640px) { .btn-text { display: inline; } }

        /* BALANCE CARD */
        .balance-card {
          padding: 1.5rem;
          border-radius: 1.25rem;
          background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(240,147,251,0.05));
          border: 1px solid rgba(102,126,234,0.15);
          backdrop-filter: blur(10px);
          margin-bottom: 1.25rem;
          animation: fadeInUp 0.4s ease-out 0.1s both;
        }
        @media (min-width: 640px) { .balance-card { padding: 2rem; } }
        .balance-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
        .balance-left { display: flex; align-items: center; gap: 0.875rem; }
        .balance-icon { padding: 0.75rem; border-radius: 0.875rem; background: rgba(102,126,234,0.15); }
        .balance-info { display: flex; flex-direction: column; gap: 0.25rem; }
        .balance-label { font-size: 0.75rem; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.05em; }
        .balance-live {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          font-size: 0.625rem;
          font-weight: 700;
          background: rgba(42,245,152,0.15);
          color: #2af598;
          width: fit-content;
        }
        .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #2af598; animation: pulse 1.5s ease-in-out infinite; }
        .balance-toggle {
          padding: 0.625rem;
          border-radius: 0.625rem;
          background: rgba(255,255,255,0.05);
          border: none;
          color: #667eea;
          cursor: pointer;
        }
        .balance-amount { margin-bottom: 1.5rem; }
        .amount-value { font-size: 2.25rem; font-weight: 800; }
        @media (min-width: 640px) { .amount-value { font-size: 3rem; } }
        .amount-value.positive {
          background: linear-gradient(135deg, #667eea, #764ba2, #f093fb, #2af598);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .amount-value.negative {
          background: linear-gradient(135deg, #ff416c, #ff4b2b);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .amount-hidden { font-size: 2.25rem; font-weight: 800; color: rgba(255,255,255,0.25); }
        .balance-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.875rem; margin-bottom: 1rem; }
        .stat-box { display: flex; align-items: center; gap: 0.75rem; padding: 0.875rem; border-radius: 0.875rem; }
        .stat-income { background: rgba(42,245,152,0.08); border: 1px solid rgba(42,245,152,0.15); }
        .stat-expense { background: rgba(255,107,157,0.08); border: 1px solid rgba(255,107,157,0.15); }
        .stat-icon-box { padding: 0.5rem; border-radius: 0.5rem; }
        .stat-icon-box.income { background: rgba(42,245,152,0.2); color: #2af598; }
        .stat-icon-box.expense { background: rgba(255,107,157,0.2); color: #ff6b9d; }
        .stat-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .stat-label { font-size: 0.625rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .stat-value { font-size: 1rem; font-weight: 700; }
        @media (min-width: 640px) { .stat-value { font-size: 1.125rem; } }
        .balance-footer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.7);
        }

        /* QUICK STATS */
        .quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
          margin-bottom: 1.25rem;
          animation: fadeInUp 0.4s ease-out 0.2s both;
        }
        .quick-stat-card {
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .stat-crystal { background: linear-gradient(135deg, rgba(42,245,152,0.1), rgba(18,194,233,0.05)); border-color: rgba(42,245,152,0.15); }
        .stat-pink { background: linear-gradient(135deg, rgba(255,107,157,0.1), rgba(196,113,237,0.05)); border-color: rgba(255,107,157,0.15); }
        .qs-icon { padding: 0.625rem; border-radius: 0.625rem; }
        .qs-icon.crystal { background: rgba(42,245,152,0.2); color: #2af598; }
        .qs-icon.pink { background: rgba(255,107,157,0.2); color: #ff6b9d; }
        .qs-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .qs-label { font-size: 0.625rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .qs-value { font-size: 1.125rem; font-weight: 700; }
        .qs-value.crystal { color: #2af598; }
        .qs-value.pink { color: #ff6b9d; }

        /* CONTENT GRID */
        .content-grid { display: grid; grid-template-columns: 1fr; gap: 1.25rem; }
        @media (min-width: 1024px) { .content-grid { grid-template-columns: 1.4fr 1fr; } }
        .content-left, .content-right { display: flex; flex-direction: column; gap: 1rem; }

        /* CHARTS */
        .charts-row { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .charts-row { grid-template-columns: 1fr 1fr; } }
        .chart-card {
          padding: 1.25rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.08);
          animation: fadeInUp 0.4s ease-out 0.3s both;
        }
        .card-aurora { background: linear-gradient(135deg, rgba(102,126,234,0.08), rgba(240,147,251,0.03)); border-color: rgba(102,126,234,0.12); }
        .card-crystal { background: linear-gradient(135deg, rgba(42,245,152,0.06), rgba(18,194,233,0.03)); border-color: rgba(42,245,152,0.1); }
        .card-pink { background: linear-gradient(135deg, rgba(255,107,157,0.06), rgba(196,113,237,0.03)); border-color: rgba(255,107,157,0.1); }
        .card-gold { background: linear-gradient(135deg, rgba(191,149,63,0.08), rgba(252,246,186,0.03)); border-color: rgba(191,149,63,0.12); }
        .chart-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .chart-icon { padding: 0.5rem; border-radius: 0.5rem; }
        .chart-icon.aurora { background: rgba(102,126,234,0.2); color: #667eea; }
        .chart-icon.crystal { background: rgba(42,245,152,0.2); color: #2af598; }
        .chart-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .chart-title { font-size: 0.875rem; font-weight: 600; color: white; }
        .chart-subtitle { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }
        .chart-body { min-height: 200px; }
        .chart-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; gap: 0.5rem; color: rgba(255,255,255,0.3); }
        .chart-empty p { font-size: 0.75rem; }
        .chart-tooltip {
          padding: 0.5rem 0.75rem;
          border-radius: 0.5rem;
          background: rgba(10,5,32,0.95);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .chart-tooltip-label { font-size: 0.625rem; color: #667eea; margin-bottom: 0.125rem; }
        .chart-tooltip-value { font-size: 0.875rem; font-weight: 700; color: white; }

        /* TRANSACTIONS */
        .transactions-card {
          padding: 1.25rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.4s ease-out 0.4s both;
        }
        .transactions-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
        .transactions-info { display: flex; align-items: center; gap: 0.75rem; }
        .transactions-icon { padding: 0.5rem; border-radius: 0.5rem; background: rgba(255,107,157,0.2); color: #ff6b9d; }
        .transactions-title { font-size: 0.875rem; font-weight: 600; color: white; }
        .transactions-count { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }
        .view-all-btn {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #ff6b9d;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .transactions-body { min-height: 200px; }
        .transactions-loading, .transactions-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 0.5rem;
          color: rgba(255,255,255,0.3);
        }
        .spinner {
          width: 2rem;
          height: 2rem;
          border: 3px solid rgba(255,107,157,0.2);
          border-top-color: #ff6b9d;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .transactions-list { display: flex; flex-direction: column; gap: 0.625rem; max-height: 300px; overflow-y: auto; padding-right: 0.5rem; }
        .transactions-list::-webkit-scrollbar { width: 4px; }
        .transactions-list::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .transactions-list::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #f093fb); border-radius: 10px; }
        .transaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          transition: transform 0.15s;
        }
        .transaction-item:hover { transform: translateX(3px); }
        .tx-left { display: flex; align-items: center; gap: 0.625rem; }
        .tx-icon { padding: 0.375rem; border-radius: 0.375rem; }
        .tx-icon.income { background: rgba(42,245,152,0.2); color: #2af598; }
        .tx-icon.expense { background: rgba(255,107,157,0.2); color: #ff6b9d; }
        .tx-details { display: flex; flex-direction: column; gap: 0.125rem; }
        .tx-category { font-size: 0.8125rem; font-weight: 600; color: white; }
        .tx-meta { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }
        .tx-amount { font-size: 0.9375rem; font-weight: 700; }
        .tx-amount.income { color: #2af598; }
        .tx-amount.expense { color: #ff6b9d; }

        /* GOAL CARD */
        .goal-card {
          padding: 1.25rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.4s ease-out 0.3s both;
        }
        .goal-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .goal-icon { padding: 0.5rem; border-radius: 0.5rem; background: rgba(191,149,63,0.2); color: #f5af19; }
        .goal-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .goal-title { font-size: 0.875rem; font-weight: 600; color: white; }
        .goal-subtitle { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }
        .goal-progress-section { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 1.25rem; }
        .progress-ring-container { position: relative; width: 120px; height: 120px; margin-bottom: 0.75rem; }
        .progress-ring { transform: rotate(-90deg); width: 100%; height: 100%; }
        .progress-bg { fill: none; stroke: rgba(255,255,255,0.08); }
        .progress-bar { fill: none; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease-out; }
        .progress-text {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .progress-percent {
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .progress-label { font-size: 0.625rem; color: rgba(255,255,255,0.5); }
        .goal-name {
          font-size: 1rem;
          font-weight: 700;
          color: #fcf6ba;
          margin-bottom: 0.75rem;
        }
        .goal-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; width: 100%; margin-bottom: 0.75rem; }
        .goal-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          border-radius: 0.5rem;
          background: rgba(255,255,255,0.03);
        }
        .gs-label { font-size: 0.5625rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
        .gs-value { font-size: 0.8125rem; font-weight: 700; }
        .gs-value.gold { color: #fcf6ba; }
        .gs-value.green { color: #2af598; }
        .gs-value.pink { color: #ff6b9d; }
        .gs-value.blue { color: #667eea; }
        .track-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-size: 0.6875rem;
          font-weight: 600;
        }
        .track-badge.on-track { background: rgba(42,245,152,0.15); color: #2af598; }
        .track-badge.off-track { background: rgba(255,107,157,0.15); color: #ff6b9d; }
        .goal-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          gap: 0.5rem;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1rem;
        }
        .goal-empty p { font-size: 0.75rem; }
        .goal-form { display: flex; flex-direction: column; gap: 0.625rem; }

        /* ADD CARD */
        .add-card {
          padding: 1.25rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          animation: fadeInUp 0.4s ease-out 0.4s both;
        }
        .add-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .add-icon { padding: 0.5rem; border-radius: 0.5rem; background: rgba(102,126,234,0.2); color: #667eea; }
        .add-info { display: flex; flex-direction: column; gap: 0.125rem; }
        .add-title { font-size: 0.875rem; font-weight: 600; color: white; }
        .add-subtitle { font-size: 0.6875rem; color: rgba(255,255,255,0.5); }
        .add-form { display: flex; flex-direction: column; gap: 0.625rem; }

        /* FORMS */
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.625rem; }
        .input-with-icon { position: relative; }
        .input-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          z-index: 1;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.625rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #667eea; }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .input-with-icon .form-input { padding-left: 2.5rem; }
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.625rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 0.8125rem;
          outline: none;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23667eea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 10px center;
          background-repeat: no-repeat;
          background-size: 16px;
        }
        .form-select option { background: #0a0520; color: white; }
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          border-radius: 0.625rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          font-size: 0.8125rem;
          outline: none;
          resize: none;
        }
        .form-textarea::placeholder { color: rgba(255,255,255,0.3); }
        .form-error { font-size: 0.75rem; color: #ff6b9d; text-align: center; margin-top: 0.5rem; }

        /* BUTTONS */
        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border-radius: 0.625rem;
          font-size: 0.8125rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
        }
        .btn:hover:not(:disabled) { transform: translateY(-1px); }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-full { width: 100%; }
        .btn-primary { background: linear-gradient(135deg, #667eea, #764ba2, #f093fb); color: white; box-shadow: 0 5px 20px -5px rgba(102,126,234,0.4); }
        .btn-gold { background: linear-gradient(135deg, #bf953f, #fcf6ba, #bf953f); color: #000; box-shadow: 0 5px 20px -5px rgba(191,149,63,0.4); }
        .btn-spinner {
          width: 1rem;
          height: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        /* FOOTER */
        .dashboard-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2.5rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          animation: fadeInUp 0.4s ease-out 0.5s both;
        }
        .footer-dot { color: #667eea; }
        .footer-edition {
          background: linear-gradient(135deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        /* UTILITY */
        .text-emerald-400 { color: #2af598; }
        .text-rose-400 { color: #ff6b9d; }
        .text-indigo-400 { color: #667eea; }
        .text-white { color: white; }
        .text-black { color: black; }

        ::selection { background: rgba(102,126,234,0.3); color: white; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </AppShell>
  );
}