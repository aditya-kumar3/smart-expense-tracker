// src/pages/Summary.jsx
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Trophy,
  Brain,
  Sparkles,
  TrendingUp,
  PieChart,
  MessageCircle,
  Send,
  Target,
  Gem,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Bot,
  User,
  ArrowUpRight,
  ArrowDownRight,
  Coins,
  Receipt,
} from "lucide-react";

import { fetchTransactions } from "../services/transactions";
import { fetchAiInsights, chatWithAi } from "../services/ai";

const CHART_COLORS = ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19", "#ff6b9d"];

const safeNumber = (value) => {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round(Math.abs(num));
};

export default function Summary() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const chatContainerRef = useRef(null);

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Hey! Ask me anything about your spending. I'm here to help! 😊" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // ══════════════════════════════════════════════════════════════════════════
  // CALCULATIONS
  // ══════════════════════════════════════════════════════════════════════════
  const summary = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    let expenseCount = 0;

    transactions.forEach((t) => {
      const amt = safeNumber(t.amount);
      const type = (t.type || "").toLowerCase().trim();

      if (type === "income") {
        totalIncome += amt;
      } else if (type === "expense") {
        totalExpense += amt;
        expenseCount++;
      }
    });

    const balance = totalIncome - totalExpense;

    return {
      totalIncome,
      totalExpense,
      balance,
      savings: Math.max(0, balance),
      overspent: balance < 0 ? Math.abs(balance) : 0,
      expenseCount,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  const categories = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const categoryMap = {};

    transactions.forEach((t) => {
      const type = (t.type || "").toLowerCase().trim();
      if (type !== "expense") return;

      const cat = t.category || "Other";
      const amt = safeNumber(t.amount);
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });

    return Object.entries(categoryMap)
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const topCategory = categories.length > 0 ? categories[0] : null;
  const isOver = summary ? summary.balance < 0 : false;
  const saved = summary ? (isOver ? summary.overspent : summary.savings) : 0;

  const monthLabel = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // ══════════════════════════════════════════════════════════════════════════
  // DATA LOADING
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        const now = new Date();
        const res = await fetchTransactions({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });

        let txList = [];
        if (Array.isArray(res)) {
          txList = res;
        } else if (res?.transactions && Array.isArray(res.transactions)) {
          txList = res.transactions;
        } else if (res?.data && Array.isArray(res.data)) {
          txList = res.data;
        }

        setTransactions(txList);
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // ══════════════════════════════════════════════════════════════════════════
  // 🔥 FIXED: Generate AI Insight Locally (No Backend Needed)
  // ══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!summary) {
      setAiText("");
      return;
    }

    // Generate insight based on actual data
    let insight = "";

    if (summary.transactionCount === 0) {
      insight = "No transactions yet this month. Start tracking your expenses to get personalized insights!";
    } else if (isOver) {
      insight = `⚠️ You've overspent by ₹${summary.overspent.toLocaleString("en-IN")} this month. Your total expenses (₹${summary.totalExpense.toLocaleString("en-IN")}) exceeded your income (₹${summary.totalIncome.toLocaleString("en-IN")}). Consider reducing spending${topCategory ? ` in ${topCategory.label}` : ""} next month.`;
    } else if (summary.savings >= summary.totalIncome * 0.3) {
      insight = `🎉 Excellent! You saved ${Math.round((summary.savings / summary.totalIncome) * 100)}% of your income this month (₹${summary.savings.toLocaleString("en-IN")}). ${topCategory ? `Your highest spending was on ${topCategory.label} (₹${topCategory.amount.toLocaleString("en-IN")}).` : ""} Keep up the great work!`;
    } else if (summary.savings >= summary.totalIncome * 0.1) {
      insight = `👍 Good job! You saved ₹${summary.savings.toLocaleString("en-IN")} this month (${Math.round((summary.savings / summary.totalIncome) * 100)}% of income). ${topCategory ? `Most spending went to ${topCategory.label} (₹${topCategory.amount.toLocaleString("en-IN")}).` : ""} Try to save a bit more next month!`;
    } else {
      insight = `💡 You spent ₹${summary.totalExpense.toLocaleString("en-IN")} this month and saved ₹${summary.savings.toLocaleString("en-IN")}. ${topCategory ? `Top category: ${topCategory.label} (₹${topCategory.amount.toLocaleString("en-IN")}).` : ""} Consider setting a budget to save more.`;
    }

    setAiText(insight);
  }, [summary, topCategory, isOver]);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ══════════════════════════════════════════════════════════════════════════
  // 🔥 FIXED: Chat Handler with Proper English Response
  // ══════════════════════════════════════════════════════════════════════════
  const handleChatSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user?.id) return;

    const question = chatInput.trim().toLowerCase();
    setChatMessages((prev) => [...prev, { from: "user", text: chatInput.trim() }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // 🔥 Try to answer common questions locally first
      let localAnswer = getLocalAnswer(question, summary, categories, topCategory);

      if (localAnswer) {
        // Use local answer
        setChatMessages((prev) => [...prev, { from: "ai", text: localAnswer }]);
      } else {
        // Fall back to AI API with English prompt
        const context = `
IMPORTANT: Reply in English only. Be concise and helpful.

User's Financial Data for ${monthLabel}:
- Total Income: ₹${summary?.totalIncome?.toLocaleString("en-IN") || 0}
- Total Expenses: ₹${summary?.totalExpense?.toLocaleString("en-IN") || 0}
- Current Balance: ₹${summary?.balance?.toLocaleString("en-IN") || 0}
- Total Savings: ₹${summary?.savings?.toLocaleString("en-IN") || 0}
- Number of Expense Transactions: ${summary?.expenseCount || 0}
- Top Spending Category: ${topCategory?.label || "None"} (₹${topCategory?.amount?.toLocaleString("en-IN") || 0})
- All Categories: ${categories.map(c => `${c.label}: ₹${c.amount.toLocaleString("en-IN")}`).join(", ") || "None"}

User's Question: "${chatInput.trim()}"

Please answer the user's question directly based on the data above. Reply in English.`;

        const res = await chatWithAi(user.id, context);
        const answer = res?.answer || res?.message || res || "Sorry, I couldn't process that. Please try again.";
        setChatMessages((prev) => [...prev, { from: "ai", text: answer }]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      // Provide helpful fallback
      let fallback = "Sorry, I'm having trouble connecting. ";
      if (summary) {
        fallback += `Here's a quick summary: You spent ₹${summary.totalExpense.toLocaleString("en-IN")} and saved ₹${summary.savings.toLocaleString("en-IN")} this month.`;
      }
      setChatMessages((prev) => [...prev, { from: "ai", text: fallback }]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, user?.id, summary, categories, topCategory, monthLabel]);

  // ══════════════════════════════════════════════════════════════════════════
  // 🔥 LOCAL ANSWER FUNCTION - Handles common questions without API
  // ══════════════════════════════════════════════════════════════════════════
  const getLocalAnswer = (question, summary, categories, topCategory) => {
    if (!summary) {
      return "You don't have any transactions yet. Add some from the dashboard to get started!";
    }

    const q = question.toLowerCase();

    // Spending questions
    if (q.includes("how much") && (q.includes("spent") || q.includes("spend") || q.includes("expense"))) {
      return `You spent a total of ₹${summary.totalExpense.toLocaleString("en-IN")} this month across ${summary.expenseCount} transactions.${topCategory ? ` Your highest spending was on ${topCategory.label} (₹${topCategory.amount.toLocaleString("en-IN")}).` : ""}`;
    }

    // Income questions
    if (q.includes("how much") && (q.includes("earn") || q.includes("income") || q.includes("made"))) {
      return `Your total income this month is ₹${summary.totalIncome.toLocaleString("en-IN")}.`;
    }

    // Savings questions
    if (q.includes("how much") && (q.includes("save") || q.includes("saving") || q.includes("saved"))) {
      if (summary.balance >= 0) {
        return `Great news! You saved ₹${summary.savings.toLocaleString("en-IN")} this month (${Math.round((summary.savings / summary.totalIncome) * 100)}% of your income).`;
      } else {
        return `Unfortunately, you overspent by ₹${summary.overspent.toLocaleString("en-IN")} this month. Try to reduce expenses next month.`;
      }
    }

    // Balance questions
    if (q.includes("balance") || q.includes("left") || q.includes("remaining")) {
      if (summary.balance >= 0) {
        return `Your current balance is ₹${summary.balance.toLocaleString("en-IN")}. You're doing well!`;
      } else {
        return `Your balance is -₹${Math.abs(summary.balance).toLocaleString("en-IN")}. You've spent more than you earned this month.`;
      }
    }

    // Category questions
    if (q.includes("category") || q.includes("categories") || q.includes("where") || q.includes("what")) {
      if (categories.length === 0) {
        return "You haven't recorded any expenses yet.";
      }
      const catList = categories.slice(0, 5).map(c => `${c.label}: ₹${c.amount.toLocaleString("en-IN")}`).join(", ");
      return `Here are your top spending categories: ${catList}.`;
    }

    // Top spending
    if (q.includes("top") || q.includes("highest") || q.includes("most")) {
      if (topCategory) {
        return `Your highest spending category is ${topCategory.label} with ₹${topCategory.amount.toLocaleString("en-IN")} spent.`;
      }
      return "No expense categories found.";
    }

    // Summary/overview
    if (q.includes("summary") || q.includes("overview") || q.includes("tell me")) {
      return `Here's your ${monthLabel} summary:\n• Income: ₹${summary.totalIncome.toLocaleString("en-IN")}\n• Expenses: ₹${summary.totalExpense.toLocaleString("en-IN")}\n• ${summary.balance >= 0 ? `Savings: ₹${summary.savings.toLocaleString("en-IN")}` : `Overspent: ₹${summary.overspent.toLocaleString("en-IN")}`}\n• Top Category: ${topCategory?.label || "N/A"}`;
    }

    // Budget/advice
    if (q.includes("budget") || q.includes("advice") || q.includes("tip") || q.includes("suggest")) {
      if (summary.balance >= 0) {
        const savingsPercent = Math.round((summary.savings / summary.totalIncome) * 100);
        if (savingsPercent >= 30) {
          return `Excellent! You're saving ${savingsPercent}% of your income. Consider investing some of it for future growth.`;
        } else if (savingsPercent >= 10) {
          return `Good job saving ${savingsPercent}%! Try to increase it to 30% by reducing ${topCategory?.label || "optional"} expenses.`;
        } else {
          return `You're saving only ${savingsPercent}%. Try setting a budget and tracking daily expenses to save more.`;
        }
      } else {
        return `You're overspending. Consider reducing ${topCategory?.label || "discretionary"} expenses and creating a strict budget.`;
      }
    }

    // Default - return null to use AI API
    return null;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="summary-page">
      <div className="summary-bg">
        <div className="bg-gradient" />
        <div className="bg-glow" />
      </div>

      <div className="summary-container">
        {/* Header */}
        <header className="summary-header fade-in">
          <div className="header-left">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={18} />
              <span>Back</span>
            </button>

            <div className="header-title-section">
              <div className="header-icon">
                <BarChart3 size={26} className="text-black" />
                <div className="header-icon-badge">
                  <Sparkles size={10} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="header-title">{monthLabel}</h1>
                <p className="header-subtitle">Monthly Summary Report</p>
              </div>
            </div>
          </div>

          <span className="ai-badge pulse">✨ AI POWERED</span>
        </header>

        {/* Trophy Card */}
        <div className="trophy-card card-gold fade-in-up">
          <div className="trophy-glow" />

          <div className="trophy-content">
            <div className="trophy-main">
              <div className="trophy-header">
                <div className="trophy-icon">
                  <Trophy size={26} className="text-amber-200" />
                </div>
                <span className="trophy-badge">Performance Highlight</span>
              </div>

              <h2 className="trophy-title">
                {isOver ? "Let's Improve Next Month! 💪" : "Amazing Month! 🏆"}
              </h2>

              {loading ? (
                <div className="loading-state">
                  <Loader2 size={20} className="spinner" />
                  <span>Analyzing your month...</span>
                </div>
              ) : summary ? (
                <p className="trophy-text">
                  You earned{" "}
                  <span className="text-emerald-400 font-bold">
                    ₹{summary.totalIncome.toLocaleString("en-IN")}
                  </span>{" "}
                  and spent{" "}
                  <span className="text-rose-400 font-bold">
                    ₹{summary.totalExpense.toLocaleString("en-IN")}
                  </span>{" "}
                  across <span className="text-white font-bold">{summary.expenseCount} expenses</span>.{" "}
                  {isOver ? (
                    <>
                      You overspent by{" "}
                      <span className="text-rose-400 font-bold">
                        ₹{saved.toLocaleString("en-IN")}
                      </span>
                      . Let's budget better next month!
                    </>
                  ) : (
                    <>
                      You saved{" "}
                      <span className="text-emerald-400 font-bold">
                        ₹{saved.toLocaleString("en-IN")}
                      </span>
                      ! Great financial discipline! 👏
                    </>
                  )}
                </p>
              ) : (
                <p className="text-white/60">No transactions found. Add some from dashboard!</p>
              )}
            </div>

            {summary && (
              <div className="trophy-stats">
                <div className="mini-stat income">
                  <div className="mini-stat-icon income">
                    <ArrowUpRight size={18} />
                  </div>
                  <span className="mini-stat-label">Income</span>
                  <span className="mini-stat-value text-emerald-400">
                    ₹{summary.totalIncome.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className={`mini-stat ${isOver ? "expense" : "savings"}`}>
                  <div className={`mini-stat-icon ${isOver ? "expense" : "savings"}`}>
                    {isOver ? <ArrowDownRight size={18} /> : <Coins size={18} />}
                  </div>
                  <span className="mini-stat-label">{isOver ? "Overspent" : "Saved"}</span>
                  <span className={`mini-stat-value ${isOver ? "text-rose-400" : "text-amber-200"}`}>
                    ₹{saved.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Grid */}
        <div className="main-grid">
          {/* Category Breakdown */}
          <div className="card card-aurora fade-in-up">
            <div className="card-header">
              <div className="card-icon aurora">
                <PieChart size={20} />
              </div>
              <div>
                <h3 className="card-title">Category Breakdown</h3>
                <p className="card-subtitle">Expense distribution</p>
              </div>
            </div>

            <div className="card-body">
              {loading ? (
                <div className="loading-center">
                  <Loader2 size={24} className="spinner text-indigo-400" />
                </div>
              ) : categories.length === 0 ? (
                <div className="empty-state">
                  <PieChart size={40} />
                  <p>No expense categories yet</p>
                </div>
              ) : (
                <div className="categories-list">
                  {categories.map((cat, idx) => {
                    const totalExpense = summary?.totalExpense || 1;
                    const percent = Math.round((cat.amount / totalExpense) * 100);

                    return (
                      <div key={cat.label + idx} className="category-item fade-in-up" style={{ animationDelay: `${idx * 0.1}s` }}>
                        <div className="category-header">
                          <span className="category-label">{cat.label}</span>
                          <div className="category-values">
                            <span className="category-amount">₹{cat.amount.toLocaleString("en-IN")}</span>
                            <span className="category-percent">{percent}%</span>
                          </div>
                        </div>
                        <div className="category-bar-bg">
                          <div
                            className="category-bar"
                            style={{
                              width: `${percent}%`,
                              background: `linear-gradient(90deg, ${CHART_COLORS[idx % CHART_COLORS.length]}, ${CHART_COLORS[idx % CHART_COLORS.length]}aa)`,
                              boxShadow: `0 0 15px ${CHART_COLORS[idx % CHART_COLORS.length]}50`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {topCategory && (
                <div className="top-category">
                  <div className="top-category-header">
                    <Target size={14} className="text-pink-400" />
                    <span>Top Spending Category</span>
                  </div>
                  <div className="top-category-content">
                    <span className="top-category-name">{topCategory.label}</span>
                    <span className="top-category-amount">₹{topCategory.amount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Insight & Chat */}
          <div className="card card-crystal fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="card-header">
              <div className="card-icon crystal">
                <Brain size={20} />
              </div>
              <div>
                <h3 className="card-title">Smart AI Insight</h3>
                <p className="card-subtitle">Personalized analysis</p>
              </div>
              <Sparkles size={16} className="ml-auto text-emerald-400/50" />
            </div>

            <div className="card-body">
              {/* AI Summary - Now Generated Locally */}
              <div className="ai-summary">
                {loading ? (
                  <div className="ai-loading">
                    <Loader2 size={16} className="spinner text-emerald-400" />
                    <span>Analyzing your spending patterns...</span>
                  </div>
                ) : aiText ? (
                  <p className="ai-text">{aiText}</p>
                ) : (
                  <p className="ai-empty">Add transactions to get AI insights!</p>
                )}
              </div>

              {/* Chat Section */}
              <div className="chat-section">
                <div className="chat-header">
                  <MessageCircle size={14} className="text-indigo-400" />
                  <span>Ask AI Anything</span>
                </div>

                <div ref={chatContainerRef} className="chat-messages">
                  {chatMessages.map((m, i) => (
                    <div key={i} className={`chat-bubble ${m.from === "ai" ? "ai" : "user"}`}>
                      {m.from === "ai" && (
                        <div className="chat-avatar ai">
                          <Bot size={14} />
                        </div>
                      )}
                      <div className={`chat-text ${m.from === "ai" ? "ai" : "user"}`}>
                        {m.text}
                      </div>
                      {m.from !== "ai" && (
                        <div className="chat-avatar user">
                          <User size={14} />
                        </div>
                      )}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="chat-loading">
                      <Loader2 size={14} className="spinner" />
                      <span>Thinking...</span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="chat-form">
                  <div className="chat-input-wrap">
                    <MessageCircle size={16} className="chat-input-icon" />
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about your spending..."
                      className="chat-input"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={chatLoading || !chatInput.trim()}
                    className="chat-send-btn"
                  >
                    {chatLoading ? <Loader2 size={16} className="spinner" /> : <Send size={16} />}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        {summary && (
          <div className="quick-stats fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="stat-card crystal">
              <div className="stat-card-icon crystal">
                <ArrowUpRight size={18} />
              </div>
              <span className="stat-card-label">Total Income</span>
              <span className="stat-card-value crystal">
                ₹{summary.totalIncome.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="stat-card pink">
              <div className="stat-card-icon pink">
                <Receipt size={18} />
              </div>
              <span className="stat-card-label">Total Expense</span>
              <span className="stat-card-value pink">
                ₹{summary.totalExpense.toLocaleString("en-IN")}
              </span>
            </div>

            <div className={`stat-card ${isOver ? "pink" : "crystal"}`}>
              <div className={`stat-card-icon ${isOver ? "pink" : "crystal"}`}>
                {isOver ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <span className="stat-card-label">Status</span>
              <span className={`stat-card-value ${isOver ? "pink" : "crystal"}`}>
                {isOver ? "Over Budget" : "On Track!"}
              </span>
            </div>

            <div className="stat-card gold">
              <div className="stat-card-icon gold">
                <TrendingUp size={18} />
              </div>
              <span className="stat-card-label">Top Category</span>
              <span className="stat-card-value gold">{topCategory?.label || "N/A"}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="summary-footer fade-in">
          <Gem size={14} className="text-indigo-400" />
          <span>Smart Expense</span>
          <span className="footer-dot">•</span>
          <span>Summary Report</span>
          <span className="footer-heart">💜</span>
          <span className="footer-dot pink">•</span>
          <span className="footer-edition">ADITYA EDITION</span>
        </footer>
      </div>

      <style>{`
        .summary-page {
          min-height: 100vh;
          position: relative;
        }

        .summary-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          padding: 1.5rem 1rem;
          padding-bottom: 2rem;
        }

        @media (min-width: 768px) {
          .summary-container { padding: 2rem; }
        }

        .summary-bg {
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
            radial-gradient(ellipse at 0% 0%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(240, 147, 251, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(42, 245, 152, 0.08) 0%, transparent 50%),
            linear-gradient(180deg, #030014 0%, #0a0520 50%, #050210 100%);
        }

        .bg-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(191, 149, 63, 0.05) 0%, transparent 50%);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes barGrow {
          from { width: 0; }
        }

        .fade-in { animation: fadeIn 0.4s ease-out forwards; }
        .fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .pulse { animation: pulse 2s ease-in-out infinite; }
        .spinner { animation: spin 0.8s linear infinite; }

        .summary-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          border-radius: 0.625rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.8125rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .back-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-2px);
        }

        .header-title-section {
          display: flex;
          align-items: center;
          gap: 0.875rem;
        }

        .header-icon {
          position: relative;
          padding: 0.875rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%);
          box-shadow: 0 10px 30px -10px rgba(191, 149, 63, 0.5);
        }

        .header-icon-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          padding: 4px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #f093fb);
          box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 800;
          background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (min-width: 640px) {
          .header-title { font-size: 1.5rem; }
        }

        .header-subtitle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.125rem;
        }

        .ai-badge {
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.6875rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          background: linear-gradient(135deg, #bf953f, #fcf6ba);
          color: #000;
          box-shadow: 0 5px 20px -5px rgba(191, 149, 63, 0.5);
        }

        .trophy-card {
          position: relative;
          padding: 1.5rem;
          border-radius: 1.25rem;
          background: linear-gradient(135deg, rgba(191, 149, 63, 0.1), rgba(252, 246, 186, 0.03));
          border: 1px solid rgba(191, 149, 63, 0.15);
          margin-bottom: 1.5rem;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .trophy-card { padding: 2rem; }
        }

        .trophy-glow {
          position: absolute;
          top: -50px;
          right: -50px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(191, 149, 63, 0.2) 0%, transparent 70%);
          filter: blur(40px);
        }

        .trophy-content {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .trophy-content {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }

        .trophy-main { flex: 1; }

        .trophy-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .trophy-icon {
          padding: 0.75rem;
          border-radius: 0.875rem;
          background: rgba(191, 149, 63, 0.2);
        }

        .trophy-badge {
          padding: 0.25rem 0.625rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(0, 0, 0, 0.2);
          color: #fcf6ba;
        }

        .trophy-title {
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 0.75rem;
          background: linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (min-width: 640px) {
          .trophy-title { font-size: 2rem; }
        }

        .trophy-text {
          font-size: 0.9375rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
        }

        @media (min-width: 640px) {
          .trophy-text { font-size: 1rem; }
        }

        .loading-state {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .trophy-stats {
          display: flex;
          gap: 1rem;
        }

        .mini-stat {
          padding: 1rem;
          border-radius: 1rem;
          text-align: center;
          min-width: 100px;
        }

        .mini-stat.income {
          background: rgba(42, 245, 152, 0.1);
          border: 1px solid rgba(42, 245, 152, 0.2);
        }

        .mini-stat.expense {
          background: rgba(255, 107, 157, 0.1);
          border: 1px solid rgba(255, 107, 157, 0.2);
        }

        .mini-stat.savings {
          background: rgba(191, 149, 63, 0.1);
          border: 1px solid rgba(191, 149, 63, 0.2);
        }

        .mini-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 0.625rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.5rem;
        }

        .mini-stat-icon.income { background: rgba(42, 245, 152, 0.2); color: #2af598; }
        .mini-stat-icon.expense { background: rgba(255, 107, 157, 0.2); color: #ff6b9d; }
        .mini-stat-icon.savings { background: rgba(191, 149, 63, 0.2); color: #fcf6ba; }

        .mini-stat-label {
          display: block;
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .mini-stat-value { font-size: 1.125rem; font-weight: 700; }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }

        @media (min-width: 1024px) {
          .main-grid { grid-template-columns: 1fr 1fr; }
        }

        .card {
          padding: 1.25rem;
          border-radius: 1.125rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        @media (min-width: 640px) { .card { padding: 1.5rem; } }

        .card-aurora {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(240, 147, 251, 0.03));
          border-color: rgba(102, 126, 234, 0.12);
        }

        .card-crystal {
          background: linear-gradient(135deg, rgba(42, 245, 152, 0.06), rgba(18, 194, 233, 0.03));
          border-color: rgba(42, 245, 152, 0.1);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.25rem;
        }

        .card-icon { padding: 0.625rem; border-radius: 0.625rem; }
        .card-icon.aurora { background: rgba(102, 126, 234, 0.2); color: #667eea; }
        .card-icon.crystal { background: rgba(42, 245, 152, 0.2); color: #2af598; }

        .card-title { font-size: 0.9375rem; font-weight: 600; color: white; }
        .card-subtitle { font-size: 0.6875rem; color: rgba(255, 255, 255, 0.5); }

        .card-body { min-height: 200px; }

        .loading-center {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 200px;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 200px;
          gap: 0.5rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .empty-state p { font-size: 0.75rem; }

        .categories-list { display: flex; flex-direction: column; gap: 1rem; }

        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.375rem;
        }

        .category-label {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.8);
          text-transform: capitalize;
        }

        .category-values { display: flex; align-items: center; gap: 0.5rem; }

        .category-amount {
          font-size: 0.8125rem;
          font-weight: 600;
          background: linear-gradient(135deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .category-percent {
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.4);
          padding: 0.125rem 0.375rem;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
        }

        .category-bar-bg {
          height: 8px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .category-bar {
          height: 100%;
          border-radius: 9999px;
          animation: barGrow 0.8s ease-out forwards;
        }

        .top-category {
          margin-top: 1.25rem;
          padding: 0.875rem;
          border-radius: 0.875rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .top-category-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.5);
          margin-bottom: 0.375rem;
        }

        .top-category-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .top-category-name {
          font-size: 1rem;
          font-weight: 600;
          text-transform: capitalize;
          background: linear-gradient(135deg, #ff6b9d, #c471ed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .top-category-amount {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.8);
        }

        .ai-summary {
          padding: 1rem;
          border-radius: 0.875rem;
          background: rgba(42, 245, 152, 0.05);
          border: 1px solid rgba(42, 245, 152, 0.12);
          margin-bottom: 1.25rem;
        }

        .ai-loading {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .ai-text {
          font-size: 0.8125rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.85);
        }

        .ai-empty {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.75rem;
        }

        .chat-messages {
          height: 180px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
          padding-right: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .chat-messages::-webkit-scrollbar { width: 4px; }
        .chat-messages::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); border-radius: 10px; }
        .chat-messages::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #f093fb); border-radius: 10px; }

        .chat-bubble { display: flex; gap: 0.5rem; align-items: flex-start; }
        .chat-bubble.user { justify-content: flex-end; }

        .chat-avatar {
          width: 28px;
          height: 28px;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .chat-avatar.ai { background: rgba(102, 126, 234, 0.2); color: #667eea; }
        .chat-avatar.user { background: rgba(240, 147, 251, 0.2); color: #f093fb; }

        .chat-text {
          max-width: 75%;
          padding: 0.625rem 0.875rem;
          border-radius: 0.875rem;
          font-size: 0.8125rem;
          line-height: 1.5;
          white-space: pre-wrap;
        }

        .chat-text.ai {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.9);
        }

        .chat-text.user {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .chat-loading {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
          padding-left: 2.25rem;
        }

        .chat-form { display: flex; gap: 0.625rem; }

        .chat-input-wrap { position: relative; flex: 1; }

        .chat-input-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255, 255, 255, 0.3);
        }

        .chat-input {
          width: 100%;
          padding: 0.75rem 0.875rem 0.75rem 2.5rem;
          border-radius: 0.75rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
          font-size: 0.8125rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .chat-input::placeholder { color: rgba(255, 255, 255, 0.25); }
        .chat-input:focus { border-color: #2af598; box-shadow: 0 0 15px rgba(42, 245, 152, 0.15); }

        .chat-send-btn {
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: linear-gradient(135deg, #12c2e9, #2af598);
          border: none;
          color: black;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.15s, opacity 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-send-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .chat-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .quick-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.875rem;
          margin-top: 1.5rem;
        }

        @media (min-width: 768px) { .quick-stats { grid-template-columns: repeat(4, 1fr); } }

        .stat-card {
          padding: 1rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .stat-card.crystal { background: linear-gradient(135deg, rgba(42, 245, 152, 0.08), rgba(18, 194, 233, 0.03)); border-color: rgba(42, 245, 152, 0.12); }
        .stat-card.pink { background: linear-gradient(135deg, rgba(255, 107, 157, 0.08), rgba(196, 113, 237, 0.03)); border-color: rgba(255, 107, 157, 0.12); }
        .stat-card.gold { background: linear-gradient(135deg, rgba(191, 149, 63, 0.08), rgba(252, 246, 186, 0.03)); border-color: rgba(191, 149, 63, 0.12); }

        .stat-card-icon { width: 36px; height: 36px; border-radius: 0.625rem; display: flex; align-items: center; justify-content: center; margin-bottom: 0.625rem; }
        .stat-card-icon.crystal { background: rgba(42, 245, 152, 0.2); color: #2af598; }
        .stat-card-icon.pink { background: rgba(255, 107, 157, 0.2); color: #ff6b9d; }
        .stat-card-icon.gold { background: rgba(191, 149, 63, 0.2); color: #fcf6ba; }

        .stat-card-label { display: block; font-size: 0.625rem; color: rgba(255, 255, 255, 0.5); text-transform: uppercase; letter-spacing: 0.03em; margin-bottom: 0.25rem; }
        .stat-card-value { font-size: 1.125rem; font-weight: 700; }
        .stat-card-value.crystal { color: #2af598; }
        .stat-card-value.pink { color: #ff6b9d; }
        .stat-card-value.gold { color: #fcf6ba; }

        .summary-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 3rem;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          flex-wrap: wrap;
        }

        .footer-dot { color: #667eea; }
        .footer-dot.pink { color: #f093fb; }
        .footer-heart { animation: pulse 1s ease-in-out infinite; }
        .footer-edition {
          background: linear-gradient(135deg, #667eea, #f093fb);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 700;
        }

        .text-emerald-400 { color: #2af598; }
        .text-rose-400 { color: #ff6b9d; }
        .text-amber-200 { color: #fcf6ba; }
        .text-indigo-400 { color: #667eea; }
        .text-pink-400 { color: #f093fb; }
        .text-white { color: white; }
        .text-black { color: black; }
        .ml-auto { margin-left: auto; }

        ::selection { background: rgba(102, 126, 234, 0.3); color: white; }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}