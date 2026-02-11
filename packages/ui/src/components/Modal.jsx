"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal({ open, title, onClose, children }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 font-sans">
      
      {/* 1. ATMOSPHERIC BACKDROP */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#020202]/90 backdrop-blur-md cursor-pointer"
      />

      {/* 2. THE SYSTEM WINDOW */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ type: "spring", duration: 0.5, bounce: 0 }}
        className="relative w-full max-w-lg bg-[#050505] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* Corner Construction Brackets */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold z-20" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-brand-gold z-20" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-brand-gold z-20" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-brand-gold z-20" />

        {/* 3. THE COMMAND HEADER (HUD Style) */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-3">
             {/* Status Lights */}
             <div className="flex gap-1">
                <div className="w-1 h-1 bg-red-500/50 rounded-full" />
                <div className="w-1 h-1 bg-brand-gold rounded-full" />
                <div className="w-1 h-1 bg-[#00E5FF]/50 rounded-full" />
             </div>
             
             <div className="h-4 w-[1px] bg-white/10" />

             <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500 mb-0.5">System_Dialog</p>
                <h2 className="text-sm font-bold text-white tracking-widest uppercase">
                  {title || "Action_Required"}
                </h2>
             </div>
          </div>

          <button
            onClick={onClose}
            className="group flex items-center gap-2 px-3 py-1 border border-white/10 bg-black hover:bg-white hover:text-black transition-all"
          >
            <span className="font-mono text-[9px] uppercase tracking-widest">[ ESC ]</span>
          </button>
        </div>

        {/* 4. CONTENT AREA */}
        <div className="relative z-10 p-8">
          {children}
        </div>

        {/* Footer / Decorative Status Bar */}
        <div className="relative z-10 px-6 py-2 bg-black border-t border-white/5 flex justify-between items-center">
           <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-slate-700">Secure_Enclave_Active</p>
           <div className="flex gap-1">
              <div className="w-1 h-1 rounded-full bg-brand-gold animate-pulse" />
              <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-brand-gold">Live</p>
           </div>
        </div>

      </motion.div>
    </div>
  );
}