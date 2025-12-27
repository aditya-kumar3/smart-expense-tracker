// src/pages/Summary.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import {
  ArrowLeft,
  Trophy,
  Brain,
  Sparkles,
  Crown,
  TrendingUp,
  TrendingDown,
  PieChart,
  MessageCircle,
  Send,
  Zap,
  Target,
  Gem,
  Star,
  ChevronRight,
  BarChart3,
  Wallet,
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
  X,
} from "lucide-react";

import { fetchInsights } from "../services/insights";
import { fetchAiInsights, chatWithAi } from "../services/ai";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 AURORA LUXURY COLOR SYSTEM (Same as Dashboard)
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
      {/* Base Gradient */}
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

      {/* Animated Aurora Waves */}
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

        {/* Aurora Wave 1 */}
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

        {/* Aurora Wave 2 */}
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

      {/* Floating Crystals */}
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

      {/* Mesh Grid */}
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

      {/* Radial Glow Centers */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(102,126,234,0.1) 0%, transparent 60%)",
          top: "-400px",
          left: "-400px",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
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
      {/* Glass Background */}
      <div
        className="absolute inset-0 rounded-[28px]"
        style={{
          background: config.bg,
        }}
      />

      {/* Border Gradient */}
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

      {/* Spotlight Effect */}
      <motion.div
        className="absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 100}% ${50 + mousePosition.y * 100}%, ${config.glow} 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Top Highlight */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />

      {/* Moving Shimmer */}
      <motion.div
        className="absolute inset-0 rounded-[28px]"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)",
        }}
        animate={isHovered ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 rounded-[32px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 70%)`,
          filter: "blur(20px)",
          opacity: isHovered ? 0.6 : 0,
          zIndex: -1,
        }}
      />

      {/* Content */}
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
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      />

      {/* Top Highlight */}
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
  onKeyDown,
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
      className="relative group flex-1"
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
        onKeyDown={onKeyDown}
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

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] rounded-full"
        style={{ background: `linear-gradient(90deg, transparent, ${config.accent}, transparent)` }}
        initial={{ width: 0, x: "-50%" }}
        animate={{ width: isFocused ? "80%" : 0, x: "-50%" }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow Effect */}
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
// 📊 ANIMATED NUMBER DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════
const AnimatedNumber = ({ value, prefix = "₹", duration = 2, className = "" }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const easeOutExpo = 1 - Math.pow(2, -10 * progress);
      setDisplayValue(value * easeOutExpo);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix} {displayValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💬 CHAT MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════════════════════
const ChatBubble = ({ message, isAi, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      className={`flex gap-3 ${isAi ? "justify-start" : "justify-end"}`}
    >
      {isAi && (
        <motion.div
          className="p-2 rounded-xl bg-[#667eea]/20 h-fit"
          whileHover={{ scale: 1.1, rotate: 10 }}
        >
          <Bot size={18} className="text-[#667eea]" />
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl text-sm
          ${isAi 
            ? "bg-white/[0.03] border border-white/10 text-white/90" 
            : "bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white"
          }
        `}
        style={{
          boxShadow: isAi 
            ? "0 10px 40px -10px rgba(102,126,234,0.2)" 
            : "0 10px 40px -10px rgba(102,126,234,0.4)",
        }}
      >
        {message}
      </motion.div>
      
      {!isAi && (
        <motion.div
          className="p-2 rounded-xl bg-[#f093fb]/20 h-fit"
          whileHover={{ scale: 1.1, rotate: -10 }}
        >
          <User size={18} className="text-[#f093fb]" />
        </motion.div>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 CATEGORY PROGRESS BAR
// ═══════════════════════════════════════════════════════════════════════════════
const CategoryBar = ({ label, amount, percentage, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, type: "spring" }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/80">{label}</span>
        <div className="flex items-center gap-2">
          <GradientText variant="aurora" className="text-sm">
            ₹{amount.toLocaleString("en-IN")}
          </GradientText>
          <span className="text-xs text-white/40 px-2 py-0.5 rounded-full bg-white/5">
            {percentage}%
          </span>
        </div>
      </div>
      
      <div className="h-3 rounded-full bg-white/5 overflow-hidden relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: delay + 0.2, ease: "easeOut" }}
          className="h-full rounded-full relative"
          style={{
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            boxShadow: `0 0 20px ${color}50`,
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏆 MAIN SUMMARY COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Summary() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const chatContainerRef = useRef(null);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "ai", text: "Hey! Ask me anything about your spending. I'm here to help! 😊" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Auto scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user?.id) return;
    const q = chatInput.trim();

    setChatMessages((p) => [...p, { from: "user", text: q }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await chatWithAi(user.id, q);
      setChatMessages((p) => [...p, { from: "ai", text: res.answer }]);
    } catch {
      setChatMessages((p) => [
        ...p,
        { from: "ai", text: "Oops! Server busy right now. Try again in a moment 😊" },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        if (!user?.id) return;
        setLoading(true);
        const res = await fetchInsights(user.id);
        setData(res);
      } finally {
        setLoading(false);
      }

      try {
        setAiLoading(true);
        const ai = await fetchAiInsights(user.id);
        if (ai) setAiText(ai);
      } finally {
        setAiLoading(false);
      }
    };
    load();
  }, []);

  const summary = data?.summary;
  const categories = data?.categories || [];

  const topCategory =
    categories.length > 0
      ? categories.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null;

  const monthLabel = new Date().toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const isOver = summary && summary.remainingBudget < 0;
  const saved =
    summary && !isOver
      ? summary.remainingBudget
      : summary
      ? Math.abs(summary.remainingBudget)
      : 0;

  // ═══════════════════════════════════════════════════════════════════════════════
  // 🎨 RENDER
  // ═══════════════════════════════════════════════════════════════════════════════
  return (
    <div className="min-h-screen relative">
      <AuroraBackground />

      <div className="relative z-10 min-h-screen px-4 py-6 lg:px-10 lg:py-8">
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* HEADER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div className="flex items-center gap-5">
            <LuxuryButton
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              icon={<ArrowLeft size={18} />}
              size="sm"
            >
              Back
            </LuxuryButton>

            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative p-4 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)",
                  boxShadow: "0 20px 60px -15px rgba(191,149,63,0.5)",
                }}
              >
                <BarChart3 size={28} className="text-black" />
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div
                    className="p-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #667eea, #f093fb)",
                      boxShadow: "0 0 20px rgba(102,126,234,0.6)",
                    }}
                  >
                    <Sparkles size={12} className="text-white" />
                  </div>
                </motion.div>
              </motion.div>

              <div>
                <GradientText variant="gold" className="text-2xl tracking-tight">
                  {monthLabel}
                </GradientText>
                <p className="text-sm text-white/40 mt-1">Monthly Summary Report</p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-4 py-2 rounded-full text-[11px] font-black tracking-wider"
              style={{
                background: "linear-gradient(135deg, #bf953f, #fcf6ba)",
                color: "#000",
                boxShadow: "0 5px 20px -5px rgba(191,149,63,0.5)",
              }}
            >
              ✨ AI POWERED
            </motion.span>
          </motion.div>
        </motion.header>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TROPHY CARD - PERFORMANCE HIGHLIGHT */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <LuxuryGlassCard variant="gold" className="p-8 mb-8" delay={0.1}>
          <div className="relative">
            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(191,149,63,0.3) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
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
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-black/20 text-[#fcf6ba]">
                      Performance Highlight
                    </span>
                  </div>
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
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
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
                    You spent{" "}
                    <GradientText variant="pink" className="text-xl">
                      ₹{summary.thisMonthTotal.toLocaleString("en-IN")}
                    </GradientText>{" "}
                    across{" "}
                    <span className="font-bold text-white">
                      {summary.thisMonthCount} transactions
                    </span>
                    .{" "}
                    {isOver ? (
                      <>
                        Overshoot by{" "}
                        <span className="text-[#ff6b9d] font-bold">
                          ₹{saved.toLocaleString("en-IN")}
                        </span>
                        . Next month we tighten top category spend! 💪
                      </>
                    ) : (
                      <>
                        Saved{" "}
                        <GradientText variant="crystal" className="text-xl">
                          ₹{saved.toLocaleString("en-IN")}
                        </GradientText>{" "}
                        within budget. Solid discipline! 👏
                      </>
                    )}
                  </motion.p>
                ) : (
                  <p className="text-white/60">
                    Add transactions to generate your full summary.
                  </p>
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
                  <div
                    className="p-4 rounded-2xl text-center min-w-[120px]"
                    style={{
                      background: "rgba(42,245,152,0.1)",
                      border: "1px solid rgba(42,245,152,0.2)",
                    }}
                  >
                    <div className="p-2 rounded-xl bg-[#2af598]/20 w-fit mx-auto mb-2">
                      <ArrowUpRight size={20} className="text-[#2af598]" />
                    </div>
                    <p className="text-xs text-white/50 mb-1">Transactions</p>
                    <GradientText variant="crystal" className="text-2xl">
                      {summary.thisMonthCount}
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
                      {isOver ? (
                        <ArrowDownRight size={20} className="text-[#ff6b9d]" />
                      ) : (
                        <Coins size={20} className="text-[#fcf6ba]" />
                      )}
                    </div>
                    <p className="text-xs text-white/50 mb-1">{isOver ? "Overspent" : "Saved"}</p>
                    <GradientText variant={isOver ? "pink" : "gold"} className="text-2xl">
                      ₹{saved.toLocaleString("en-IN")}
                    </GradientText>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </LuxuryGlassCard>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* MAIN CONTENT GRID */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* CATEGORY BREAKDOWN */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <LuxuryGlassCard variant="aurora" className="p-6" delay={0.2}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 rounded-xl bg-[#667eea]/20"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <PieChart size={22} className="text-[#667eea]" />
              </motion.div>
              <div>
                <p className="text-base font-semibold text-white">Category Breakdown</p>
                <p className="text-xs text-white/40">See category-wise impact on budget</p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-48">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 border-3 border-[#667eea] border-t-transparent rounded-full"
                />
              </div>
            ) : categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-white/30">
                <PieChart size={50} className="mb-3 opacity-30" />
                <p className="text-sm">No categories yet</p>
                <p className="text-xs text-white/20 mt-1">Add expenses from dashboard</p>
              </div>
            ) : (
              <div className="space-y-4">
                {categories.map((cat, idx) => {
                  const total = summary?.thisMonthTotal || 1;
                  const share = Math.round((cat.amount / total) * 100);
                  return (
                    <CategoryBar
                      key={cat.label}
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
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-[#f093fb]" />
                  <span className="text-xs text-white/50">Top Spending Category</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <GradientText variant="pink" className="text-lg">
                    {topCategory.label}
                  </GradientText>
                  <span className="text-white/80 font-semibold">
                    ₹{topCategory.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              </motion.div>
            )}
          </LuxuryGlassCard>

          {/* ─────────────────────────────────────────────────────────────────── */}
          {/* AI INSIGHT & CHAT */}
          {/* ─────────────────────────────────────────────────────────────────── */}
          <LuxuryGlassCard variant="crystal" className="p-6" delay={0.3}>
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                className="p-3 rounded-xl bg-[#2af598]/20"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Brain size={22} className="text-[#2af598]" />
              </motion.div>
              <div>
                <p className="text-base font-semibold text-white">Smart AI Insight</p>
                <p className="text-xs text-white/40">Personalized analysis</p>
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="ml-auto"
              >
                <Sparkles size={18} className="text-[#2af598]/50" />
              </motion.div>
            </div>

            {/* AI Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-4 rounded-2xl mb-6"
              style={{
                background: "rgba(42,245,152,0.05)",
                border: "1px solid rgba(42,245,152,0.15)",
              }}
            >
              {aiLoading ? (
                <div className="flex items-center gap-3 text-white/60">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 size={18} className="text-[#2af598]" />
                  </motion.div>
                  <span className="text-sm">Studying your month... hold on!</span>
                </div>
              ) : aiText ? (
                <p className="text-sm leading-relaxed text-white/80">{aiText}</p>
              ) : (
                <p className="text-sm text-white/50">
                  Add some entries to generate learning insights.
                </p>
              )}
            </motion.div>

            {/* Chat Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MessageCircle size={16} className="text-[#667eea]" />
                <span className="text-sm font-medium text-white/70">Ask AI Anything</span>
              </div>

              {/* Chat Messages */}
              <div
                ref={chatContainerRef}
                className="h-52 overflow-y-auto space-y-3 pr-2 luxury-scrollbar"
              >
                {chatMessages.map((m, i) => (
                  <ChatBubble
                    key={i}
                    message={m.text}
                    isAi={m.from === "ai"}
                    delay={0}
                  />
                ))}
                
                {chatLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-white/50 text-sm pl-12"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    >
                      <Loader2 size={14} className="animate-spin" />
                    </motion.div>
                    <span>Thinking...</span>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleChatSubmit} className="flex gap-3 items-center">
                <LuxuryInput
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask something (e.g., sabse zyada kispe kharch?)"
                  variant="crystal"
                  icon={<MessageCircle size={16} />}
                />
                <LuxuryButton
                  type="submit"
                  variant="crystal"
                  disabled={chatLoading || !chatInput.trim()}
                  loading={chatLoading}
                  icon={<Send size={16} />}
                  size="md"
                >
                  <span className="hidden sm:inline">Ask</span>
                </LuxuryButton>
              </form>
            </div>
          </LuxuryGlassCard>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* QUICK STATS ROW */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
          >
            {/* Total Spent */}
            <LuxuryGlassCard variant="pink" className="p-5" delay={0.5} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#ff6b9d]/20">
                  <Receipt size={18} className="text-[#ff6b9d]" />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wider">Total Spent</span>
              </div>
              <GradientText variant="pink" className="text-2xl">
                <AnimatedNumber value={summary.thisMonthTotal} duration={1.5} />
              </GradientText>
            </LuxuryGlassCard>

            {/* Transaction Count */}
            <LuxuryGlassCard variant="aurora" className="p-5" delay={0.6} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#667eea]/20">
                  <Activity size={18} className="text-[#667eea]" />
                </div>
                <span className="text-xs text-white/50 uppercase tracking-wider">Transactions</span>
              </div>
              <GradientText variant="aurora" className="text-2xl">
                {summary.thisMonthCount}
              </GradientText>
            </LuxuryGlassCard>

            {/* Status */}
            <LuxuryGlassCard variant={isOver ? "pink" : "crystal"} className="p-5" delay={0.7} hover3D={false}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl ${isOver ? "bg-[#ff6b9d]/20" : "bg-[#2af598]/20"}`}>
                  {isOver ? (
                    <AlertCircle size={18} className="text-[#ff6b9d]" />
                  ) : (
                    <CheckCircle2 size={18} className="text-[#2af598]" />
                  )}
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
              <GradientText variant="gold" className="text-lg truncate">
                {topCategory?.label || "N/A"}
              </GradientText>
            </LuxuryGlassCard>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-14 text-center"
        >
          <div className="flex items-center justify-center gap-3 text-white/30 text-xs">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Gem size={14} className="text-[#667eea]" />
            </motion.div>
            <span>Smart Expense</span>
            <span className="text-[#667eea]">•</span>
            <span>Summary Report</span>
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              💜
            </motion.span>
            <span className="text-[#f093fb]">•</span>
            <GradientText variant="aurora" className="text-xs">
              ADITYA EDITION
            </GradientText>
          </div>
        </motion.footer>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STYLES */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <style>{`
        .luxury-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .luxury-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.02);
          border-radius: 10px;
        }
        .luxury-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #f093fb);
          border-radius: 10px;
        }
        .luxury-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #f093fb, #667eea);
        }
        ::selection {
          background: rgba(102,126,234,0.3);
          color: white;
        }
      `}</style>
    </div>
  );
}