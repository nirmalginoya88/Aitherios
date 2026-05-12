import { motion, HTMLMotionProps } from 'framer-motion';
import { glowButton } from '@/lib/motion-variants';
import React from 'react';

type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-crimson-500 text-white border border-crimson-500 hover:bg-crimson-600 font-semibold',
  ghost:
    'bg-transparent text-white border border-transparent hover:border-white/10 hover:bg-white/5',
  outline:
    'bg-transparent text-white border border-white/20 hover:border-crimson-500 hover:text-crimson-500',
  danger:
    'bg-transparent text-crimson-500 border border-crimson-500 hover:bg-crimson-500 hover:text-white',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md',
  md: 'px-5 py-2.5 text-sm rounded-lg',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      variants={glowButton}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        relative inline-flex items-center justify-center gap-2
        font-display tracking-wide transition-colors duration-200
        disabled:opacity-40 disabled:cursor-not-allowed
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </span>
      )}
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
    </motion.button>
  );
}
