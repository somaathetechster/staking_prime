"use client";

import { motion } from "framer-motion";

export default function LogoTower() {
  return (
    <div className="flex items-center gap-5 group cursor-default select-none">
      {/* 1. THE ARCHITECTURAL ICON CONTAINER */}
      <div className="relative h-12 w-12 bg-[#050505] border border-white/10 flex items-end justify-center pb-3 overflow-hidden transition-colors duration-500 group-hover:border-brand-gold/50">
        
        {/* Active Scanline (Holographic Effect) */}
        <div className="absolute inset-0 z-20 bg-gradient-to-b from-transparent via-brand-gold/20 to-transparent -translate-y-[150%] group-hover:translate-y-[150%] transition-transform duration-1000 ease-in-out" />

        {/* Technical Grid Background inside Logo */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4px_4px]" />

        {/* 2. THE SIGNAL PILLARS (Replaces Rounded Bars) */}
        <div className="flex gap-[2px] items-end z-10 relative">
          {/* Pillar 1: Static Foundation */}
          <motion.div 
            className="w-[6px] bg-white/20"
            animate={{ height: ["40%", "40%"] }} 
            whileHover={{ height: "30%" }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Pillar 2: Active Mid-Range */}
          <motion.div 
            className="w-[6px] bg-brand-gold/60"
            animate={{ height: ["65%", "65%"] }}
            whileHover={{ height: "85%" }}
            transition={{ duration: 0.2, delay: 0.05 }}
          />
          
          {/* Pillar 3: High-Frequency Alpha */}
          <motion.div 
            className="w-[6px] bg-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]"
            animate={{ height: ["90%", "90%"] }}
            whileHover={{ height: "100%", backgroundColor: "#fff" }}
            transition={{ duration: 0.2, delay: 0.1 }}
          />
        </div>

        {/* 3. TECHNICAL CORNER BRACKETS */}
        <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white/40 group-hover:border-brand-gold transition-colors" />
        <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white/40 group-hover:border-brand-gold transition-colors" />
      </div>

      {/* 4. TYPOGRAPHY: THE TITAN STACK */}
      <div className="flex flex-col justify-center">
        <h1 className="text-xl font-bold tracking-tighter uppercase leading-none text-white transition-colors duration-300">
          Prime<span className="text-white/30 group-hover:text-brand-gold transition-colors">Stake</span>
        </h1>
        
        <div className="flex items-center gap-2 mt-1.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: 12 }}
            className="h-[1px] bg-brand-gold/50" 
          />
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">
            Private_Desk
          </p>
        </div>
      </div>
    </div>
  );
}