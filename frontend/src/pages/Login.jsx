// src/pages/Login.jsx
import { useState, useMemo, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Wallet,
  Eye,
  EyeOff,
  Shield,
  Zap,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Gift,
} from "lucide-react";
import BASE_URL from "../services/config";

// ═══════════════════════════════════════════════════════════════════════════════
// 🎨 OPTIMIZED BACKGROUND
// ═══════════════════════════════════════════════════════════════════════════════
const OptimizedBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse at 0% 0%, rgba(102, 126, 234, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 100%, rgba(240, 147, 251, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 100% 0%, rgba(42, 245, 152, 0.06) 0%, transparent 50%),
          linear-gradient(180deg, #030014 0%, #0a0520 50%, #050210 100%)
        `,
      }}
    />
    <div className="aurora-glow" />
    <div
      className="absolute inset-0 opacity-[0.015]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 SIMPLE WALLET ICON
// ═══════════════════════════════════════════════════════════════════════════════
const SimpleWallet = () => (
  <div className="wallet-container">
    <div className="wallet-icon">
      <Wallet size={36} className="text-white" />
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ✨ GRADIENT TEXT
// ═══════════════════════════════════════════════════════════════════════════════
const GradientText = ({ children, className = "" }) => (
  <span className={`gradient-text ${className}`}>{children}</span>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 💎 GLASS CARD
// ═══════════════════════════════════════════════════════════════════════════════
const GlassCard = ({ children, className = "" }) => (
  <div className={`glass-card fade-in-up ${className}`}>
    <div className="card-highlight" />
    {children}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 📝 SIMPLE INPUT
// ═══════════════════════════════════════════════════════════════════════════════
const SimpleInput = ({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  required = false,
  icon: Icon,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType = showPasswordToggle
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="input-wrapper">
      {Icon && (
        <div className={`input-icon ${isFocused ? "focused" : ""}`}>
          <Icon size={18} />
        </div>
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
        className={`custom-input ${Icon ? "has-icon" : ""} ${
          showPasswordToggle ? "has-toggle" : ""
        } ${isFocused ? "focused" : ""}`}
        autoComplete={type === "password" ? "current-password" : "email"}
      />

      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// 🎯 SUBMIT BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
const SubmitButton = ({ loading, children }) => (
  <button type="submit" disabled={loading} className="submit-btn">
    <div className="btn-shine" />
    {loading ? (
      <div className="spinner" />
    ) : (
      <>
        <span>{children}</span>
        <ArrowRight size={20} />
      </>
    )}
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 BENEFIT ITEM
// ═══════════════════════════════════════════════════════════════════════════════
const BenefitItem = ({ icon: Icon, title, description, color }) => (
  <div className="benefit-item">
    <div className="benefit-icon" style={{ background: `${color}15` }}>
      <Icon size={20} style={{ color }} />
    </div>
    <div>
      <p className="benefit-title">{title}</p>
      <p className="benefit-desc">{description}</p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 📊 STAT CARD
// ═══════════════════════════════════════════════════════════════════════════════
const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className="stat-card">
    <div className="stat-glow" style={{ background: `${color}20` }} />
    <div className="stat-content">
      <div className="stat-header">
        <Icon size={14} style={{ color }} />
        <span className="stat-label">{label}</span>
      </div>
      <p className="stat-value" style={{ color }}>
        {value}
      </p>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// 🏠 MAIN LOGIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setError("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setServerWaking(false);

    const wakingTimeout = setTimeout(() => {
      setServerWaking(true);
    }, 3000);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(wakingTimeout);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("authToken", data.token || "");
      localStorage.setItem("user", JSON.stringify(data.user || {}));

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 1500);
    } catch (err) {
      clearTimeout(wakingTimeout);
      if (err.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
      setServerWaking(false);
    }
  };

  return (
    <div className="login-page">
      <OptimizedBackground />

      {/* Success Modal */}
      {success && (
        <div className="success-modal">
          <div className="success-content scale-in">
            <div className="success-icon">
              <CheckCircle2 size={40} className="text-white" />
            </div>
            <GradientText className="text-2xl font-bold">
              Welcome Back!
            </GradientText>
            <p className="text-white/60 mt-2 text-sm">
              Redirecting to dashboard...
            </p>
          </div>
        </div>
      )}

      <div className="login-container">
        <div className="login-grid">
          {/* LEFT: HERO (Desktop only) */}
          <div className="hero-section fade-in-left">
            <div className="hero-wallet">
              <SimpleWallet />
            </div>

            <div className="hero-text">
              <GradientText className="text-3xl xl:text-4xl font-bold">
                SMART EXPENSE
              </GradientText>
              <p className="text-white/50 mt-2">
                Your personal finance companion
              </p>
            </div>

            {/* Live Stats */}
            <div className="stats-grid">
              <StatCard
                label="This Month"
                value="₹ 12,480"
                color="#ff6b9d"
                icon={TrendingUp}
              />
              <StatCard
                label="Saved"
                value="₹ 7,520"
                color="#2af598"
                icon={Target}
              />
            </div>

            <div className="benefits-list">
              <BenefitItem
                icon={Gift}
                title="100% Free Forever"
                description="No hidden charges"
                color="#2af598"
              />
              <BenefitItem
                icon={Shield}
                title="Bank-Level Security"
                description="Your data is encrypted"
                color="#667eea"
              />
              <BenefitItem
                icon={Zap}
                title="AI-Powered Insights"
                description="Smart suggestions to save more"
                color="#f093fb"
              />
            </div>
          </div>

          {/* RIGHT: LOGIN FORM */}
          <GlassCard className="form-card">
            {/* Mobile Logo */}
            <div className="mobile-logo">
              <SimpleWallet />
            </div>

            {/* Header */}
            <div className="form-header">
              <span className="badge">
                <span>✨</span>
                Welcome Back
              </span>

              <h1 className="form-title">
                <GradientText>Sign In</GradientText>
              </h1>

              <p className="form-subtitle">
                Continue to your premium dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">
                  <Mail size={12} className="text-indigo-400" />
                  Email Address
                </label>
                <SimpleInput
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  icon={Mail}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={12} className="text-pink-400" />
                  Password
                </label>
                <SimpleInput
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  icon={Lock}
                  showPasswordToggle
                />
              </div>

              {/* Forgot Password */}
              <div className="forgot-password">
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              {/* Error */}
              {error && (
                <div className="error-box fade-in">
                  <AlertCircle size={16} className="error-icon" />
                  <span>{error}</span>
                </div>
              )}

              {/* Server Waking Message */}
              {loading && serverWaking && (
                <div className="waking-box fade-in">
                  <div className="waking-spinner" />
                  <div>
                    <p className="waking-title">Server is waking up...</p>
                    <p className="waking-desc">
                      Free server sleeps after inactivity. Please wait 20-40
                      seconds.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <SubmitButton loading={loading}>
                {loading ? "Signing In..." : "Continue to Dashboard"}
              </SubmitButton>
            </form>

            {/* Sign Up Link */}
            <div className="signup-link">
              <span>New to Smart Expense? </span>
              <Link to="/signup" className="link">
                Create an account →
              </Link>
            </div>

            {/* Security Badge */}
            <div className="security-badge">
              <Shield size={12} className="text-emerald-400" />
              <span>SECURED WITH 256-BIT ENCRYPTION</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* CSS */}
      <style>{`
        /* ========== BASE ========== */
        .login-page {
          position: relative;
          min-height: 100vh;
          min-height: 100dvh;
          overflow-x: hidden;
        }

        .login-container {
          position: relative;
          z-index: 10;
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .login-grid {
          width: 100%;
          max-width: 72rem;
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .login-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* ========== ANIMATIONS ========== */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.4);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(102, 126, 234, 0);
          }
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }

        @keyframes aurora {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }

        .fade-in-left {
          animation: fadeInLeft 0.4s ease-out forwards;
        }

        .fade-in {
          animation: fadeInUp 0.3s ease-out forwards;
        }

        .scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        /* ========== AURORA GLOW ========== */
        .aurora-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 30% 20%, rgba(102, 126, 234, 0.06) 0%, transparent 50%);
          animation: aurora 10s ease-in-out infinite;
        }

        @media (max-width: 640px) {
          .aurora-glow {
            animation: none;
            opacity: 0.5;
          }
        }

        /* ========== GRADIENT TEXT ========== */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* ========== WALLET ========== */
        .wallet-container {
          position: relative;
        }

        .wallet-icon {
          position: relative;
          width: 5rem;
          height: 5rem;
          border-radius: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          box-shadow: 0 20px 40px -10px rgba(102, 126, 234, 0.4);
          animation: pulse 2s ease-out infinite;
        }

        @media (min-width: 640px) {
          .wallet-icon {
            width: 6rem;
            height: 6rem;
          }
        }

        /* ========== GLASS CARD ========== */
        .glass-card {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.4);
        }

        @media (min-width: 640px) {
          .glass-card {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }
        }

        .card-highlight {
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        }

        .form-card {
          padding: 1.5rem;
        }

        @media (min-width: 640px) {
          .form-card {
            padding: 2rem;
          }
        }

        /* ========== HERO SECTION ========== */
        .hero-section {
          display: none;
          flex-direction: column;
          gap: 1.5rem;
        }

        @media (min-width: 1024px) {
          .hero-section {
            display: flex;
          }
        }

        .hero-wallet {
          display: flex;
          justify-content: center;
        }

        .hero-text {
          text-align: center;
        }

        /* ========== STATS ========== */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-card {
          position: relative;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          overflow: hidden;
        }

        .stat-glow {
          position: absolute;
          inset: 0;
          opacity: 0.5;
        }

        .stat-content {
          position: relative;
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.625rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.5);
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
        }

        /* ========== BENEFITS ========== */
        .benefits-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .benefit-icon {
          padding: 0.5rem;
          border-radius: 0.75rem;
        }

        .benefit-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
        }

        .benefit-desc {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ========== MOBILE LOGO ========== */
        .mobile-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 1024px) {
          .mobile-logo {
            display: none;
          }
        }

        /* ========== FORM HEADER ========== */
        .form-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.625rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          background: rgba(102, 126, 234, 0.15);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
          margin-bottom: 0.75rem;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 0.5rem;
        }

        @media (min-width: 640px) {
          .form-title {
            font-size: 1.875rem;
          }
        }

        .form-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.5);
        }

        /* ========== FORM ========== */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
          margin-left: 0.25rem;
        }

        /* ========== INPUT ========== */
        .input-wrapper {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.2s ease;
        }

        .input-icon.focused {
          color: #667eea;
        }

        .custom-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 2px solid rgba(255, 255, 255, 0.08);
          color: white;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .custom-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }

        .custom-input.has-icon {
          padding-left: 3rem;
        }

        .custom-input.has-toggle {
          padding-right: 3rem;
        }

        .custom-input.focused {
          border-color: #667eea;
          box-shadow: 0 0 20px rgba(102, 126, 234, 0.15);
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          padding: 0.25rem;
          border-radius: 0.5rem;
          color: rgba(255, 255, 255, 0.4);
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .password-toggle:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        /* ========== FORGOT PASSWORD ========== */
        .forgot-password {
          text-align: right;
        }

        .forgot-link {
          font-size: 0.75rem;
          color: #667eea;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: #f093fb;
        }

        /* ========== ERROR BOX ========== */
        .error-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(255, 65, 108, 0.1);
          border: 1px solid rgba(255, 65, 108, 0.3);
        }

        .error-icon {
          color: #ff416c;
          flex-shrink: 0;
        }

        .error-box span {
          font-size: 0.75rem;
          color: #ff6b9d;
        }

        /* ========== WAKING BOX ========== */
        .waking-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          background: rgba(245, 175, 25, 0.1);
          border: 1px solid rgba(245, 175, 25, 0.3);
        }

        .waking-spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(245, 175, 25, 0.3);
          border-top-color: #f5af19;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          flex-shrink: 0;
        }

        .waking-title {
          font-size: 0.75rem;
          font-weight: 600;
          color: #f5af19;
        }

        .waking-desc {
          font-size: 0.625rem;
          color: rgba(245, 175, 25, 0.7);
        }

        /* ========== SUBMIT BUTTON ========== */
        .submit-btn {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 0.875rem 2rem;
          border-radius: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          color: white;
          font-weight: 700;
          font-size: 0.875rem;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 10px 30px -10px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s ease, opacity 0.2s ease;
          margin-top: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%);
          animation: shine 3s ease-in-out infinite;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        /* ========== SIGNUP LINK ========== */
        .signup-link {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .signup-link .link {
          font-weight: 600;
          color: #667eea;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .signup-link .link:hover {
          color: #f093fb;
        }

        /* ========== SECURITY BADGE ========== */
        .security-badge {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .security-badge span {
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.05em;
        }

        /* ========== SUCCESS MODAL ========== */
        .success-modal {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        }

        .success-content {
          text-align: center;
          padding: 2rem;
        }

        .success-icon {
          width: 5rem;
          height: 5rem;
          margin: 0 auto 1rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #f093fb);
          box-shadow: 0 0 40px rgba(102, 126, 234, 0.5);
        }

        /* ========== AUTOFILL FIX ========== */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px rgba(10, 5, 32, 1) inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        ::selection {
          background: rgba(102, 126, 234, 0.3);
          color: white;
        }

        /* ========== REDUCED MOTION ========== */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}