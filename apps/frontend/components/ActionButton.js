"use client";

import { motion } from "framer-motion";

/**
 * INSTITUTIONAL COMMAND TRIGGER
 * Features: Machined edges, scanline physics, and haptic scaling.
 */
export default function ActionButton({ 
  label, 
  onClick, 
  variant = "primary", // primary | secondary | danger
  className = "" 
}) {
  
  // Define variant-specific architectural styles
  const variants = {
    primary: "bg-white text-black border-transparent hover:bg-signal-cyan hover:text-black",
    secondary: "bg-transparent text-white border-tech-800 hover:border-white",
    danger: "bg-transparent text-signal-crimson border-signal-crimson/30 hover:bg-signal-crimson hover:text-white"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative group overflow-hidden border px-8 py-4 
        transition-all duration-300 ease-out flex items-center justify-center gap-3
        ${variants[variant]}
        ${className}
      `}
    >
      {/* 1. Technical Scanline (Only visible on hover) */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[loading-scan_1.5s_infinite] pointer-events-none" />

      {/* 2. Visual "Bit" Indicators */}
      <div className="flex gap-1 items-center opacity-40 group-hover:opacity-100 transition-opacity">
        <div className="h-1 w-1 bg-current" />
        <div className="h-[1px] w-2 bg-current" />
      </div>

      {/* 3. Label: High-Precision Typography */}
      <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.3em] relative z-10">
        {label.replace(/\s+/g, '_')}
      </span>

      {/* 4. Trailing Bracket Indicator */}
      <span className="font-mono-data text-[8px] opacity-20 group-hover:translate-x-1 transition-transform">
        {variant === "danger" ? "!!_TERM" : ">>_EXEC"}
      </span>
    </motion.button>
  );
}