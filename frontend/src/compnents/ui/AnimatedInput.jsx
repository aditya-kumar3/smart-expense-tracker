// src/components/ui/AnimatedInput.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedInput = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required = false,
  error,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative">
      <motion.div
        className={`
          relative flex items-center gap-3
          rounded-2xl border
          transition-all duration-300
          ${isFocused 
            ? 'border-amber-400/50 bg-gradient-to-br from-amber-500/10 to-transparent' 
            : 'border-white/10 bg-white/[0.03]'
          }
          ${error ? 'border-rose-500/50' : ''}
          ${className}
        `}
        animate={{
          boxShadow: isFocused 
            ? '0 0 0 4px rgba(251, 191, 36, 0.1), 0 0 30px rgba(251, 191, 36, 0.15)' 
            : '0 0 0 0 transparent',
        }}
      >
        {/* Icon */}
        {Icon && (
          <motion.div
            className="pl-4"
            animate={{ 
              color: isFocused ? '#fbbf24' : '#64748b',
              scale: isFocused ? 1.1 : 1,
            }}
          >
            <Icon size={18} />
          </motion.div>
        )}

        {/* Input Field */}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full bg-transparent py-4 pr-4 
            ${Icon ? 'pl-2' : 'pl-4'}
            text-sm text-slate-100 
            placeholder:text-slate-500
            outline-none
          `}
          {...props}
        />

        {/* Focus Indicator */}
        <motion.div
          className="absolute bottom-0 left-1/2 h-[2px] bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
          initial={{ width: 0, x: '-50%' }}
          animate={{ 
            width: isFocused ? '90%' : 0,
            x: '-50%',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 text-xs text-rose-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedInput;