// src/components/ui/FloatingOrbs.jsx
import { motion } from 'framer-motion';

const FloatingOrbs = () => {
  const orbs = [
    {
      size: 600,
      color: 'rgba(139, 92, 246, 0.3)',
      position: { top: '-200px', right: '-200px' },
      duration: 25,
    },
    {
      size: 500,
      color: 'rgba(251, 191, 36, 0.25)',
      position: { bottom: '-150px', left: '-150px' },
      duration: 20,
    },
    {
      size: 400,
      color: 'rgba(34, 211, 238, 0.2)',
      position: { top: '40%', left: '60%' },
      duration: 30,
    },
    {
      size: 350,
      color: 'rgba(244, 63, 94, 0.15)',
      position: { top: '60%', right: '20%' },
      duration: 22,
    },
    {
      size: 300,
      color: 'rgba(16, 185, 129, 0.2)',
      position: { top: '20%', left: '10%' },
      duration: 28,
    },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {orbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(80px)',
            ...orb.position,
          }}
          animate={{
            x: [0, 30, -20, 40, 0],
            y: [0, -40, 20, -30, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;