import { motion, HTMLMotionProps } from 'framer-motion';
import React from 'react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  className?: string;
}

export default function GlassCard({
  children,
  hover = false,
  glow = false,
  className = '',
  ...props
}: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`
        glass rounded-2xl
        ${glow ? 'animate-pulse-glow' : ''}
        ${hover ? 'glass-hover cursor-pointer transition-shadow duration-300' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}
