// src/components/ui/GlowButton.jsx
import { motion } from 'framer-motion';

const GlowButton = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  className = '',
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  ...props 
}) => {
  const variants = {
    primary: {
      bg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
      text: '#030014',
      glow: 'rgba(251, 191, 36, 0.5)',
      border: 'transparent',
    },
    secondary: {
      bg: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      text: '#fbbf24',
      glow: 'rgba(251, 191, 36, 0.3)',
      border: 'rgba(251, 191, 36, 0.3)',
    },
    ghost: {
      bg: 'transparent',
      text: '#f1f5f9',
      glow: 'rgba(255, 255, 255, 0.2)',
      border: 'rgba(255, 255, 255, 0.1)',
    },
    danger: {
      bg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
      text: '#ffffff',
      glow: 'rgba(244, 63, 94, 0.5)',
      border: 'transparent',
    },
    success: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      text: '#ffffff',
      glow: 'rgba(16, 185, 129, 0.5)',
      border: 'transparent',
    },
  };

  const sizes = {
    small: 'px-4 py-2 text-xs',
    default: 'px-6 py-3 text-sm',
    large: 'px-8 py-4 text-base',
  };

  const style = variants[variant] || variants.primary;

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        ${sizes[size]}
        ${className}
      `}
      style={{
        background: style.bg,
        color: style.text,
        border: `1px solid ${style.border}`,
        boxShadow: `0 4px 15px ${style.glow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
      }}
      whileHover={{ 
        scale: disabled ? 1 : 1.03,
        y: disabled ? 0 : -2,
        boxShadow: disabled ? undefined : `0 8px 30px ${style.glow}, 0 0 50px ${style.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      {...props}
    >
      {/* Shine Animation */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.5 }}
      />

      {/* Loading Spinner */}
      {loading && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-inherit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}

      {/* Content */}
      <span className={`relative z-10 flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
        {Icon && iconPosition === 'left' && <Icon size={18} />}
        {children}
        {Icon && iconPosition === 'right' && <Icon size={18} />}
      </span>
    </motion.button>
  );
};

export default GlowButton;