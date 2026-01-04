// src/pages/Dashboard.jsx
import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
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
  Star,
  ChevronRight,
  Activity,
  CreditCard,
  DollarSign,
  LogOut,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Gem,
  Shield,
  Clock,
  BarChart3,
  Coins,
  Receipt,
  Trophy,
  Rocket,
  Heart,
  Gift,
  Moon,
  Sun,
  Fingerprint,
  Scan,
  Radio,
  Waves,
} from "lucide-react";

import AppShell from "../compnents/layout/AppShell";
import { fetchTransactions, createTransaction } from "../services/transactions";
import { fetchGoalStatus, saveGoal } from "../services/goals";
import { fetchAlerts } from "../services/alerts";

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
  RadialBarChart,
  RadialBar,
} from "recharts";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 AURORA LUXURY COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
const AURORA_COLORS = {
  aurora: {
    start: "#667eea",
    mid: "#764ba2",
    end: "#f093fb",
  },
  ocean: {
    deep: "#0c1445",
    mid: "#1a237e",
    light: "#3949ab",
  },
  gold: {
    dark: "#bf953f",
    mid: "#fcf6ba",
    light: "#fff8dc",
  },
  crystal: {
    pink: "#ff6b9d",
    purple: "#c471ed",
    blue: "#12c2e9",
    green: "#2af598",
    orange: "#f5af19",
  },
  glass: {
    white: "rgba(255, 255, 255, 0.08)",
    border: "rgba(255, 255, 255, 0.12)",
    highlight: "rgba(255, 255, 255, 0.25)",
  },
};

const CHART_COLORS = ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19", "#ff6b9d"];

// ═══════════════════════════════════════════════════════════════════════════════
// 🌌 AURORA BOREALIS BACKGROUND
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
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
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
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ transform: "translateY(20%)" }}
        />
      </svg>

      {Array.from({ length: 20 }).map((_, i) => (
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
        className="absolute w-[1000px] h-[1000px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 60%)",
          top: "-500px",
          left: "-500px",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(240,147,251,0.08) 0%, transparent 60%)",
          bottom: "-400px",
          right: "-400px",
          filter: "blur(120px)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💎 LUXURY GLASS CARD WITH 3D EFFECTS
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryGlassCard = ({
  children,
  className = "",
  variant = "default",
  delay = 0,
  hover3D = true,
  glowIntensity = "medium",
}) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    default: {
      bg: "rgba(255,255,255,0.03)",
      border: "rgba(255,255,255,0.08)",
      glow: "rgba(102,126,234,0.15)",
    },
    aurora: {
      bg: "linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(240,147,251,0.05) 100%)",
      border: "rgba(102,126,234,0.2)",
      glow: "rgba(102,126,234,0.25)",
    },
    gold: {
      bg: "linear-gradient(135deg, rgba(191,149,63,0.08) 0%, rgba(252,246,186,0.03) 100%)",
      border: "rgba(191,149,63,0.2)",
      glow: "rgba(191,149,63,0.2)",
    },
    crystal: {
      bg: "linear-gradient(135deg, rgba(42,245,152,0.05) 0%, rgba(18,194,233,0.05) 100%)",
      border: "rgba(42,245,152,0.15)",
      glow: "rgba(42,245,152,0.2)",
    },
    pink: {
      bg: "linear-gradient(135deg, rgba(255,107,157,0.08) 0%, rgba(196,113,237,0.05) 100%)",
      border: "rgba(255,107,157,0.2)",
      glow: "rgba(255,107,157,0.2)",
    },
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
      transition={{
        duration: 0.8,
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: hover3D
          ? `perspective(1000px) rotateX(${mousePosition.y * -10}deg) rotateY(${mousePosition.x * 10}deg)`
          : "none",
        transformStyle: "preserve-3d",
      }}
      className={`
        relative overflow-hidden rounded-[28px]
        backdrop-blur-2xl
        transition-all duration-500 ease-out
        ${className}
      `}
    >
      <div
        className="absolute inset-0 rounded-[28px]"
        style={{
          background: config.bg,
        }}
      />

      <div
        className="absolute inset-0 rounded-[28px] transition-opacity duration-500"
        style={{
          padding: "1px",
          background: isHovered
            ? `linear-gradient(135deg, ${config.border}, rgba(255,255,255,0.2), ${config.border})`
            : `linear-gradient(135deg, ${config.border}, ${config.border})`,
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

      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />

      <motion.div
        className="absolute inset-0 rounded-[28px]"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
        }}
        animate={isHovered ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute -inset-1 rounded-[32px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 70%)`,
          filter: "blur(20px)",
          opacity: isHovered ? 0.6 : 0,
          zIndex: -1,
        }}
      />

      <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✨ LUXURY GRADIENT TEXT
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
      style={{
        background: gradients[variant],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
      animate={
        animate
          ? {
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }
          : {}
      }
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 LUXURY BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryButton = ({
  children,
  onClick,
  type = "button",
  variant = "aurora",
  disabled = false,
  loading = false,
  icon,
  className = "",
  fullWidth = false,
  size = "md",
}) => {
  const variants = {
    aurora: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      shadow: "rgba(102,126,234,0.4)",
      text: "text-white",
    },
    gold: {
      bg: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)",
      shadow: "rgba(191,149,63,0.4)",
      text: "text-black",
    },
    crystal: {
      bg: "linear-gradient(135deg, #12c2e9 0%, #2af598 100%)",
      shadow: "rgba(42,245,152,0.4)",
      text: "text-black",
    },
    pink: {
      bg: "linear-gradient(135deg, #ff6b9d 0%, #c471ed 100%)",
      shadow: "rgba(255,107,157,0.4)",
      text: "text-white",
    },
    ghost: {
      bg: "rgba(255,255,255,0.05)",
      shadow: "rgba(255,255,255,0.1)",
      text: "text-white",
    },
    danger: {
      bg: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
      shadow: "rgba(255,65,108,0.4)",
      text: "text-white",
    },
  };

  const sizes = {
    sm: "px-4 py-2.5 text-xs",
    md: "px-6 py-3.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const config = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -3 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`
        relative overflow-hidden
        ${sizes[size]}
        rounded-2xl
        ${config.text}
        font-semibold
        flex items-center justify-center gap-2
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${variant === "ghost" ? "border border-white/10 hover:border-white/20" : ""}
        ${className}
      `}
      style={{
        background: config.bg,
        boxShadow: `0 10px 40px -10px ${config.shadow}`,
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />

      <div
        className="absolute top-0 left-[20%] right-[20%] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />

      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
        />
      ) : (
        <>
          {icon && <span className="relative z-10">{icon}</span>}
          <span className="relative z-10">{children}</span>
        </>
      )}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 LUXURY INPUT
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryInput = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  icon,
  variant = "default",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const variants = {
    default: { accent: "#667eea", glow: "rgba(102,126,234,0.3)" },
    gold: { accent: "#bf953f", glow: "rgba(191,149,63,0.3)" },
    crystal: { accent: "#2af598", glow: "rgba(42,245,152,0.3)" },
    pink: { accent: "#ff6b9d", glow: "rgba(255,107,157,0.3)" },
  };

  const config = variants[variant];

  return (
    <motion.div
      className="relative group"
      animate={{ scale: isFocused ? 1.01 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {icon && (
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300"
          style={{ color: isFocused ? config.accent : "rgba(255,255,255,0.3)" }}
        >
          {icon}
        </div>
      )}

      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-5 py-4 ${icon ? "pl-12" : ""}
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
          text-white placeholder:text-white/25
          focus:outline-none
          transition-all duration-300
          text-sm
          ${className}
        `}
        style={{
          borderColor: isFocused ? config.accent : "rgba(255,255,255,0.1)",
          boxShadow: isFocused ? `0 0 30px ${config.glow}` : "none",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }}
        initial={{ width: 0, x: "-50%" }}
        animate={{ width: isFocused ? "80%" : 0, x: "-50%" }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 70%)`,
          opacity: isFocused ? 0.3 : 0,
          filter: "blur(20px)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📋 LUXURY SELECT
// ═══════════════════════════════════════════════════════════════════════════════
const LuxurySelect = ({
  name,
  value,
  onChange,
  options = [],
  placeholder,
  required = false,
  variant = "default",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const variants = {
    default: { accent: "#667eea", glow: "rgba(102,126,234,0.3)" },
    gold: { accent: "#bf953f", glow: "rgba(191,149,63,0.3)" },
    crystal: { accent: "#2af598", glow: "rgba(42,245,152,0.3)" },
    pink: { accent: "#ff6b9d", glow: "rgba(255,107,157,0.3)" },
  };

  const config = variants[variant];

  return (
    <motion.div className="relative" animate={{ scale: isFocused ? 1.01 : 1 }}>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-5 py-4
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
          text-white
          focus:outline-none
          transition-all duration-300
          text-sm
          cursor-pointer
          appearance-none
          ${className}
        `}
        style={{
          borderColor: isFocused ? config.accent : "rgba(255,255,255,0.1)",
          boxShadow: isFocused ? `0 0 30px ${config.glow}` : "none",
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23667eea' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: "right 16px center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "20px",
        }}
      >
        {placeholder && (
          <option value="" className="bg-[#0a0520] text-white/50">
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#0a0520]">
            {opt.label}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 LUXURY TEXTAREA
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryTextarea = ({
  name,
  placeholder,
  value,
  onChange,
  rows = 3,
  variant = "default",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const config = {
    default: { accent: "#667eea", glow: "rgba(102,126,234,0.3)" },
  };

  const colorConfig = config[variant] || config.default;

  return (
    <motion.div className="relative" animate={{ scale: isFocused ? 1.01 : 1 }}>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-5 py-4
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
          text-white placeholder:text-white/25
          focus:outline-none
          transition-all duration-300
          text-sm
          resize-none
          ${className}
        `}
        style={{
          borderColor: isFocused ? colorConfig.accent : "rgba(255,255,255,0.1)",
          boxShadow: isFocused ? `0 0 30px ${colorConfig.glow}` : "none",
        }}
      />
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 ANIMATED NUMBER DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════
const AnimatedNumber = ({ value, prefix = "₹", duration = 2, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // 🔥 FIX: Handle edge cases
    if (value === 0 || isNaN(value)) {
      setDisplayValue(0);
      return;
    }

    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // 🔥 FIX: When animation completes, set EXACT value
      if (progress >= 1) {
        setDisplayValue(Math.round(value)); // Exact final value!
        return; // Stop animation
      }

      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setDisplayValue(value * easeOutExpo);
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  // 🔥 FIX: Always round the display value
  const finalValue = Math.round(displayValue);

  return (
    <span className={className}>
      {prefix} {finalValue.toLocaleString("en-IN")}
    </span>
  );
};
// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 LUXURY PROGRESS RING
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryProgressRing = ({ percentage, size = 160, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-[-20px] rounded-full"
        style={{
          background: "conic-gradient(from 0deg, rgba(102,126,234,0.3), rgba(240,147,251,0.3), rgba(42,245,152,0.3), rgba(102,126,234,0.3))",
          filter: "blur(30px)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      <div
        className="absolute inset-[15px] rounded-full"
        style={{
          background: "rgba(255,255,255,0.02)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        <defs>
          <linearGradient id="luxuryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="33%" stopColor="#764ba2" />
            <stop offset="66%" stopColor="#f093fb" />
            <stop offset="100%" stopColor="#2af598" />
          </linearGradient>
          <filter id="progressGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#luxuryGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          filter="url(#progressGlow)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <GradientText variant="aurora" className="text-4xl font-black">
            {percentage}%
          </GradientText>
        </motion.div>
        <span className="text-xs text-white/40 mt-1">Completed</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔔 LUXURY TOAST
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryToast = ({ message, type = "success", onClose }) => {
  const configs = {
    success: {
      icon: <CheckCircle2 size={22} />,
      gradient: "from-emerald-500/20 to-emerald-600/10",
      accent: "#2af598",
      iconBg: "rgba(42,245,152,0.2)",
    },
    error: {
      icon: <AlertCircle size={22} />,
      gradient: "from-red-500/20 to-red-600/10",
      accent: "#ff416c",
      iconBg: "rgba(255,65,108,0.2)",
    },
    info: {
      icon: <Bell size={22} />,
      gradient: "from-blue-500/20 to-blue-600/10",
      accent: "#667eea",
      iconBg: "rgba(102,126,234,0.2)",
    },
    warning: {
      icon: <Zap size={22} />,
      gradient: "from-amber-500/20 to-amber-600/10",
      accent: "#f5af19",
      iconBg: "rgba(245,175,25,0.2)",
    },
  };

  const config = configs[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9, rotateX: -30 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, y: -30, scale: 0.9 }}
      className={`
        flex items-center gap-4 px-6 py-4 rounded-2xl
        bg-gradient-to-r ${config.gradient}
        backdrop-blur-2xl
        border border-white/10
      `}
      style={{
        boxShadow: `0 20px 60px -20px ${config.accent}50`,
      }}
    >
      <motion.div
        className="p-2 rounded-xl"
        style={{ backgroundColor: config.iconBg, color: config.accent }}
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 0.5 }}
      >
        {config.icon}
      </motion.div>
      <span className="text-sm font-medium text-white">{message}</span>
      <motion.button
        whileHover={{ scale: 1.2, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="ml-2 p-1.5 rounded-full hover:bg-white/10 transition-colors"
      >
        <X size={16} className="text-white/50" />
      </motion.button>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💳 LUXURY STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryStatCard = ({ title, value, icon, trend, trendValue, variant = "aurora", delay = 0 }) => {
  const variants = {
    aurora: {
      gradient: "from-[#667eea]/15 to-[#764ba2]/5",
      icon: "bg-[#667eea]/20 text-[#667eea]",
      text: "text-[#667eea]",
      glow: "rgba(102,126,234,0.3)",
    },
    crystal: {
      gradient: "from-[#2af598]/15 to-[#12c2e9]/5",
      icon: "bg-[#2af598]/20 text-[#2af598]",
      text: "text-[#2af598]",
      glow: "rgba(42,245,152,0.3)",
    },
    pink: {
      gradient: "from-[#ff6b9d]/15 to-[#c471ed]/5",
      icon: "bg-[#ff6b9d]/20 text-[#ff6b9d]",
      text: "text-[#ff6b9d]",
      glow: "rgba(255,107,157,0.3)",
    },
    gold: {
      gradient: "from-[#bf953f]/15 to-[#fcf6ba]/5",
      icon: "bg-[#bf953f]/20 text-[#bf953f]",
      text: "text-[#bf953f]",
      glow: "rgba(191,149,63,0.3)",
    },
  };

  const config = variants[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      whileHover={{
        scale: 1.03,
        y: -5,
      }}
      className={`
        relative overflow-hidden
        p-6 rounded-[24px]
        bg-gradient-to-br ${config.gradient}
        backdrop-blur-xl
        border border-white/10
        transition-all duration-500
        group
      `}
    >
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.glow} 0%, transparent 70%)`,
        }}
      />

      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: config.glow }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-5">
          <motion.div
            className={`p-3.5 rounded-2xl ${config.icon}`}
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {icon}
          </motion.div>

          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay + 0.3 }}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold
                ${trend === "up" ? "bg-[#2af598]/20 text-[#2af598]" : "bg-[#ff6b9d]/20 text-[#ff6b9d]"}
              `}
            >
              {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {trendValue}
            </motion.div>
          )}
        </div>

        <p className="text-xs text-white/40 uppercase tracking-wider mb-2">{title}</p>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.2 }}
        >
          <GradientText variant={variant === "aurora" ? "aurora" : variant === "crystal" ? "crystal" : variant === "pink" ? "pink" : "gold"} className="text-3xl font-black">
            <AnimatedNumber value={value} duration={1.5} />
          </GradientText>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📈 LUXURY CHART TOOLTIP
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="px-5 py-4 rounded-2xl backdrop-blur-2xl border border-white/10"
        style={{
          background: "rgba(10,5,32,0.9)",
          boxShadow: "0 20px 60px -20px rgba(102,126,234,0.4)",
        }}
      >
        <p className="text-xs text-[#667eea] font-semibold mb-1">{label}</p>
        <GradientText variant="aurora" className="text-xl font-black">
          ₹ {Number(payload[0].value).toLocaleString("en-IN")}
        </GradientText>
      </motion.div>
    );
  }
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ─────────────────────────────────────────────────────────────────────────────
  // State - FIXED: Only store transactions, calculate rest using useMemo
  // ─────────────────────────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBalance, setShowBalance] = useState(true);

  // 🔥 AUTO-CALCULATED SUMMARY - This will NEVER be wrong!
 // 🔥 FIXED: useMemo with Math.round()
const summary = useMemo(() => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    // 🔥 FIX: Round the amount to avoid floating point issues
    const amt = Math.round(Math.abs(Number(t.amount) || 0));
    const type = (t.type || "").toLowerCase().trim();

    if (type === "income") {
      totalIncome += amt;
    } else if (type === "expense") {
      totalExpense += amt;
    }
  });

  // 🔥 FIX: Round final values
  totalIncome = Math.round(totalIncome);
  totalExpense = Math.round(totalExpense);
  const balance = Math.round(totalIncome - totalExpense);

  console.log("📊 Summary:", { totalIncome, totalExpense, balance });

  return {
    transactions,
    totalIncome,
    totalExpense,
    balance,
  };
}, [transactions]);

  // Remaining from income (savings)
  const remainingFromIncome = summary.totalIncome - summary.totalExpense;

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    paymentMethod: "",
    note: "",
    source: "",
  });

  const [goalStatus, setGoalStatus] = useState(null);
  const [goalForm, setGoalForm] = useState({
    name: "",
    targetAmount: "",
    monthlyTarget: "",
    deadline: "",
  });
  const [goalLoading, setGoalLoading] = useState(false);
  const [goalError, setGoalError] = useState("");

  const [alerts, setAlerts] = useState([]);
  const [toast, setToast] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────────
  // Data Loading - FIXED
  // ─────────────────────────────────────────────────────────────────────────────
  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const now = new Date();
      const data = await fetchTransactions({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      });

      // 🔥 FIX: Handle both array and object response from API
      let txList = [];
      
      if (Array.isArray(data)) {
        // API returns array directly
        txList = data;
      } else if (data && Array.isArray(data.transactions)) {
        // API returns { transactions: [], ... }
        txList = data.transactions;
      } else if (data && typeof data === 'object') {
        // Try to find transactions in response
        txList = data.data || data.items || [];
      }

      console.log("📦 Loaded Transactions:", txList.length, txList);
      setTransactions(txList);

    } catch (err) {
      console.error("Summary load error:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadGoal = useCallback(async () => {
    try {
      if (!user?.id) return;
      const res = await fetchGoalStatus(user.id);
      setGoalStatus(res);

      if (res.goal) {
        setGoalForm({
          name: res.goal.name || "",
          targetAmount: res.goal.targetAmount?.toString() || "",
          monthlyTarget: res.goal.monthlyTarget ? res.goal.monthlyTarget.toString() : "",
          deadline: res.goal.deadline ? new Date(res.goal.deadline).toISOString().slice(0, 10) : "",
        });
      }
    } catch (err) {
      console.error("Goal load error:", err);
    }
  }, [user?.id]);

  const loadAlerts = useCallback(async () => {
    try {
      if (!user?.id) return;
      const list = await fetchAlerts(user.id);
      setAlerts(list || []);
    } catch (err) {
      console.error("Alert load error:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    loadSummary();
    loadGoal();
    loadAlerts();
  }, [loadSummary, loadGoal, loadAlerts]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // 🔥 FIXED: handleAdd function
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setIsSubmitting(true);

      // 🔥 Always send positive amount, type determines income/expense
      const payload = {
      userId: user.id,
      amount: Math.round(Math.abs(Number(form.amount))), // Integer only!
      type: form.type.toLowerCase().trim(),
      category: form.category,
      paymentMethod: form.paymentMethod,
      note: form.note,
      source: form.type === "income" ? form.source : undefined,
    };

      console.log("📤 Sending:", payload);


      await createTransaction(payload);

      // Reset form
      setForm({
        amount: "",
        type: "expense",
        category: "",
        paymentMethod: "",
        note: "",
        source: "",
      });

      // Reload data
      await loadSummary();
      await loadAlerts();

      showToast(form.type === "income" ? "💰 Income added!" : "💸 Expense recorded!", "success");
    } catch (err) {
      console.error("Add transaction error:", err);
      setError(err.message || "Failed to add transaction");
      showToast("Failed to add transaction", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoalChange = (e) => {
    setGoalForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGoalSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setGoalError("");
      setGoalLoading(true);

      const payload = {
        userId: user.id,
        name: goalForm.name,
        targetAmount: Number(goalForm.targetAmount),
        monthlyTarget: goalForm.monthlyTarget ? Number(goalForm.monthlyTarget) : undefined,
        deadline: goalForm.deadline || undefined,
      };

      await saveGoal(payload);
      await loadGoal();
      showToast("🎯 Goal saved!", "success");
    } catch (err) {
      console.error("Goal save error:", err);
      setGoalError(err.message || "Failed to save goal");
      showToast("Failed to save goal", "error");
    } finally {
      setGoalLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // Computed - FIXED
  // ─────────────────────────────────────────────────────────────────────────────
  const goal = goalStatus?.goal || null;
  const progress = goalStatus?.progress || null;
  const progressPercent = progress?.progressPercent ?? 0;

  const monthLabel = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  // 🔥 FIXED: Category data for pie chart - ONLY expenses
  const categoryData = useMemo(() => {
    const map = {};

    (summary.transactions || []).forEach((t) => {
      // Only count expenses for category breakdown
      const type = (t.type || "").toLowerCase().trim();
      if (type !== "expense") return;

      const cat = t.category || "Other";
      const amt = Math.abs(Number(t.amount) || 0);

      map[cat] = (map[cat] || 0) + amt;
    });

    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  }, [summary.transactions]);

  // 🔥 FIXED: Timeline data for area chart
  const timelineData = useMemo(() => {
    const txs = [...(summary.transactions || [])].sort(
      (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    );

    let running = 0;

    return txs.map((t) => {
      const amt = Math.abs(Number(t.amount) || 0);
      const type = (t.type || "").toLowerCase().trim();

      if (type === "income") {
        running += amt;
      } else if (type === "expense") {
        running -= amt;
      }

      return {
        date: new Date(t.date || t.createdAt).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        value: running,
      };
    });
  }, [summary.transactions]);

  // Options
  const categoryOptions = [
    { value: "food", label: "🍔 Food & Dining" },
    { value: "transport", label: "🚗 Transport" },
    { value: "shopping", label: "🛍️ Shopping" },
    { value: "entertainment", label: "🎬 Entertainment" },
    { value: "bills", label: "📄 Bills" },
    { value: "health", label: "🏥 Health" },
    { value: "education", label: "📚 Education" },
    { value: "travel", label: "✈️ Travel" },
    { value: "other", label: "📦 Other" },
  ];

  const paymentOptions = [
    { value: "upi", label: "📱 UPI" },
    { value: "cash", label: "💵 Cash" },
    { value: "card", label: "💳 Card" },
    { value: "netbanking", label: "🏦 Net Banking" },
  ];

  const sourceOptions = [
    { value: "salary", label: "💼 Salary" },
    { value: "freelance", label: "💻 Freelance" },
    { value: "other", label: "📦 Other" },
  ];

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <AppShell>
      <AuroraBackground />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <div className="fixed top-6 right-6 z-50">
            <LuxuryToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
          </div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen px-4 py-6 lg:px-10 lg:py-8">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* ALERTS */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <AnimatePresence>
          {alerts?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <LuxuryGlassCard variant="gold" className="p-4" hover3D={false}>
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="p-2 rounded-xl bg-[#bf953f]/20"
                  >
                    <Bell size={20} className="text-[#bf953f]" />
                  </motion.div>
                  <p className="text-sm text-white/80">{alerts[0]}</p>
                </div>
              </LuxuryGlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10"
        >
          <div className="flex items-center gap-5">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative p-4 rounded-3xl"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
                boxShadow: "0 20px 60px -15px rgba(102,126,234,0.5)",
              }}
            >
              <Wallet size={32} className="text-white" />
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div
                  className="p-1.5 rounded-full"
                  style={{
                    background: "linear-gradient(135deg, #bf953f, #fcf6ba)",
                    boxShadow: "0 0 20px rgba(191,149,63,0.6)",
                  }}
                >
                  <Crown size={14} className="text-black" />
                </div>
              </motion.div>
            </motion.div>

            <div>
              <div className="flex items-center gap-3">
                <GradientText variant="aurora" className="text-2xl tracking-tight">
                  SMART EXPENSE
                </GradientText>
                <motion.span
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="px-3 py-1 rounded-full text-[10px] font-black tracking-wider"
                  style={{
                    background: "linear-gradient(135deg, #bf953f, #fcf6ba)",
                    color: "#000",
                    boxShadow: "0 5px 20px -5px rgba(191,149,63,0.5)",
                  }}
                >
                  LUXURY
                </motion.span>
              </div>
              <p className="text-sm text-white/40 mt-1">{monthLabel} · Premium Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-right hidden md:block">
              <p className="text-xl font-semibold text-white">
                Welcome, {user.name || "User"}
                <motion.span
                  animate={{ rotate: [0, 20, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block ml-2"
                >
                  ✨
                </motion.span>
              </p>
              <p className="text-xs text-white/40">Premium Member</p>
            </motion.div>

            <LuxuryButton
              variant="ghost"
              onClick={() => navigate("/summary")}
              icon={<BarChart3 size={18} />}
              size="sm"
            >
              <span className="hidden sm:inline">Summary</span>
            </LuxuryButton>

            <LuxuryButton variant="danger" onClick={handleLogout} icon={<LogOut size={18} />} size="sm">
              <span className="hidden sm:inline">Logout</span>
            </LuxuryButton>
          </div>
        </motion.header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MAIN BALANCE */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <LuxuryGlassCard variant="aurora" className="lg:col-span-2 p-8" delay={0.1}>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <motion.div
                    className="p-4 rounded-2xl"
                    style={{ background: "rgba(102,126,234,0.15)" }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Gem size={28} className="text-[#667eea]" />
                  </motion.div>
                  <div>
                    <p className="text-sm text-white/50 uppercase tracking-widest">Total Balance</p>
                    <div className="flex items-center gap-2 mt-1">
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
                        style={{ background: "rgba(42,245,152,0.15)", color: "#2af598" }}
                      >
                        <Radio size={10} />
                        LIVE
                      </motion.span>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-3 rounded-2xl transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                >
                  {showBalance ? (
                    <Eye size={22} className="text-[#667eea]" />
                  ) : (
                    <EyeOff size={22} className="text-white/30" />
                  )}
                </motion.button>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <div className="mb-8">
                  <motion.div
                    className="text-6xl font-black mb-3"
                    style={{
                      background: summary.balance >= 0
                        ? "linear-gradient(135deg, #667eea 0%, #764ba2 30%, #f093fb 60%, #2af598 100%)"
                        : "linear-gradient(135deg, #ff416c, #ff4b2b)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      filter: "drop-shadow(0 0 30px rgba(102,126,234,0.3))",
                    }}
                  >
                    {showBalance ? <AnimatedNumber value={summary.balance} duration={2} /> : "₹ ••••••"}
                  </motion.div>
                </div>

                <div className="grid grid-cols-2 gap-5 mb-5">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-5 rounded-2xl border"
                    style={{
                      background: "linear-gradient(135deg, rgba(42,245,152,0.08), rgba(18,194,233,0.03))",
                      borderColor: "rgba(42,245,152,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-xl bg-[#2af598]/20">
                        <ArrowUpRight size={18} className="text-[#2af598]" />
                      </div>
                      <span className="text-xs text-white/50 uppercase tracking-wider">Income</span>
                    </div>
                    <GradientText variant="crystal" className="text-2xl font-bold">
                      {showBalance ? <AnimatedNumber value={summary.totalIncome} /> : "₹ ••••"}
                    </GradientText>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="p-5 rounded-2xl border"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,107,157,0.08), rgba(196,113,237,0.03))",
                      borderColor: "rgba(255,107,157,0.2)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-xl bg-[#ff6b9d]/20">
                        <ArrowDownRight size={18} className="text-[#ff6b9d]" />
                      </div>
                      <span className="text-xs text-white/50 uppercase tracking-wider">Expense</span>
                    </div>
                    <GradientText variant="pink" className="text-2xl font-bold">
                      {showBalance ? <AnimatedNumber value={summary.totalExpense} /> : "₹ ••••"}
                    </GradientText>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                >
                  <p className="text-sm text-white/60 flex items-center gap-2">
                    {remainingFromIncome >= 0 ? (
                      <>
                        <Sparkles size={16} className="text-[#2af598]" />
                        Savings:{" "}
                        <GradientText variant="crystal" className="text-base" animate={false}>
                          ₹ {remainingFromIncome.toLocaleString("en-IN")}
                        </GradientText>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} className="text-[#ff6b9d]" />
                        Overspent:{" "}
                        <span className="text-[#ff6b9d] font-bold">
                          ₹ {Math.abs(remainingFromIncome).toLocaleString("en-IN")}
                        </span>
                      </>
                    )}
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </LuxuryGlassCard>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-5">
            <LuxuryStatCard
              title="Total Income"
              value={summary.totalIncome}
              icon={<TrendingUp size={24} />}
              trend="up"
              trendValue="+12%"
              variant="crystal"
              delay={0.2}
            />
            <LuxuryStatCard
              title="Total Expense"
              value={summary.totalExpense}
              icon={<ArrowDownRight size={24} />}
              trend="down"
              trendValue="-5%"
              variant="pink"
              delay={0.3}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* CHARTS & CONTENT */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LuxuryGlassCard variant="aurora" className="p-6" delay={0.2}>
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    className="p-3 rounded-xl bg-[#667eea]/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <PieChartIcon size={22} className="text-[#667eea]" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-white">Category Split</p>
                    <p className="text-xs text-white/40">Where money goes</p>
                  </div>
                </div>

                <div style={{ height: 280 }}>
                  {categoryData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20">
                      <PieChartIcon size={60} className="mb-4 opacity-30" />
                      <p className="text-sm">No expense data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={3}
                          animationDuration={1500}
                        >
                          {categoryData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip content={<LuxuryTooltip />} />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", paddingTop: "15px" }}
                          formatter={(v) => <span className="text-white/60">{v}</span>}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </LuxuryGlassCard>

              <LuxuryGlassCard variant="crystal" className="p-6" delay={0.3}>
                <div className="flex items-center gap-3 mb-5">
                  <motion.div
                    className="p-3 rounded-xl bg-[#2af598]/20"
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp size={22} className="text-[#2af598]" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-white">Net Flow</p>
                    <p className="text-xs text-white/40">Daily trend</p>
                  </div>
                </div>

                <div style={{ height: 280 }}>
                  {timelineData.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20">
                      <LineChartIcon size={60} className="mb-4 opacity-30" />
                      <p className="text-sm">No data yet</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timelineData}>
                        <defs>
                          <linearGradient id="auroraFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#667eea" stopOpacity={0.6} />
                            <stop offset="50%" stopColor="#764ba2" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#f093fb" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                        <XAxis dataKey="date" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickFormatter={(v) => `₹${v}`} tickLine={false} axisLine={false} />
                        <Tooltip content={<LuxuryTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="url(#auroraFill)"
                          strokeWidth={3}
                          fill="url(#auroraFill)"
                          dot={{ r: 4, fill: "#667eea", stroke: "#fff", strokeWidth: 2 }}
                          activeDot={{ r: 7, fill: "#f093fb", stroke: "#fff", strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </LuxuryGlassCard>
            </div>

            {/* Transactions */}
            <LuxuryGlassCard variant="pink" className="p-6" delay={0.4}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <motion.div className="p-3 rounded-xl bg-[#ff6b9d]/20" whileHover={{ scale: 1.1 }}>
                    <Receipt size={22} className="text-[#ff6b9d]" />
                  </motion.div>
                  <div>
                    <p className="text-sm font-semibold text-white">Recent Transactions</p>
                    <p className="text-xs text-white/40">{summary.transactions.length} entries</p>
                  </div>
                </div>
                <motion.button whileHover={{ x: 5 }} className="flex items-center gap-1 text-xs text-[#ff6b9d] font-semibold">
                  View All <ChevronRight size={14} />
                </motion.button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center h-48">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-10 h-10 border-3 border-[#ff6b9d] border-t-transparent rounded-full"
                  />
                </div>
              ) : summary.transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-white/20">
                  <Receipt size={60} className="mb-4 opacity-30" />
                  <p className="text-sm">No transactions yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 luxury-scrollbar">
                  {summary.transactions.slice(0, 8).map((t, i) => {
                    const type = (t.type || "").toLowerCase().trim();
                    const isIncome = type === "income";
                    const amount = Math.abs(Number(t.amount) || 0);
                    
                    return (
                      <motion.div
                        key={t._id || i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="flex items-center justify-between p-4 rounded-2xl transition-all duration-300"
                        style={{
                          background: "rgba(255,255,255,0.02)",
                          border: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-xl ${
                              isIncome ? "bg-[#2af598]/20 text-[#2af598]" : "bg-[#ff6b9d]/20 text-[#ff6b9d]"
                            }`}
                          >
                            {isIncome ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{t.category || "General"}</p>
                            <p className="text-xs text-white/40">
                              {t.paymentMethod || "N/A"} • {new Date(t.date || t.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <GradientText variant={isIncome ? "crystal" : "pink"} className="text-lg font-bold">
                          {isIncome ? "+" : "-"} ₹{amount.toLocaleString("en-IN")}
                        </GradientText>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </LuxuryGlassCard>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Goal */}
            <LuxuryGlassCard variant="gold" className="p-6" delay={0.3}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="p-3 rounded-xl bg-[#bf953f]/20"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Target size={22} className="text-[#bf953f]" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white">Savings Goal</p>
                  <p className="text-xs text-white/40">Track progress</p>
                </div>
              </div>

              {goal ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-6">
                  <div className="flex justify-center mb-5">
                    <LuxuryProgressRing percentage={progressPercent} />
                  </div>
                  <GradientText variant="gold" className="text-xl mb-3">
                    🎯 {goal.name}
                  </GradientText>
                  <div className="space-y-2 text-xs text-white/50">
                    <p>
                      Target: <span className="text-[#fcf6ba] font-semibold">₹{goal.targetAmount?.toLocaleString("en-IN")}</span>
                    </p>
                    {progress && (
                      <>
                        <p>
                          Saved: <span className="text-[#2af598] font-semibold">₹{progress.savedThisMonth?.toLocaleString("en-IN")}</span>
                        </p>
                        <p>
                          Total: <span className="text-[#667eea] font-semibold">₹{progress.totalSaved?.toLocaleString("en-IN")}</span>
                        </p>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-white/20">
                  <Target size={50} className="mb-3 opacity-30" />
                  <p className="text-sm">No goal set</p>
                </div>
              )}

              <form onSubmit={handleGoalSubmit} className="space-y-3">
                <LuxuryInput
                  name="name"
                  placeholder="Goal name"
                  value={goalForm.name}
                  onChange={handleGoalChange}
                  required
                  icon={<Star size={16} />}
                  variant="gold"
                />
                <div className="grid grid-cols-2 gap-3">
                  <LuxuryInput
                    type="number"
                    name="targetAmount"
                    placeholder="Target (₹)"
                    value={goalForm.targetAmount}
                    onChange={handleGoalChange}
                    required
                    variant="gold"
                  />
                  <LuxuryInput
                    type="number"
                    name="monthlyTarget"
                    placeholder="Monthly (₹)"
                    value={goalForm.monthlyTarget}
                    onChange={handleGoalChange}
                    variant="gold"
                  />
                </div>
                <LuxuryInput type="date" name="deadline" value={goalForm.deadline} onChange={handleGoalChange} variant="gold" />
                <LuxuryButton type="submit" variant="gold" fullWidth loading={goalLoading} icon={<Target size={16} />}>
                  Save Goal
                </LuxuryButton>
                {goalError && <p className="text-xs text-[#ff6b9d] text-center">{goalError}</p>}
              </form>
            </LuxuryGlassCard>

            {/* Quick Entry */}
            <LuxuryGlassCard variant="aurora" className="p-6" delay={0.4}>
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  className="p-3 rounded-xl bg-[#667eea]/20"
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <PlusCircle size={22} className="text-[#667eea]" />
                </motion.div>
                <div>
                  <p className="text-sm font-semibold text-white">Quick Entry</p>
                  <p className="text-xs text-white/40">Add transaction</p>
                </div>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <LuxuryInput
                    type="number"
                    name="amount"
                    placeholder="Amount (₹)"
                    value={form.amount}
                    onChange={handleChange}
                    required
                    icon={<Coins size={16} />}
                  />
                  <LuxurySelect
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    options={[
                      { value: "expense", label: "💸 Expense" },
                      { value: "income", label: "💰 Income" },
                    ]}
                  />
                </div>

                <AnimatePresence>
                  {form.type === "income" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <LuxurySelect
                        name="source"
                        value={form.source}
                        onChange={handleChange}
                        placeholder="Income source"
                        options={sourceOptions}
                        required
                        variant="crystal"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <LuxurySelect name="category" value={form.category} onChange={handleChange} placeholder="Category" options={categoryOptions} required variant="pink" />
                <LuxurySelect name="paymentMethod" value={form.paymentMethod} onChange={handleChange} placeholder="Payment method" options={paymentOptions} />
                <LuxuryTextarea name="note" placeholder="Note (optional)" value={form.note} onChange={handleChange} rows={2} />
                <LuxuryButton type="submit" variant="aurora" fullWidth loading={isSubmitting} icon={<Zap size={18} />}>
                  Add Transaction
                </LuxuryButton>
                {error && <p className="text-xs text-[#ff6b9d] text-center">{error}</p>}
              </form>
            </LuxuryGlassCard>
          </div>
        </div>

        {/* Footer */}
        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-14 text-center">
          <div className="flex items-center justify-center gap-3 text-white/30 text-xs">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
              <Gem size={14} className="text-[#667eea]" />
            </motion.div>
            <span>Smart Expense</span>
            <span className="text-[#667eea]">•</span>
            <span>Made with</span>
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              💜
            </motion.span>
            <span className="text-[#f093fb]">•</span>
            <GradientText variant="aurora" className="text-xs">
              ADITYA EDITION
            </GradientText>
          </div>
        </motion.footer>
      </div>

      {/* Styles */}
      <style>{`
        .luxury-scrollbar::-webkit-scrollbar { width: 6px; }
        .luxury-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .luxury-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(135deg, #667eea, #f093fb); border-radius: 10px; }
        .luxury-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(135deg, #f093fb, #667eea); }
        ::selection { background: rgba(102,126,234,0.3); color: white; }
      `}</style>
    </AppShell>
  );
}

export default Dashboard;