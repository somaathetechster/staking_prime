"use client";

import { motion } from "framer-motion";

export default function MarketingPage({ onEnter }) {
  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { ease: "circOut", duration: 1 } }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#020202] text-white font-sans selection:bg-brand-gold/30 overflow-x-hidden relative flex flex-col justify-between">
      
      {/* 1. ATMOSPHERE: The Void Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:60px_60px]" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.05),transparent_60%)]" />

      {/* 2. NAVIGATION BAR (The Header) */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020202]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
             <div className="w-8 h-8 sm:w-10 sm:h-10 border border-brand-gold/20 flex items-center justify-center relative flex-shrink-0">
                <div className="absolute inset-0 bg-brand-gold/10 animate-pulse" />
                <div className="w-1 h-1 bg-brand-gold" />
             </div>
             <div>
                <h3 className="font-bold text-base sm:text-lg tracking-tighter uppercase leading-none">Prime<span className="text-white/30">Stake</span></h3>
                <p className="font-mono text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-500">Private_Desk</p>
             </div>
          </div>
          <button 
            onClick={onEnter}
            className="px-4 sm:px-8 py-2 sm:py-3 bg-white text-black text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] hover:bg-brand-gold active:scale-95 transition-all whitespace-nowrap"
          >
            Client_Login
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-20 relative z-10 w-full">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center min-h-[60vh] sm:min-h-[70vh]"
        >
          
          {/* LEFT COLUMN: THE MANIFESTO (Col-Span 7) */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-12 w-full">
            
            <motion.div variants={item} className="relative">
               <div className="absolute -left-4 sm:-left-6 top-2 w-1 h-16 sm:h-20 bg-brand-gold" />
               <p className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-brand-gold font-bold mb-4 sm:mb-6 pl-2">
                 Institutional_Infrastructure <span className="hidden sm:inline">// v4.0</span>
               </p>
               <h1 className="text-5xl sm:text-6xl md:text-8xl font-light tracking-tighter text-white leading-[0.9] uppercase break-words">
                 Sovereign <br />
                 <span className="text-white/20">Capital</span> <br />
                 <span className="text-brand-gold">Deployment.</span>
               </h1>
            </motion.div>

            <motion.p variants={item} className="text-base sm:text-lg md:text-xl text-slate-400 font-light leading-relaxed max-w-2xl border-l border-white/10 pl-6 sm:pl-8">
              Engineered for family offices and high-net-worth principals. 
              We provide <span className="text-white">algorithmic staking infrastructure</span> with 
              institutional-grade settlement times and zero-knowledge privacy.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto">
              <button
                onClick={onEnter}
                className="group w-full sm:w-auto relative px-8 sm:px-12 py-5 sm:py-6 bg-brand-gold text-black text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] overflow-hidden transition-all hover:bg-white active:scale-[0.98]"
              >
                <span className="relative z-10">Initialize_Access</span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block" />
              </button>
              
              <div className="flex w-full sm:w-auto items-center justify-center sm:justify-start gap-3 sm:gap-4 px-6 sm:px-8 py-4 sm:py-4 border border-white/10 bg-white/[0.02]">
                <div className="relative w-2 h-2 shrink-0">
                  <div className="absolute inset-0 bg-[#00E5FF] rounded-full animate-ping opacity-75" />
                  <div className="relative w-2 h-2 bg-[#00E5FF] rounded-full" />
                </div>
                <div className="text-left">
                   <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-widest text-slate-500">System_Status</p>
                   <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-widest text-white whitespace-nowrap">Operational_100%</p>
                </div>
              </div>
            </motion.div>

            {/* LIVE TICKER STRIP */}
            <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 border-t border-white/10 pt-8 sm:pt-10 mt-8 sm:mt-12 gap-6 sm:gap-0">
               <div className="border-b border-white/10 sm:border-b-0 pb-4 sm:pb-0">
                  <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-600 mb-1 sm:mb-2">Target_Yield</p>
                  <p className="text-2xl sm:text-3xl font-light tracking-tighter tabular-nums">13% <span className="text-brand-gold">-</span> 3200%</p>
               </div>
               <div className="border-b border-white/10 sm:border-b-0 sm:border-l sm:border-white/10 sm:pl-8 pb-4 sm:pb-0">
                  <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-600 mb-1 sm:mb-2">Settlement</p>
                  <p className="text-2xl sm:text-3xl font-light tracking-tighter text-[#00E5FF]">T+0 <span className="text-xs sm:text-sm align-top text-white/40 ml-1">Instant</span></p>
               </div>
               <div className="sm:border-l sm:border-white/10 sm:pl-8">
                  <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-slate-600 mb-1 sm:mb-2">Liquidity</p>
                  <p className="text-2xl sm:text-3xl font-light tracking-tighter">24/7 <span className="text-xs sm:text-sm align-top text-brand-gold ml-1">Desk</span></p>
               </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: THE DECONSTRUCTED INTERFACE (Hidden on small screens) */}
          <div className="lg:col-span-5 relative hidden lg:block">
             <motion.div 
               variants={item}
               className="relative z-10"
             >
                {/* Visual Anchor Lines */}
                <div className="absolute -top-20 left-10 w-[1px] h-40 bg-gradient-to-b from-transparent to-brand-gold" />
                <div className="absolute -right-10 bottom-20 w-40 h-[1px] bg-gradient-to-l from-transparent to-[#00E5FF]" />

                {/* The "Floating" Terminal Card */}
                <div className="bg-[#050505] border border-white/10 p-1 relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
                   <div className="bg-[#0A0A0A] p-4 flex justify-between items-center border-b border-white/10">
                      <div className="flex gap-2">
                         <div className="w-2 h-2 rounded-full bg-red-500/20" />
                         <div className="w-2 h-2 rounded-full bg-brand-gold/20" />
                         <div className="w-2 h-2 rounded-full bg-[#00E5FF]/20" />
                      </div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600">Restricted_View</p>
                   </div>

                   <div className="p-8 space-y-8 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-5">
                      <div className="space-y-2">
                         <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-brand-gold">Asset_Projection</p>
                         <h3 className="text-5xl font-light tracking-tighter text-white tabular-nums">$2,840,000.<span className="text-white/30 text-3xl">00</span></h3>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                         <div className="bg-black/40 border border-white/5 p-6 hover:border-brand-gold/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                               <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">Active_Line_01</p>
                               <span className="text-[#00E5FF] text-[9px] border border-[#00E5FF]/20 px-1">ACTIVE</span>
                            </div>
                            <p className="text-2xl font-light tracking-tighter text-white tabular-nums">150.00%</p>
                         </div>
                         
                         <div className="bg-black/40 border border-white/5 p-6 hover:border-brand-gold/50 transition-colors group">
                            <div className="flex justify-between items-start mb-4">
                               <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500 group-hover:text-white transition-colors">Active_Line_02</p>
                               <span className="text-brand-gold text-[9px] border border-brand-gold/20 px-1">PENDING</span>
                            </div>
                            <p className="text-2xl font-light tracking-tighter text-white tabular-nums">3200.00%</p>
                         </div>
                      </div>

                      <div className="pt-4 border-t border-white/5">
                         <p className="font-mono text-[8px] text-center uppercase tracking-widest text-slate-700">
                           ** Authorized Personnel Only **
                         </p>
                      </div>
                   </div>
                </div>

                <div className="absolute -z-10 top-10 -right-10 w-full h-full border border-white/5 bg-[#080808]" />
             </motion.div>
          </div>

        </motion.div>
      </div>

      {/* 3. FOOTER: Technical Specs */}
      <footer className="border-t border-white/5 bg-[#020202] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-6">
           <div className="text-center md:text-left space-y-1.5 sm:space-y-2">
              <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-white">Primestakecorp_Intl</p>
              <p className="font-mono text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-600">Reg_No: 8829-X-2026</p>
           </div>
           
           <div className="flex flex-wrap justify-center md:justify-end gap-6 sm:gap-12 font-mono text-[7px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-slate-500">
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Privacy_Protocol</span>
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Service_Terms</span>
              <span className="hover:text-brand-gold cursor-pointer transition-colors">Node_Status</span>
           </div>
        </div>
      </footer>
    </div>
  );
}