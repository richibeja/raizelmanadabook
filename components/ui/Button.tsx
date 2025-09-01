'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variants = {
      primary: "bg-[#0F6FF6] text-white hover:bg-[#0C5CD9] focus:ring-[#0F6FF6] shadow-md hover:shadow-lg hover:-translate-y-0.5",
      secondary: "bg-[#FF7A59] text-white hover:bg-[#E65F40] focus:ring-[#FF7A59] shadow-md hover:shadow-lg hover:-translate-y-0.5",
      outline: "bg-transparent border-2 border-[#0F6FF6] text-[#0F6FF6] hover:bg-[#0F6FF6] hover:text-white focus:ring-[#0F6FF6]",
      ghost: "bg-transparent text-[#0F6FF6] hover:bg-[#E6F0FF] focus:ring-[#0F6FF6]",
      danger: "bg-[#EF4444] text-white hover:bg-[#DC2626] focus:ring-[#EF4444] shadow-md hover:shadow-lg hover:-translate-y-0.5"
    };

    const sizes = {
      sm: "px-3 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || loading}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {loading && (
          <motion.div
            className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {icon && !loading && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
