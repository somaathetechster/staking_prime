"use client";

import { motion } from "framer-motion";

export default function StatCard({ label, value, sub, trend }) {
  // Convert label to technical node ID format
  const nodeId = label.replace(/\s+/g, '_').toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative group bg-brand-black p-8 rounded-none border-[0.5px] border-tech-900 overflow-hidden"
    >
      {/* 1. Tactical Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.04] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* 2. Active Logic Scanner (Surgical Glow) */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-signal-cyan/40 to-transparent -translate-x-full group-hover:animate-[loading-scan_3s_linear_infinite] z-20" />

      {/* 3. Machined Steel Brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-tech-700 z-10" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-tech-700 z-10" />

      <div className="relative z-10 flex flex-col justify-between h-full">
        <header className="flex items-start justify-between mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 bg-brand-gold animate-pulse" />
              <p className="font-mono-data text-[9px] text-tech-700 uppercase tracking-[0.5em]">
                METRIC_NODE // {nodeId}
              </p>
            </div>
            {/* The "Brutalist" divider */}
            <div className="h-[1px] w-6 bg-tech-800 group-hover:w-full group-hover:bg-brand-gold transition-all duration-700 ease-in-out" />
          </div>
          
          {trend && (
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1.5 px-2 py-0.5 border border-signal-cyan/20 bg-signal-cyan/5">
                <span className="font-mono-data text-[9px] text-signal-cyan">{trend}</span>
                <svg className="w-2 h-2 text-signal-cyan" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7z" className="group-hover:animate-bounce" />
                </svg>
              </div>
              <span className="font-mono-data text-[7px] text-tech-800 uppercase tracking-widest">DELTA_FLUX</span>
            </div>
          )}
        </header>
        
        <div className="space-y-4">
          {/* Superior Typography: Razor sharp 5xl heading */}
          <h3 className="text-5xl font-bold tracking-tighter text-white tabular leading-[1.1]">
            {value}
          </h3>
          
          <div className="flex items-center gap-4">
            <p className="font-mono-data text-[9px] text-tech-600 uppercase tracking-[0.3em]">
              {sub || "SECURED_ASSET_STREAM"}
            </p>
            <div className="h-[1px] flex-1 bg-tech-900 relative overflow-hidden">
               <motion.div 
                 initial={{ x: "-100%" }}
                 animate={{ x: "0%" }}
                 transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
                 className="absolute inset-0 bg-tech-700/50"
               />
            </div>
          </div>
        </div>

        {/* 4. Terminal Metadata Footer */}
        <footer className="mt-12 flex items-center justify-between font-mono-data text-[7px] text-tech-800 uppercase tracking-[0.4em] border-t border-tech-900/50 pt-4 opacity-40 group-hover:opacity-100 transition-opacity">
           <div className="flex gap-6">
             <span className="text-white/20">NODE_V4.2</span>
             <span>ENCRYPTED_SIG</span>
           </div>
           <span className="text-brand-gold/50 group-hover:text-brand-gold transition-colors underline underline-offset-4">VERIFIED_PRINCIPAL</span>
        </footer>
      </div>

      {/* 5. Passive Light Leak */}
      <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-signal-cyan/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
    </motion.div>
  );
}