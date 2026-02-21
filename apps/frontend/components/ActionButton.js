"use client";

import { motion } from "framer-motion";

/**
 * INSTITUTIONAL COMMAND TRIGGER
 * Features: Machined edges, scanline physics, and haptic scaling.
 * Upgraded for Mobile: Touch-safe tracking, persistent indicators, and disabled states.
 */
export default function ActionButton({ 
  label, 
  onClick, 
  variant = "primary", // primary | secondary | danger
  className = "",
  disabled = false,
  type = "button"
}) {
  
  // Define variant-specific architectural styles
  const variants = {
    primary: "bg-white text-black border-transparent hover:bg-signal-cyan hover:text-black active:bg-gray-300",
    secondary: "bg-transparent text-white border-tech-800 hover:border-white active:bg-white/5",
    danger: "bg-transparent text-signal-crimson border-signal-crimson/30 hover:bg-signal-crimson hover:text-white active:bg-signal-crimson/80"
  };

  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group overflow-hidden border px-6 sm:px-8 py-4 
        transition-all duration-300 ease-out flex items-center justify-center gap-2 sm:gap-3
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale-[0.5]' : ''}
        ${className}
      `}
    >
      {/* 1. Technical Scanline (Only visible on hover/desktop) */}
      {!disabled && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[loading-scan_1.5s_infinite] pointer-events-none hidden sm:block" />
      )}

      {/* 2. Visual "Bit" Indicators */}
      <div className="flex gap-1 items-center opacity-70 sm:opacity-40 sm:group-hover:opacity-100 transition-opacity shrink-0">
        <div className="h-1 w-1 bg-current" />
        <div className="h-[1px] w-2 bg-current" />
      </div>

      {/* 3. Label: High-Precision Typography */}
      <span className="font-mono-data text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] relative z-10 truncate">
        {label.replace(/\s+/g, '_')}
      </span>

      {/* 4. Trailing Bracket Indicator */}
      <span className="font-mono-data text-[8px] opacity-50 sm:opacity-20 sm:group-hover:translate-x-1 transition-transform shrink-0">
        {variant === "danger" ? "!!_TERM" : ">>_EXEC"}
      </span>
    </motion.button>
  );
}