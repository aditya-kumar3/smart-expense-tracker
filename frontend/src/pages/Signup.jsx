// src/pages/Signup.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Wallet,
  Eye,
  EyeOff,
  Sparkles,
  Crown,
  Gem,
  Shield,
  Fingerprint,
  Star,
  Zap,
  CheckCircle2,
  AlertCircle,
  Github,
  Chrome,
  TrendingUp,
  PieChart,
  CreditCard,
  Coins,
  Target,
  BarChart3,
  ArrowUpRight,
  Rocket,
  Gift,
  Heart,
  Trophy,
  UserPlus,
} from "lucide-react";

const BASE_URL = "http://localhost:5000";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 AURORA LUXURY COLOR SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
const AURORA_COLORS = {
  aurora: {
    start: "#667eea",
    mid: "#764ba2",
    end: "#f093fb",
  },
  crystal: {
    pink: "#ff6b9d",
    purple: "#c471ed",
    blue: "#12c2e9",
    green: "#2af598",
    orange: "#f5af19",
  },
  gold: {
    dark: "#bf953f",
    mid: "#fcf6ba",
    light: "#fff8dc",
  },
};

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
            radial-gradient(ellipse at 0% 0%, rgba(102, 126, 234, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 0%, rgba(240, 147, 251, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(42, 245, 152, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(18, 194, 233, 0.12) 0%, transparent 50%),
            linear-gradient(180deg, #030014 0%, #0a0520 50%, #050210 100%)
          `,
        }}
      />

      {/* Animated Aurora Waves */}
      <svg className="absolute inset-0 w-full h-full opacity-40" preserveAspectRatio="none">
        <defs>
          <linearGradient id="aurora1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#667eea" stopOpacity="0" />
            <stop offset="50%" stopColor="#764ba2" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f093fb" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#12c2e9" stopOpacity="0" />
            <stop offset="50%" stopColor="#2af598" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f5af19" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b9d" stopOpacity="0" />
            <stop offset="50%" stopColor="#c471ed" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#667eea" stopOpacity="0" />
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
          strokeWidth="120"
          filter="url(#glow)"
          animate={{
            opacity: [0.3, 0.7, 0.3],
            d: [
              "M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100",
              "M0,120 Q250,70 500,120 T1000,80 T1500,120 T2000,80",
              "M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100",
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transform: "translateY(5%)" }}
        />

        {/* Aurora Wave 2 */}
        <motion.path
          d="M0,200 Q300,150 600,200 T1200,200 T1800,200"
          fill="none"
          stroke="url(#aurora2)"
          strokeWidth="100"
          filter="url(#glow)"
          animate={{
            opacity: [0.2, 0.6, 0.2],
            d: [
              "M0,200 Q300,150 600,200 T1200,200 T1800,200",
              "M0,180 Q300,220 600,180 T1200,220 T1800,180",
              "M0,200 Q300,150 600,200 T1200,200 T1800,200",
            ],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          style={{ transform: "translateY(15%)" }}
        />

        {/* Aurora Wave 3 */}
        <motion.path
          d="M0,300 Q400,250 800,300 T1600,300"
          fill="none"
          stroke="url(#aurora3)"
          strokeWidth="80"
          filter="url(#glow)"
          animate={{
            opacity: [0.2, 0.5, 0.2],
            d: [
              "M0,300 Q400,250 800,300 T1600,300",
              "M0,280 Q400,320 800,280 T1600,320",
              "M0,300 Q400,250 800,300 T1600,300",
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
          style={{ transform: "translateY(25%)" }}
        />
      </svg>

      {/* Floating Crystals */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={`crystal-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 6}px`,
            height: `${3 + Math.random() * 6}px`,
          }}
          animate={{
            y: [0, -50 - Math.random() * 50, 0],
            x: [0, Math.random() * 40 - 20, 0],
            rotate: [0, 360],
            opacity: [0.1, 0.9, 0.1],
            scale: [1, 1.8, 1],
          }}
          transition={{
            duration: 6 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `radial-gradient(circle, ${
                ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19", "#ff6b9d"][
                  Math.floor(Math.random() * 6)
                ]
              } 0%, transparent 70%)`,
              boxShadow: `0 0 ${15 + Math.random() * 25}px currentColor`,
            }}
          />
        </motion.div>
      ))}

      {/* Mesh Grid */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Radial Glow Centers */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 60%)",
          top: "-500px",
          left: "-500px",
          filter: "blur(100px)",
        }}
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(240,147,251,0.12) 0%, transparent 60%)",
          bottom: "-400px",
          right: "-400px",
          filter: "blur(120px)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(42,245,152,0.1) 0%, transparent 60%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(80px)",
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎭 3D FLOATING ICONS
// ═══════════════════════════════════════════════════════════════════════════════
const FloatingIcons = () => {
  const icons = [
    { Icon: CreditCard, color: "#667eea", delay: 0 },
    { Icon: Coins, color: "#f093fb", delay: 1 },
    { Icon: PieChart, color: "#2af598", delay: 2 },
    { Icon: TrendingUp, color: "#12c2e9", delay: 3 },
    { Icon: Target, color: "#f5af19", delay: 4 },
    { Icon: BarChart3, color: "#ff6b9d", delay: 5 },
    { Icon: Gem, color: "#c471ed", delay: 6 },
    { Icon: Star, color: "#fcf6ba", delay: 7 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, color, delay }, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${10 + (i * 12)}%`,
            top: `${15 + (i % 3) * 25}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            scale: [0.8, 1.2, 0.8],
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotateY: [0, 360],
            rotateX: [0, 15, 0],
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            delay: delay * 0.5,
            ease: "easeInOut",
          }}
        >
          <div
            className="p-3 rounded-2xl backdrop-blur-sm"
            style={{
              background: `${color}15`,
              border: `1px solid ${color}30`,
              boxShadow: `0 0 30px ${color}20`,
            }}
          >
            <Icon size={24} style={{ color }} />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 3D ROTATING ROCKET (Signup Theme)
// ═══════════════════════════════════════════════════════════════════════════════
const Rotating3DRocket = () => {
  return (
    <motion.div
      className="relative"
      style={{ perspective: "1000px" }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, type: "spring" }}
    >
      <motion.div
        className="relative"
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 10, 0, -10, 0],
        }}
        transition={{
          rotateY: { duration: 20, repeat: Infinity, ease: "linear" },
          rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Main Rocket Face */}
        <div
          className="relative w-28 h-28 rounded-3xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #2af598 0%, #12c2e9 50%, #667eea 100%)",
            boxShadow: `
              0 25px 80px -20px rgba(42,245,152,0.6),
              0 0 60px rgba(18,194,233,0.3),
              inset 0 1px 0 rgba(255,255,255,0.3)
            `,
            transform: "translateZ(20px)",
          }}
        >
          <Rocket size={48} className="text-white drop-shadow-lg" />

          {/* Star Badge */}
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div
              className="p-2 rounded-full"
              style={{
                background: "linear-gradient(135deg, #f5af19, #f093fb)",
                boxShadow: "0 0 25px rgba(240,147,251,0.7)",
              }}
            >
              <Star size={18} className="text-white" />
            </div>
          </motion.div>

          {/* Sparkle Effects */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + i * 20}%`,
                left: `${10 + i * 25}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.2, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
              }}
            >
              <Sparkles size={12} className="text-white/80" />
            </motion.div>
          ))}
        </div>

        {/* Glow Ring */}
        <motion.div
          className="absolute inset-[-20px] rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #2af598, #12c2e9, #667eea, #f093fb, #2af598)",
            filter: "blur(25px)",
            opacity: 0.4,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ✨ GRADIENT TEXT
// ═══════════════════════════════════════════════════════════════════════════════
const GradientText = ({ children, variant = "aurora", className = "" }) => {
  const gradients = {
    aurora: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
    gold: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)",
    crystal: "linear-gradient(135deg, #12c2e9 0%, #2af598 50%, #f5af19 100%)",
    pink: "linear-gradient(135deg, #ff6b9d 0%, #c471ed 50%, #667eea 100%)",
    white: "linear-gradient(135deg, #ffffff 0%, #e0e0e0 50%, #ffffff 100%)",
  };

  return (
    <span
      className={`font-bold ${className}`}
      style={{
        background: gradients[variant],
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 💎 3D GLASS CARD WITH MOUSE TRACKING
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryGlassCard = ({ children, className = "", variant = "aurora", delay = 0 }) => {
  const cardRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const variants = {
    aurora: {
      bg: "linear-gradient(135deg, rgba(102,126,234,0.08) 0%, rgba(240,147,251,0.04) 100%)",
      border: "rgba(102,126,234,0.25)",
      glow: "rgba(102,126,234,0.3)",
    },
    crystal: {
      bg: "linear-gradient(135deg, rgba(42,245,152,0.08) 0%, rgba(18,194,233,0.04) 100%)",
      border: "rgba(42,245,152,0.25)",
      glow: "rgba(42,245,152,0.3)",
    },
    gold: {
      bg: "linear-gradient(135deg, rgba(191,149,63,0.08) 0%, rgba(252,246,186,0.04) 100%)",
      border: "rgba(191,149,63,0.25)",
      glow: "rgba(191,149,63,0.3)",
    },
  };

  const config = variants[variant];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.9, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{
        duration: 1,
        delay,
        type: "spring",
        stiffness: 80,
        damping: 20,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setMousePosition({ x: 0, y: 0 });
      }}
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y * -12}deg) rotateY(${mousePosition.x * 12}deg)`,
        transformStyle: "preserve-3d",
      }}
      className={`
        relative overflow-hidden rounded-[32px]
        backdrop-blur-2xl
        transition-all duration-300 ease-out
        ${className}
      `}
    >
      {/* Glass Background */}
      <div
        className="absolute inset-0 rounded-[32px]"
        style={{ background: config.bg }}
      />

      {/* Animated Border */}
      <div
        className="absolute inset-0 rounded-[32px]"
        style={{
          padding: "2px",
          background: isHovered
            ? `linear-gradient(135deg, ${config.border}, rgba(255,255,255,0.3), ${config.border})`
            : `linear-gradient(135deg, ${config.border}, ${config.border})`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "xor",
          WebkitMaskComposite: "xor",
        }}
      />

      {/* Spotlight */}
      <motion.div
        className="absolute inset-0 rounded-[32px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${50 + mousePosition.x * 100}% ${50 + mousePosition.y * 100}%, ${config.glow} 0%, transparent 50%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />

      {/* Top Highlight */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] rounded-full"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
        }}
      />

      {/* Moving Shimmer */}
      <motion.div
        className="absolute inset-0 rounded-[32px]"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
        }}
        animate={isHovered ? { x: ["-100%", "200%"] } : {}}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* External Glow */}
      <motion.div
        className="absolute -inset-2 rounded-[36px] transition-opacity duration-500"
        style={{
          background: `radial-gradient(ellipse at center, ${config.glow} 0%, transparent 70%)`,
          filter: "blur(25px)",
          opacity: isHovered ? 0.7 : 0,
          zIndex: -1,
        }}
      />

      {/* Content */}
      <div className="relative z-10" style={{ transform: "translateZ(40px)" }}>
        {children}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 LUXURY INPUT WITH GLOW
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryInput = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  showPasswordToggle = false,
  className = "",
  accentColor = "#667eea",
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <motion.div
      className="relative group"
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {/* Icon */}
      {Icon && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
          animate={{ color: isFocused ? accentColor : "rgba(255,255,255,0.3)" }}
        >
          <Icon size={18} />
        </motion.div>
      )}

      <input
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          w-full px-5 py-4 ${Icon ? "pl-12" : ""} ${showPasswordToggle ? "pr-12" : ""}
          rounded-2xl
          bg-white/[0.03]
          border-2 border-white/10
          text-white placeholder:text-white/25
          focus:outline-none
          transition-all duration-300
          text-sm font-medium
          ${className}
        `}
        style={{
          borderColor: isFocused ? accentColor : "rgba(255,255,255,0.1)",
          boxShadow: isFocused
            ? `0 0 40px ${accentColor}40, inset 0 0 20px ${accentColor}15`
            : "none",
        }}
      />

      {/* Password Toggle */}
      {showPasswordToggle && (
        <motion.button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          {showPassword ? (
            <EyeOff size={18} className="text-white/40 hover:text-[#2af598]" />
          ) : (
            <Eye size={18} className="text-white/40 hover:text-[#2af598]" />
          )}
        </motion.button>
      )}

      {/* Bottom Accent Line */}
      <motion.div
        className="absolute bottom-0 left-1/2 h-[2px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accentColor}, #f093fb, transparent)`,
        }}
        initial={{ width: 0, x: "-50%" }}
        animate={{ width: isFocused ? "90%" : 0, x: "-50%" }}
        transition={{ duration: 0.4 }}
      />

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${accentColor}30 0%, transparent 70%)`,
          opacity: isFocused ? 0.5 : 0,
          filter: "blur(20px)",
        }}
      />

      {/* Corner Accents */}
      <AnimatePresence>
        {isFocused && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-1 -left-1 w-3 h-3"
              style={{
                borderTop: "2px solid #2af598",
                borderLeft: "2px solid #2af598",
                borderRadius: "4px 0 0 0",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-1 -right-1 w-3 h-3"
              style={{
                borderTop: "2px solid #12c2e9",
                borderRight: "2px solid #12c2e9",
                borderRadius: "0 4px 0 0",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -bottom-1 -left-1 w-3 h-3"
              style={{
                borderBottom: "2px solid #667eea",
                borderLeft: "2px solid #667eea",
                borderRadius: "0 0 0 4px",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -bottom-1 -right-1 w-3 h-3"
              style={{
                borderBottom: "2px solid #f093fb",
                borderRight: "2px solid #f093fb",
                borderRadius: "0 0 4px 0",
              }}
            />
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 LUXURY BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
const LuxuryButton = ({
  children,
  onClick,
  type = "button",
  variant = "crystal",
  disabled = false,
  loading = false,
  icon,
  className = "",
  fullWidth = false,
}) => {
  const variants = {
    aurora: {
      bg: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)",
      shadow: "rgba(102,126,234,0.5)",
      text: "text-white",
    },
    crystal: {
      bg: "linear-gradient(135deg, #2af598 0%, #12c2e9 50%, #667eea 100%)",
      shadow: "rgba(42,245,152,0.5)",
      text: "text-white",
    },
    gold: {
      bg: "linear-gradient(135deg, #bf953f 0%, #fcf6ba 50%, #bf953f 100%)",
      shadow: "rgba(191,149,63,0.5)",
      text: "text-black",
    },
    ghost: {
      bg: "rgba(255,255,255,0.05)",
      shadow: "rgba(255,255,255,0.1)",
      text: "text-white",
    },
  };

  const config = variants[variant];

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -4 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`
        relative overflow-hidden
        px-8 py-4
        rounded-2xl
        ${config.text}
        font-bold text-base
        flex items-center justify-center gap-3
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${fullWidth ? "w-full" : ""}
        ${variant === "ghost" ? "border border-white/10 hover:border-white/20" : ""}
        ${className}
      `}
      style={{
        background: config.bg,
        boxShadow: `0 15px 50px -12px ${config.shadow}`,
      }}
    >
      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
      />

      {/* Top Highlight */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-[1px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
        }}
      />

      {/* Particles on Hover */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/60"
            style={{
              left: `${15 + i * 15}%`,
              top: "50%",
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.15,
              repeatDelay: 1,
            }}
          />
        ))}
      </motion.div>

      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-6 h-6 border-3 border-current border-t-transparent rounded-full"
        />
      ) : (
        <>
          <span className="relative z-10">{children}</span>
          {icon && (
            <motion.span
              className="relative z-10"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {icon}
            </motion.span>
          )}
        </>
      )}
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 BENEFITS CARDS
// ═══════════════════════════════════════════════════════════════════════════════
const BenefitCard = ({ icon: Icon, title, description, color, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative p-4 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${color}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative flex items-start gap-3">
        <motion.div
          className="p-2 rounded-xl"
          style={{ background: `${color}20` }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <Icon size={20} style={{ color }} />
        </motion.div>
        <div>
          <p className="text-sm font-semibold text-white mb-1">{title}</p>
          <p className="text-xs text-white/50">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ⌨️ TYPING EFFECT
// ═══════════════════════════════════════════════════════════════════════════════
const TypingText = ({ texts, className = "" }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const text = texts[currentTextIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentText.length < text.length) {
            setCurrentText(text.slice(0, currentText.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (currentText.length > 0) {
            setCurrentText(text.slice(0, currentText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          }
        }
      },
      isDeleting ? 50 : 100
    );

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentTextIndex, texts]);

  return (
    <span className={className}>
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-[2px] h-5 bg-[#2af598] ml-1 align-middle"
      />
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🔐 PASSWORD STRENGTH METER
// ═══════════════════════════════════════════════════════════════════════════════
const PasswordStrength = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["#ff416c", "#ff6b9d", "#f5af19", "#12c2e9", "#2af598"];

  if (!password) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 space-y-2"
    >
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-1.5 flex-1 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: i < strength ? "100%" : "0%",
                background: strengthColors[Math.min(strength - 1, 4)],
              }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            />
          </motion.div>
        ))}
      </div>
      <p
        className="text-[10px] font-medium"
        style={{ color: strengthColors[Math.min(strength - 1, 4)] || "#666" }}
      >
        {strength > 0 ? strengthLabels[strength - 1] : "Enter password"}
      </p>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 MAIN SIGNUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      setSuccess(true);

      // Celebration delay before redirect
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (err) {
      console.error("SIGNUP ERROR:", err);
      setError(err.message || "Something went wrong while creating account.");
    } finally {
      setLoading(false);
    }
  };

  const typingTexts = [
    "Start your financial journey",
    "Track expenses effortlessly",
    "Achieve your savings goals",
    "AI-powered smart insights",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AuroraBackground />
      <FloatingIcons />

      {/* Success Celebration */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #2af598, #12c2e9)",
                  boxShadow: "0 0 60px rgba(42,245,152,0.5)",
                }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <CheckCircle2 size={48} className="text-white" />
              </motion.div>
              <GradientText variant="crystal" className="text-3xl">
                Account Created!
              </GradientText>
              <p className="text-white/60 mt-2">Redirecting to login...</p>

              {/* Confetti */}
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    background: ["#667eea", "#f093fb", "#2af598", "#12c2e9", "#f5af19"][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                  initial={{ top: "50%", opacity: 1 }}
                  animate={{
                    top: "-10%",
                    opacity: 0,
                    x: (Math.random() - 0.5) * 300,
                    rotate: Math.random() * 720,
                  }}
                  transition={{ duration: 2, delay: i * 0.04 }}
                />
              ))}

              {/* Stars burst */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute"
                  style={{
                    left: "50%",
                    top: "50%",
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [1, 1, 0],
                    x: Math.cos((i * Math.PI * 2) / 8) * 150,
                    y: Math.sin((i * Math.PI * 2) / 8) * 150,
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <Star size={20} className="text-[#fcf6ba]" fill="#fcf6ba" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* LEFT: HERO SECTION */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block space-y-8"
          >
            {/* 3D Rocket */}
            <div className="flex justify-center mb-8">
              <Rotating3DRocket />
            </div>

            {/* Brand */}
            <div className="text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <GradientText variant="crystal" className="text-4xl tracking-tight">
                    SMART EXPENSE
                  </GradientText>
                  <motion.span
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="px-3 py-1.5 rounded-full text-[10px] font-black tracking-wider"
                    style={{
                      background: "linear-gradient(135deg, #2af598, #12c2e9)",
                      color: "#000",
                      boxShadow: "0 5px 20px rgba(42,245,152,0.4)",
                    }}
                  >
                    FREE
                  </motion.span>
                </div>

                <p className="text-lg text-white/60 mb-2">
                  <TypingText texts={typingTexts} />
                </p>
              </motion.div>
            </div>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="space-y-3"
            >
              <BenefitCard
                icon={Gift}
                title="100% Free Forever"
                description="No hidden charges, no premium plans"
                color="#2af598"
                delay={0.7}
              />
              <BenefitCard
                icon={Shield}
                title="Bank-Level Security"
                description="Your data is encrypted and secure"
                color="#667eea"
                delay={0.8}
              />
              <BenefitCard
                icon={Zap}
                title="AI-Powered Insights"
                description="Smart suggestions to save more"
                color="#f093fb"
                delay={0.9}
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex justify-center gap-8"
            >
              {[
                { value: "10K+", label: "Users" },
                { value: "₹50L+", label: "Tracked" },
                { value: "4.9★", label: "Rating" },
              ].map(({ value, label }, i) => (
                <motion.div
                  key={label}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="text-center"
                >
                  <GradientText variant="crystal" className="text-2xl">
                    {value}
                  </GradientText>
                  <p className="text-xs text-white/40">{label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="p-4 rounded-2xl text-center"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-sm text-white/60 italic mb-2">
                "Finally an app that makes tracking expenses fun!"
              </p>
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className="text-[#fcf6ba]" fill="#fcf6ba" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* RIGHT: SIGNUP FORM */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <LuxuryGlassCard variant="crystal" className="p-8 lg:p-10" delay={0.3}>
            {/* Header */}
            <div className="text-center mb-8">
              {/* Mobile Logo */}
              <div className="lg:hidden flex justify-center mb-6">
                <Rotating3DRocket />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-4"
                  style={{
                    background: "rgba(42,245,152,0.15)",
                    color: "#2af598",
                    border: "1px solid rgba(42,245,152,0.3)",
                  }}
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Rocket size={14} />
                  Get Started Free
                </motion.span>

                <h1 className="text-3xl lg:text-4xl font-black mb-3">
                  <GradientText variant="crystal">Create Account</GradientText>
                </h1>

                <p className="text-sm text-white/50">
                  Join thousands managing their finances smartly
                </p>
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="flex items-center gap-2 text-xs font-medium text-white/70 mb-2 ml-1">
                  <User size={14} className="text-[#2af598]" />
                  Full Name
                </label>
                <LuxuryInput
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                  icon={User}
                  accentColor="#2af598"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="flex items-center gap-2 text-xs font-medium text-white/70 mb-2 ml-1">
                  <Mail size={14} className="text-[#12c2e9]" />
                  Email Address
                </label>
                <LuxuryInput
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  icon={Mail}
                  accentColor="#12c2e9"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <label className="flex items-center gap-2 text-xs font-medium text-white/70 mb-2 ml-1">
                  <Lock size={14} className="text-[#667eea]" />
                  Password
                </label>
                <LuxuryInput
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  showPasswordToggle
                  accentColor="#667eea"
                />
                <PasswordStrength password={form.password} />
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{
                      background: "rgba(255,65,108,0.1)",
                      border: "1px solid rgba(255,65,108,0.3)",
                    }}
                  >
                    <AlertCircle size={18} className="text-[#ff416c]" />
                    <span className="text-sm text-[#ff6b9d]">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Terms */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="text-[11px] text-white/40 text-center"
              >
                By signing up, you agree to our{" "}
                <span className="text-[#2af598] cursor-pointer hover:underline">Terms</span> and{" "}
                <span className="text-[#2af598] cursor-pointer hover:underline">Privacy Policy</span>
              </motion.p>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <LuxuryButton
                  type="submit"
                  variant="crystal"
                  fullWidth
                  loading={loading}
                  icon={<ArrowRight size={20} />}
                >
                  {loading ? "Creating Account..." : "Create Free Account"}
                </LuxuryButton>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex items-center gap-4 my-6"
            >
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs text-white/30">or sign up with</span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </motion.div>

            {/* Social Signup */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-3 gap-3"
            >
              {[
                { icon: Chrome, color: "#4285f4", name: "Google" },
                { icon: Github, color: "#fff", name: "GitHub" },
                { icon: Fingerprint, color: "#2af598", name: "Biometric" },
              ].map(({ icon: Icon, color, name }) => (
                <motion.button
                  key={name}
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-2xl flex items-center justify-center transition-all"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  type="button"
                >
                  <Icon size={22} style={{ color }} />
                </motion.button>
              ))}
            </motion.div>

            {/* Sign In Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-8 text-center"
            >
              <span className="text-sm text-white/40">Already have an account? </span>
              <Link
                to="/"
                className="text-sm font-semibold text-[#2af598] hover:text-[#12c2e9] transition-colors"
              >
                Sign in
                <motion.span
                  className="inline-block ml-1"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            {/* Security Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-6 flex items-center justify-center gap-2"
            >
              <Shield size={14} className="text-[#2af598]" />
              <span className="text-[10px] text-white/30 tracking-wider">
                SECURED WITH 256-BIT ENCRYPTION
              </span>
            </motion.div>
          </LuxuryGlassCard>
        </div>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 left-0 right-0 text-center"
      >
        <div className="flex items-center justify-center gap-3 text-white/20 text-xs">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Gem size={12} className="text-[#2af598]" />
          </motion.div>
          <span>Smart Expense</span>
          <span className="text-[#2af598]">•</span>
          <span>Made with</span>
          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            💚
          </motion.span>
          <span className="text-[#12c2e9]">•</span>
          <GradientText variant="crystal" className="text-xs">
            ADITYA EDITION
          </GradientText>
        </div>
      </motion.footer>

      {/* Styles */}
      <style>{`
        ::selection {
          background: rgba(42,245,152,0.3);
          color: white;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(10,5,32,1) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </div>
  );
}