// src/components/ui/LoadingSpinner.jsx
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'default', text = 'Loading...' }) => {
  const sizes = {
    small: { spinner: 30, text: 'text-xs' },
    default: { spinner: 50, text: 'text-sm' },
    large: { spinner: 70, text: 'text-base' },
  };

  const s = sizes[size] || sizes.default;

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Multi-layer Spinner */}
      <div className="relative" style={{ width: s.spinner, height: s.spinner }}>
        {/* Outer Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: '#fbbf24',
            borderRightColor: 'rgba(251, 191, 36, 0.3)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle Ring */}
        <motion.div
          className="absolute rounded-full border-2 border-transparent"
          style={{
            inset: '15%',
            borderTopColor: '#8b5cf6',
            borderLeftColor: 'rgba(139, 92, 246, 0.3)',
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* Inner Ring */}
        <motion.div
          className="absolute rounded-full border-2 border-transparent"
          style={{
            inset: '30%',
            borderBottomColor: '#06b6d4',
            borderRightColor: 'rgba(6, 182, 212, 0.3)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center Dot */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-br from-amber-400 to-amber-600"
          style={{ inset: '40%' }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>

      {/* Loading Text */}
      {text && (
        <motion.p
          className={`${s.text} text-slate-400 font-medium`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;