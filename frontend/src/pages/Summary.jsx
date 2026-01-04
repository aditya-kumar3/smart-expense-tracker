// src/pages/Summary.jsx
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  Activity,
} from "lucide-react";

// 🔥 FIXED: Use same API as Dashboard
import { fetchTransactions } from "../services/transactions";
import { fetchAiInsights, chatWithAi } from "../services/ai";

// ═══════════════════════════════════════════════════════════════════════════════
// 🔢 HELPER FUNCTION - Safe Number
// ═══════════════════════════════════════════════════════════════════════════════
const safeNumber = (value) => {
  const num = Number(value);
  if (isNaN(num) || !isFinite(num)) return 0;
  return Math.round(Math.abs(num));
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 COLORS
// ═══════════════════════════════════════════════════════════════════════════════
const CHART_COLORS = ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19", "#ff6b9d"];

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 AURORA BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
const AuroraBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 0% 0%, rgba(102, 126, 234, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(240, 147, 251, 0.12) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(42, 245, 152, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(18, 194, 233, 0.1) 0%, transparent 50%),
            linear-gradient(180deg, #030014 0%, #0a0520 50%, #050210 100%)
          `,
        }}
      />

      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0" />
            <stop offset="50%" stopColor="#764ba2" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f093fb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#12c2e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#2af598" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f5af19" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.path
          d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100"
          fill="none"
          stroke="url(#aurora1)"
          strokeWidth="100"
          filter="url(#glow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.3, 0.6, 0.3],
            d: [
              "M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100",
              "M0,120 Q250,70 500,120 T1000,80 T1500,120 T2000,80",
              "M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100",
            ],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          style={{ transform: "translateY(10%)" }}
        />

        <motion.path
          d="M0,200 Q300,150 600,200 T1200,200 T1800,200"
          fill="none"
          stroke="url(#aurora2)"
          strokeWidth="80"
          filter="url(#glow)"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            d: [
              "M0,200 Q300,150 600,200 T1200,200 T1800,200",
              "M0,180 Q300,220 600,180 T1200,220 T1800,180",
              "M0,200 Q300,150 600,200 T1200,200 T1800,200",
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{ transform: "translateY(20%)" }}
        />
      </svg>

      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`crystal-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${4 + Math.random() * 8}px`,
            height: `${4 + Math.random() * 8}px`,
          }}
          animate={{
            y: [0, -40 - Math.random() * 40, 0],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, 360],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19"][Math.floor(Math.random() * 5)]
              } 0%, transparent 70%)`,
              boxShadow: `0 0 ${10 + Math.random() * 20}px currentColor`,
            }}
          />
        </motion.div>
      ))}

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 60%)",
          top: "-400px",
          left: "-400px",
          filter: "blur(80px)",
        }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(240,147,251,0.08) 0%, transparent 60%)",
          bottom: "-300px",
          right: "-300px",
          filter: "blur(100px)",
        }}
        animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💎 LUXURY GLASS CARD
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryGlassCard = ({ children, className = "", variant = "default", delay = 0, hover3D = true }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: { bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.08)", glow: "rgba(102,126,234,0.15)" },
    aurora: { bg: "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(240,147,251,0.05) 100%)", border: "rgba(102,126,234,0.2)", glow: "rgba(102,126,234,0.25)" },
    gold: { bg: "linear-gradient(135deg, rgba(191,149,63,0.08) 0%, rgba(252,246,186,0.03) 100%)", border: "rgba(191,149,63,0.2)", glow: "rgba(191,149,63,0.2)" },
    crystal: { bg: "linear-gradient(135deg, rgba(42,245,152,0.05) 0%, rgba(18,194,233,0.05) 100%)", border: "rgba(42,245,152,0.15)", glow: "rgba(42,245,152,0.2)" },
    pink: { bg: "linear-gradient(135deg, rgba(255,107,157,0.08) 0%, rgba(196,113,237,0.05) 100%)", border: "rgba(255,107,157,0.2)", glow: "rgba(255,107,157,0.2)" },
  };

  const config = variants[variant];

  const handleMouseMove = (e) => {
    if (!cardRef.current || !hover3D) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 0, y: 0 }); }}
      style={{
        transform: hover3D ? `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg)` : "none",
        transformStyle: "preserve-3d",
      }}
      className={`relative overflow-hidden rounded-[28px] backdrop-blur-2xl transition-all duration-500 ease-out ${className}`}
    >
      <div className="absolute inset-0 rounded-[28px]" style={{ background: config.bg }} />
      <div
        className="absolute inset-0 rounded-[28px] transition-opacity duration-500"
        style={{
          padding: "1px",
          background: isHovered ? `linear-gradient(135deg, ${config.border}, rgba(255,255,255,0.2), ${config.border})` : `linear-gradient(135deg, ${config.border}, ${config.border})`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 100}% ${50 + mousePosition.y * 100}%, ${config.glow} 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] rounded-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} />
      <motion.div
        className="absolute inset-0 rounded-[28px]"
        style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)" }}
        animate={isHovered ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -inset-1 rounded-[32px] transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 70%)`, filter: "blur(20px)", opacity: isHovered ? 0.6 : 0, zIndex: -1 }}
      />
      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>{children}</div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✨ GRADIENT TEXT
// ═══════════════════════════════════════════════════════════════════════════════
const GradientText = ({ children, variant = "aurora", className = "", animate = false }) => {
  const gradients = {
    aurora: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    gold: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)",
    crystal: "linear-gradient(135deg, #12c2e9 0%, #2af598 50%, #f5af19 100%)",
    pink: "linear-gradient(135deg, #ff6b9d 0%, #c471ed 50%, #667eea 100%)",
    white: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)",
  };

  return (
    <motion.span
      className={`font-bold ${className}`}
      style={{ background: gradients[variant], WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}
      animate={animate ? { backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] } : {}}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 LUXURY BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryButton = ({ children, onClick, type = "button", variant = "aurora", disabled = false, loading = false, icon, className = "", fullWidth = false, size = "md" }) => {
  const variants = {
    aurora: { bg: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", shadow: "rgba(102,126,234,0.4)", text: "text-white" },
    gold: { bg: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)", shadow: "rgba(191,149,63,0.4)", text: "text-black" },
    crystal: { bg: "linear-gradient(135deg, #12c2e9 0%, #2af598 100%)", shadow: "rgba(42,245,152,0.4)", text: "text-black" },
    pink: { bg: "linear-gradient(135deg, #ff6b9d 0%, #c471ed 100%)", shadow: "rgba(255,107,157,0.4)", text: "text-white" },
    ghost: { bg: "rgba(255,255,255,0.05)", shadow: "rgba(255,255,255,0.1)", text: "text-white" },
    danger: { bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)", shadow: "rgba(255,65,108,0.4)", text: "text-white" },
  };
  const sizes = { sm: "px-4 py-2.5 text-xs", md: "px-6 py-3.5 text-sm", lg: "px-8 py-4 text-base" };
  const config = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -3 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`relative overflow-hidden ${sizes[size]} rounded-2xl ${config.text} font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""} ${variant === "ghost" ? "border border-white/10 hover:border-white/20" : ""} ${className}`}
      style={{ background: config.bg, boxShadow: `0 10px 40px -10px ${config.shadow}` }}
    >
      <motion.div className="absolute inset-0" style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)" }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }} />
      <div className="absolute top-0 left-[20%] right-[20%] h-[1px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }} />
      {loading ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-5 h-5 border-2 border-current border-t-transparent rounded-full" /> : <>{icon && <span className="relative z-10">{icon}</span>}<span className="relative z-10">{children}</span></>}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 LUXURY INPUT
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryInput = ({ type = "text", placeholder, value, onChange, icon, variant = "default", className = "" }) => {
  const [isFocused, setIsFocused] = useState(false);
  const variants = {
    default: { accent: "#667eea", glow: "rgba(102,126,234,0.3)" },
    crystal: { accent: "#2af598", glow: "rgba(42,245,152,0.3)" },
  };
  const config = variants[variant] || variants.default;

  return (
    <motion.div className="relative group flex-1" animate={{ scale: isFocused ? 1.01 : 1 }} transition={{ duration: 0.2 }}>
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300" style={{ color: isFocused ? config.accent : "rgba(255,255,255,0.3)" }}>{icon}</div>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full px-5 py-4 ${icon ? "pl-12" : ""} rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-white/25 focus:outline-none transition-all duration-300 text-sm ${className}`}
        style={{ borderColor: isFocused ? config.accent : "rgba(255,255,255,0.1)", boxShadow: isFocused ? `0 0 30px ${config.glow}` : "none" }}
      />
      <motion.div className="absolute bottom-0 left-1/2 h-[2px] rounded-full" style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }} initial={{ width: 0, x: "-50%" }} animate={{ width: isFocused ? "80%" : 0, x: "-50%" }} transition={{ duration: 0.3 }} />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 ANIMATED NUMBER - FIXED
// ═══════════════════════════════════════════════════════════════════════════════
const AnimatedNumber = ({ value, prefix = "₹", duration = 2, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const targetValue = safeNumber(value);
    if (targetValue === 0) { setDisplayValue(0); return; }

    let startTime = null;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      if (progress >= 1) { setDisplayValue(targetValue); return; }
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setDisplayValue(Math.round(targetValue * easeOutExpo));
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => { if (animationFrame) cancelAnimationFrame(animationFrame); setDisplayValue(targetValue); };
  }, [value, duration]);

  return <span className={className}>{prefix} {Math.round(displayValue).toLocaleString("en-IN")}</span>;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💬 CHAT BUBBLE
// ═══════════════════════════════════════════════════════════════════════════════
const ChatBubble = ({ message, isAi }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ type: "spring", stiffness: 200, damping: 20 }}
    className={`flex gap-3 ${isAi ? "justify-start" : "justify-end"}`}
  >
    {isAi && <motion.div className="p-2 rounded-xl bg-[#667eea]/20 h-fit" whileHover={{ scale: 1.1, rotate: 10 }}><Bot size={18} className="text-[#667eea]" /></motion.div>}
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${isAi ? "bg-white/[0.03] border border-white/10 text-white/90" : "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"}`}
      style={{ boxShadow: isAi ? "0 10px 40px -10px rgba(102,126,234,0.2)" : "0 10px 40px -10px rgba(102,126,234,0.4)" }}
    >
      {message}
    </motion.div>
    {!isAi && <motion.div className="p-2 rounded-xl bg-[#f093fb]/20 h-fit" whileHover={{ scale: 1.1, rotate: -10 }}><User size={18} className="text-[#f093fb]" /></motion.div>}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CATEGORY BAR
// ═══════════════════════════════════════════════════════════════════════════════
const CategoryBar = ({ label, amount, percentage, color, delay = 0 }) => {
  const safeAmount = safeNumber(amount);
  const safePercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, type: "spring" }} className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/80 capitalize">{label}</span>
        <div className="flex items-center gap-2">
          <GradientText variant="aurora" className="text-sm">₹{safeAmount.toLocaleString("en-IN")}</GradientText>
          <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5">{safePercentage}%</span>
        </div>
      </div>
      <div className="h-3 rounded-full bg-white/5 overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${safePercentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)`, boxShadow: `0 0 20px ${color}50` }}
        >
          <motion.div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)" }} animate={{ x: ["-100%", "200%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }} />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 MAIN SUMMARY COMPONENT - COMPLETELY FIXED
// ═══════════════════════════════════════════════════════════════════════════════
export default function Summary() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const chatContainerRef = useRef(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Hey! Ask me anything about your spending. I'm here to help! 😊" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🔥 FIXED: Data Loading - Use SAME API as Dashboard
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        
        // 🔥 Use fetchTransactions - SAME AS DASHBOARD
        const now = new Date();
        const res = await fetchTransactions({
          month: now.getMonth() + 1,
          year: now.getFullYear(),
        });
        
        console.log("📊 API Response:", res);
        
        // Handle response structure - same as Dashboard
        let txList = [];
        if (Array.isArray(res)) {
          txList = res;
        } else if (res?.transactions && Array.isArray(res.transactions)) {
          txList = res.transactions;
        } else if (res?.data && Array.isArray(res.data)) {
          txList = res.data;
        }
        
        console.log("📦 Transactions loaded:", txList.length);
        setTransactions(txList);
        
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }

      // AI Insights - separate call
      try {
        setAiLoading(true);
        const ai = await fetchAiInsights(user.id);
        if (ai) setAiText(ai);
      } catch (err) {
        console.error("AI error:", err);
      } finally {
        setAiLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🔥 FIXED: Calculate Summary - SAME LOGIC AS DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return null;
    }

    let totalIncome = 0;
    let totalExpense = 0;
    let expenseCount = 0;

    transactions.forEach((t) => {
      const amt = Math.round(Math.abs(Number(t.amount) || 0));
      const type = (t.type || "").toLowerCase().trim();

      if (type === "income") {
        totalIncome += amt;
      } else if (type === "expense") {
        totalExpense += amt;
        expenseCount++;
      }
    });

    const balance = totalIncome - totalExpense;
    const savings = Math.max(0, balance);
    const overspent = balance < 0 ? Math.abs(balance) : 0;

    console.log("📊 Calculated Summary:", { totalIncome, totalExpense, balance, savings, overspent });

    return {
      totalIncome,
      totalExpense,
      balance,
      savings,
      overspent,
      thisMonthTotal: totalExpense,
      thisMonthCount: expenseCount,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🔥 FIXED: Calculate Categories - Only Expenses
  // ─────────────────────────────────────────────────────────────────────────────
  const categories = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const categoryMap = {};

    transactions.forEach((t) => {
      const type = (t.type || "").toLowerCase().trim();
      if (type !== "expense") return;

      const cat = t.category || "Other";
      const amt = Math.round(Math.abs(Number(t.amount) || 0));
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    });

    return Object.entries(categoryMap)
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  // Top category
  const topCategory = categories.length > 0 ? categories[0] : null;

  // Budget status
  const isOver = summary ? summary.balance < 0 : false;
  const saved = summary ? (isOver ? summary.overspent : summary.savings) : 0;

  const monthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 🔥 FIXED: Chat Handler - Uses calculated summary
  // ─────────────────────────────────────────────────────────────────────────────
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user?.id) return;

    const question = chatInput.trim();
    setChatMessages((prev) => [...prev, { from: "user", text: question }]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Build context with calculated data
      const context = summary
        ? `User's current month financial summary:
           - Total Income: ₹${summary.totalIncome.toLocaleString("en-IN")}
           - Total Expense: ₹${summary.totalExpense.toLocaleString("en-IN")}
           - Balance: ₹${summary.balance.toLocaleString("en-IN")}
           - Savings: ₹${summary.savings.toLocaleString("en-IN")}
           - Total Transactions: ${summary.transactionCount}
           - Expense Transactions: ${summary.thisMonthCount}
           - Top spending category: ${topCategory?.label || "N/A"} (₹${topCategory?.amount?.toLocaleString("en-IN") || 0})
           - All categories: ${categories.map(c => `${c.label}: ₹${c.amount}`).join(", ")}
           
           User's question: ${question}`
        : `User has no transactions yet. Question: ${question}`;

      const res = await chatWithAi(user.id, context);
      setChatMessages((prev) => [...prev, { from: "ai", text: res.answer || res.message || res || "Sorry, couldn't process that." }]);
    } catch (err) {
      console.error("Chat error:", err);
      setChatMessages((prev) => [...prev, { from: "ai", text: "Oops! Server busy. Try again! 😊" }]);
    } finally {
      setChatLoading(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen relative">
      <AuroraBackground />

      <div className="relative z-10 min-h-screen px-4 py-6 lg:px-10 lg:py-8">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-5">
            <LuxuryButton variant="ghost" onClick={() => navigate("/dashboard")} icon={<ArrowLeft size={18} />} size="sm">
              Back
            </LuxuryButton>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative p-4 rounded-3xl"
                style={{ background: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)", boxShadow: "0 20px 60px -15px rgba(191,149,63,0.5)" }}
              >
                <BarChart3 size={28} className="text-black" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="p-1.5 rounded-full" style={{ background: "linear-gradient(135deg, #667eea, #f093fb)", boxShadow: "0 0 20px rgba(102,126,234,0.6)" }}>
                    <Sparkles size={12} className="text-white" />
                  </div>
                </motion.div>
              </motion.div>

              <div>
                <GradientText variant="gold" className="text-2xl tracking-tight">{monthLabel}</GradientText>
                <p className="text-sm text-white/40 mt-1">Monthly Summary Report</p>
              </div>
            </div>
          </div>

          <motion.span
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="px-4 py-2 rounded-full text-[11px] font-black tracking-wider"
            style={{ background: "linear-gradient(135deg, #bf953f, #fcf6ba)", color: "#000", boxShadow: "0 5px 20px -5px rgba(191,149,63,0.5)" }}
          >
            ✨ AI POWERED
          </motion.span>
        </motion.header>

        {/* TROPHY CARD */}
        <LuxuryGlassCard variant="gold" className="p-8 mb-8" delay={0.1}>
          <div className="relative">
            <motion.div
              className="absolute -top-4 -right-4 w-32 h-32 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(191,149,63,0.3) 0%, transparent 70%)", filter: "blur(20px)" }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <motion.div
                    className="p-3 rounded-2xl"
                    style={{ background: "rgba(191,149,63,0.2)" }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Trophy size={28} className="text-[#fcf6ba]" />
                  </motion.div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/20 text-[#fcf6ba]">
                    Performance Highlight
                  </span>
                </div>

                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl lg:text-4xl font-black mb-4"
                >
                  <GradientText variant="gold">
                    {isOver ? "We'll Bounce Back! 🧠" : "Golden Month! 🏆"}
                  </GradientText>
                </motion.h2>

                {loading ? (
                  <div className="flex items-center gap-3 text-white/50">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                      <Loader2 size={20} />
                    </motion.div>
                    <span>Analyzing your month...</span>
                  </div>
                ) : summary ? (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-base lg:text-lg text-white/80 leading-relaxed"
                  >
                    You earned{" "}
                    <GradientText variant="crystal" className="text-xl">
                      ₹{summary.totalIncome.toLocaleString("en-IN")}
                    </GradientText>{" "}
                    and spent{" "}
                    <GradientText variant="pink" className="text-xl">
                      ₹{summary.totalExpense.toLocaleString("en-IN")}
                    </GradientText>{" "}
                    across <span className="font-bold text-white">{summary.thisMonthCount} expense transactions</span>.{" "}
                    {isOver ? (
                      <>
                        Overspent by <span className="text-[#ff6b9d] font-bold">₹{saved.toLocaleString("en-IN")}</span>.
                        Let's control spending next month! 💪
                      </>
                    ) : (
                      <>
                        Saved <GradientText variant="crystal" className="text-xl">₹{saved.toLocaleString("en-IN")}</GradientText> this month. Great job! 👏
                      </>
                    )}
                  </motion.p>
                ) : (
                  <p className="text-white/60">No transactions found. Add some from the dashboard!</p>
                )}
              </div>

              {/* Stats Mini Cards */}
              {summary && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-4"
                >
                  <div className="p-4 rounded-2xl text-center min-w-[120px]" style={{ background: "rgba(42,245,152,0.1)", border: "1px solid rgba(42,245,152,0.2)" }}>
                    <div className="p-2 rounded-xl bg-[#2af598]/20 w-fit mx-auto mb-2">
                      <ArrowUpRight size={20} className="text-[#2af598]" />
                    </div>
                    <p className="text-xs text-white/50 mb-1">Income</p>
                    <GradientText variant="crystal" className="text-xl">
                      ₹{summary.totalIncome.toLocaleString("en-IN")}
                    </GradientText>
                  </div>

                  <div
                    className="p-4 rounded-2xl text-center min-w-[120px]"
                    style={{
                      background: isOver ? "rgba(255,107,157,0.1)" : "rgba(191,149,63,0.1)",
                      border: `1px solid ${isOver ? "rgba(255,107,157,0.2)" : "rgba(191,149,63,0.2)"}`,
                    }}
                  >
                    <div className={`p-2 rounded-xl w-fit mx-auto mb-2 ${isOver ? "bg-[#ff6b9d]/20" : "bg-[#bf953f]/20"}`}>
                      {isOver ? <ArrowDownRight size={20} className="text-[#ff6b9d]" /> : <Coins size={20} className="text-[#fcf6ba]" />}
                    </div>
                    <p className="text-xs text-white/50 mb-1">{isOver ? "Overspent" : "Saved"}</p>
                    <GradientText variant={isOver ? "pink" : "gold"} className="text-xl">
                      ₹{saved.toLocaleString("en-IN")}
                    </GradientText>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </LuxuryGlassCard>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* CATEGORY BREAKDOWN */}
          <LuxuryGlassCard variant="aurora" className="p-6" delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div className="p-3 rounded-xl bg-[#667eea]/20" whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <PieChart size={22} className="text-[#667eea]" />
              </motion.div>
              <div>
                <p className="text-base font-semibold text-white">Category Breakdown</p>
                <p className="text-xs text-white/40">Expense distribution by category</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-10 h-10 border-3 border-[#667eea] border-t-transparent rounded-full" />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/30">
                <PieChart size={50} className="mb-3 opacity-30" />
                <p className="text-sm">No expense categories yet</p>
                <p className="text-xs text-white/20 mt-1">Add expenses from dashboard</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const totalExpense = summary?.totalExpense || 1;
                  const share = totalExpense === 0 ? 0 : Math.round((cat.amount / totalExpense) * 100);

                  return (
                    <CategoryBar
                      key={cat.label + idx}
                      label={cat.label}
                      amount={cat.amount}
                      percentage={share}
                      color={CHART_COLORS[idx % CHART_COLORS.length]}
                      delay={idx * 0.1}
                    />
                  );
                })}
              </div>
            )}

            {/* Top Category Highlight */}
            {topCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-6 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-[#f093fb]" />
                  <span className="text-xs text-white/50">Top Spending Category</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <GradientText variant="pink" className="text-lg capitalize">{topCategory.label}</GradientText>
                  <span className="text-white/80 font-semibold">₹{topCategory.amount.toLocaleString("en-IN")}</span>
                </div>
              </motion.div>
            )}
          </LuxuryGlassCard>

          {/* AI INSIGHT & CHAT */}
          <LuxuryGlassCard variant="crystal" className="p-6" delay={0.3}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div className="p-3 rounded-xl bg-[#2af598]/20" animate={{ y: [0, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Brain size={22} className="text-[#2af598]" />
              </motion.div>
              <div>
                <p className="text-base font-semibold text-white">Smart AI Insight</p>
                <p className="text-xs text-white/40">Personalized analysis</p>
              </div>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="ml-auto">
                <Sparkles size={18} className="text-[#2af598]/50" />
              </motion.div>
            </div>

            {/* AI Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-2xl mb-6"
              style={{ background: "rgba(42,245,152,0.05)", border: "1px solid rgba(42,245,152,0.15)" }}
            >
              {aiLoading ? (
                <div className="flex items-center gap-3 text-white/60">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 size={18} className="text-[#2af598]" />
                  </motion.div>
                  <span className="text-sm">Analyzing your spending patterns...</span>
                </div>
              ) : aiText ? (
                <p className="text-sm leading-relaxed text-white/80">{aiText}</p>
              ) : (
                <p className="text-sm text-white/50">Add transactions to get AI insights!</p>
              )}
            </motion.div>

            {/* Chat Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[#667eea]" />
                <span className="text-sm font-medium text-white/70">Ask AI Anything</span>
              </div>

              <div ref={chatContainerRef} className="h-52 overflow-y-auto space-y-3 pr-2 luxury-scrollbar">
                {chatMessages.map((m, i) => (
                  <ChatBubble key={i} message={m.text} isAi={m.from === "ai"} />
                ))}
                {chatLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-white/50 text-sm pl-12">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                      <Loader2 size={14} className="animate-spin" />
                    </motion.div>
                    <span>Thinking...</span>
                  </motion.div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="flex gap-3 items-center">
                <LuxuryInput
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about your spending..."
                  variant="crystal"
                  icon={<MessageCircle size={16} />}
                />
                <LuxuryButton type="submit" variant="crystal" disabled={chatLoading || !chatInput.trim()} loading={chatLoading} icon={<Send size={16} />} size="md">
                  <span className="hidden sm:inline">Ask</span>
                </LuxuryButton>
              </form>
            </div>
          </LuxuryGlassCard>
        </div>

        {/* QUICK STATS ROW */}
        {summary && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Total Income */}
            <LuxuryGlassCard variant="crystal" className="p-5" delay={0.5} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#2af598]/20">
                  <ArrowUpRight size={18} className="text-[#2af598]" />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wider">Total Income</span>
              </div>
              <GradientText variant="crystal" className="text-2xl">
                <AnimatedNumber value={summary.totalIncome} duration={1.5} />
              </GradientText>
            </LuxuryGlassCard>

            {/* Total Expense */}
            <LuxuryGlassCard variant="pink" className="p-5" delay={0.6} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#ff6b9d]/20">
                  <Receipt size={18} className="text-[#ff6b9d]" />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wider">Total Expense</span>
              </div>
              <GradientText variant="pink" className="text-2xl">
                <AnimatedNumber value={summary.totalExpense} duration={1.5} />
              </GradientText>
            </LuxuryGlassCard>

            {/* Status */}
            <LuxuryGlassCard variant={isOver ? "pink" : "crystal"} className="p-5" delay={0.7} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${isOver ? "bg-[#ff6b9d]/20" : "bg-[#2af598]/20"}`}>
                  {isOver ? <AlertCircle size={18} className="text-[#ff6b9d]" /> : <CheckCircle2 size={18} className="text-[#2af598]" />}
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wider">Status</span>
              </div>
              <GradientText variant={isOver ? "pink" : "crystal"} className="text-lg">
                {isOver ? "Over Budget" : "On Track!"}
              </GradientText>
            </LuxuryGlassCard>

            {/* Top Category */}
            <LuxuryGlassCard variant="gold" className="p-5" delay={0.8} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#bf953f]/20">
                  <TrendingUp size={18} className="text-[#fcf6ba]" />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wider">Top Category</span>
              </div>
              <GradientText variant="gold" className="text-lg truncate capitalize">
                {topCategory?.label || "N/A"}
              </GradientText>
            </LuxuryGlassCard>
          </motion.div>
        )}

        {/* FOOTER */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-14 text-center">
          <div className="flex items-center justify-center gap-3 text-white/30 text-xs">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Gem size={14} className="text-[#667eea]" />
            </motion.div>
            <span>Smart Expense</span>
            <span className="text-[#667eea]">•</span>
            <span>Summary Report</span>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>💜</motion.span>
            <span className="text-[#f093fb]">•</span>
            <GradientText variant="aurora" className="text-xs">ADITYA EDITION</GradientText>
          </div>
        </motion.footer>
      </div>

      <style>{`
        .luxury-scrollbar::-webkit-scrollbar { width: 6px; }
        .luxury-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .luxury-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #f093fb); border-radius: 10px; }
        .luxury-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #f093fb, #667eea); }
        ::selection { background: rgba(102,126,234,0.3); color: white; }
      `}</style>
    </div>
  );
}