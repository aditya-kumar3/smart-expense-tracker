// src/components/ui/PremiumCard.jsx
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const PremiumCard = ({ 
  children, 
  className = '', 
  variant = 'default',
  glowColor = 'gold',
  hover3D = true,
  ...props 
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const glowColors = {
    gold: 'rgba(251, 191, 36, 0.4)',
    emerald: 'rgba(16, 185, 129, 0.4)',
    rose: 'rgba(244, 63, 94, 0.4)',
    purple: 'rgba(139, 92, 246, 0.4)',
    cyan: 'rgba(34, 211, 238, 0.4)',
  };

  const handleMouseMove = (e) => {
    if (!hover3D || !cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -8;
    const rotateYValue = (mouseX / (rect.width / 2)) * 8;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  const variants = {
    default: 'bg-white/[0.03] border-white/10',
    gold: 'bg-gradient-to-br from-amber-500/15 via-amber-400/10 to-transparent border-amber-500/20',
    glass: 'bg-white/[0.05] border-white/[0.08] backdrop-blur-xl',
    dark: 'bg-black/40 border-white/5',
  };

  return (
    <motion.div
      ref={cardRef}
      className={`
        relative overflow-hidden rounded-3xl border
        backdrop-blur-xl
        shadow-[0_8px_32px_rgba(0,0,0,0.4)]
        transition-shadow duration-500
        ${variants[variant] || variants.default}
        ${className}
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Animated Gradient Border */}
      <motion.div
        className="absolute inset-[-2px] rounded-[26px] z-[-1]"
        style={{
          background: `linear-gradient(135deg, ${glowColors[glowColor]}, transparent, ${glowColors[glowColor]})`,
          backgroundSize: '200% 200%',
          filter: 'blur(20px)',
        }}
        animate={{
          backgroundPosition: isHovered ? ['0% 0%', '100% 100%'] : '0% 0%',
          opacity: isHovered ? 0.8 : 0,
        }}
        transition={{ duration: 2, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Shine Effect */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 55%, transparent 60%)',
        }}
        initial={{ x: '-100%' }}
        animate={{ x: isHovered ? '100%' : '-100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Top Gradient Glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(251,191,36,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-[5]" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
};

export default PremiumCard;