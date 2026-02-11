"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthFlow from "./AuthFlow";

export default function Auth({ onLoginSuccess }) {
  const [isEntryStarted, setIsEntryStarted] = useState(false);

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col items-center justify-center p-6 selection:bg-brand-gold/30 font-sans overflow-hidden relative">
      
      {/* 1. ATMOSPHERE: GLOBAL VECTOR FIELD */}
      <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.03),transparent_60%)]" />

      <AnimatePresence mode="wait">
        {!isEntryStarted ? (
          <motion.div
            key="gate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(20px)", transition: { duration: 0.8, ease: "circIn" } }}
            className="relative z-10 w-full max-w-7xl flex flex-col items-center"
          >
            
            {/* 2. THE TITAN HEADER */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="text-center mb-16 relative"
            >
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[1px] h-20 bg-gradient-to-b from-transparent to-brand-gold/50" />
              
              <h1 className="text-6xl md:text-9xl font-light tracking-tighter uppercase leading-[0.8] text-white">
                Prime<span className="text-white/10">Stake</span>
                <br />
                <span className="text-brand-gold">Corp</span>
              </h1>
              
              <div className="mt-6 flex items-center justify-center gap-6">
                <div className="h-[1px] w-12 bg-white/10" />
                <p className="font-mono text-[9px] md:text-[11px] text-slate-500 uppercase tracking-[0.6em] font-bold">
                  Sovereign Yield Desk &middot; Node_01
                </p>
                <div className="h-[1px] w-12 bg-white/10" />
              </div>
            </motion.div>

            {/* 3. THE LIVE TELEMETRY STRIP (Your Requested Data) */}
            <motion.div 
              initial={{ scaleX: 0.8, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 border-y border-white/10 bg-white/[0.01] backdrop-blur-sm mb-20"
            >
              {/* Metric 01 */}
              <div className="p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 group hover:bg-white/[0.02] transition-colors">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600 mb-2 group-hover:text-brand-gold transition-colors">Target_Yields_APY</p>
                <p className="text-3xl md:text-4xl font-light text-white tracking-tighter tabular-nums">
                  13% <span className="text-white/20 mx-1">—</span> 3200%
                </p>
              </div>

              {/* Metric 02 */}
              <div className="p-6 md:p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 group hover:bg-white/[0.02] transition-colors">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600 mb-2 group-hover:text-[#00E5FF] transition-colors">Global_Settlement</p>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-pulse" />
                   <p className="text-3xl md:text-4xl font-light text-white tracking-tighter">T+0 <span className="text-base text-white/30 align-top">Instant</span></p>
                </div>
              </div>

              {/* Metric 03 */}
              <div className="p-6 md:p-8 flex flex-col items-center justify-center group hover:bg-white/[0.02] transition-colors">
                <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600 mb-2 group-hover:text-brand-gold transition-colors">Desk_Availability</p>
                <p className="text-3xl md:text-4xl font-light text-white tracking-tighter">
                  24 <span className="text-brand-gold">/</span> 7 <span className="text-white/20 text-sm tracking-widest uppercase ml-1">Live</span>
                </p>
              </div>
            </motion.div>

            {/* 4. THE SUPERIOR INITIALIZE BUTTON */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={() => setIsEntryStarted(true)}
            >
              <div className="absolute -inset-1 bg-brand-gold/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <button className="relative px-12 md:px-20 py-6 md:py-8 bg-[#0A0A0A] border-[0.5px] border-white/20 text-white flex flex-col items-center gap-2 overflow-hidden transition-all group-hover:border-brand-gold/50">
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[loading-scan_1.5s_ease-in-out_infinite]" />
                
                <span className="text-sm md:text-lg font-bold uppercase tracking-[0.4em] z-10 group-hover:text-brand-gold transition-colors">
                  Initialize Terminal
                </span>
                <div className="flex items-center gap-3 opacity-50 z-10">
                   <div className="h-[1px] w-6 bg-white/30" />
                   <span className="font-mono text-[8px] uppercase tracking-widest">Encrypted Uplink</span>
                   <div className="h-[1px] w-6 bg-white/30" />
                </div>
                
                {/* Tech Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 group-hover:border-brand-gold transition-colors" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 group-hover:border-brand-gold transition-colors" />
              </button>
            </motion.div>

            {/* Footer Metadata */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5 }}
              className="absolute bottom-[-15vh] flex gap-8 font-mono text-[9px] text-slate-800 uppercase tracking-[0.3em]"
            >
               <span>Restricted_Access</span>
               <span>//</span>
               <span>Institutional_Only</span>
            </motion.div>

          </motion.div>
        ) : (
          /* THE AUTH FLOW CONTAINER (Slides up) */
          <motion.div
            key="flow"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="w-full flex justify-center z-20"
          >
            <AuthFlow onCompleteVerify={onLoginSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}