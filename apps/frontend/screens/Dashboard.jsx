//apps/frontend/screens/Dashboard.jsx

"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ProgramCard } from "@primestakecorp/ui"; // StatCard is now integrated into the HUD
import { PROGRAMS } from "../config/programs";

// Precision Financial Formatter
const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(val);

export default function Dashboard({
  walletBalance,
  stakedBalance,
  nextPayout,
  onOpenDeposit,
  onOpenVerify,
  onOpenStake,
  isVerified,
}) {
  const [calcProgram, setCalcProgram] = useState(PROGRAMS.monthly);
  const [calcAmount, setCalcAmount] = useState(1000000);

  const { profit, total } = useMemo(() => {
    const p = calcAmount && calcProgram ? calcAmount * calcProgram.rate : 0;
    return { profit: p, total: calcAmount + p };
  }, [calcAmount, calcProgram]);

  // Motion Variants for Staggered Entry
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: "circOut", duration: 0.8 } }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#020202] text-white font-sans selection:bg-brand-gold/30 overflow-x-hidden relative">
      
      {/* 1. ATMOSPHERE */}
      <div className="fixed inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.03),transparent_50%)]" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 px-6 lg:px-16 py-10 space-y-16"
      >
        
        {/* 2. HUD TELEMETRY STRIP (Replaces standard header) */}
        <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 border-b border-white/10 pb-8 gap-8">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2">Terminal_ID</p>
            <p className="text-sm text-white tracking-widest font-mono">PRM-LGS-092</p>
          </div>
          <div>
             <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2">Auth_Level</p>
             <p className="text-sm text-brand-gold tracking-widest font-mono uppercase">Principal_IV</p>
          </div>
          <div>
             <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2">Desk_Latency</p>
             <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-pulse" />
               <p className="text-sm text-white tracking-widest font-mono">12ms</p>
             </div>
          </div>
          <div className="text-right hidden md:block">
             <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-2">System_Status</p>
             <p className="text-sm text-white tracking-widest font-mono uppercase">Online</p>
          </div>
        </motion.div>

        {/* 3. TITAN BALANCE DISPLAY (Dominant Feature) */}
        <motion.div variants={item} className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-brand-gold" />
            <p className="font-mono text-[9px] uppercase tracking-[0.5em] text-brand-gold font-bold">
              Net_Asset_Value
            </p>
          </div>
          
          <div className="relative group">
            <h1 className="text-7xl md:text-9xl font-light tracking-tighter text-white tabular-nums leading-none">
              {formatCurrency(walletBalance + stakedBalance).split('.')[0]}
              <span className="text-4xl md:text-6xl text-white/20">.{formatCurrency(walletBalance + stakedBalance).split('.')[1]}</span>
            </h1>
            
            {/* Contextual Actions Floating Next to Balance */}
            <div className="mt-8 flex flex-wrap gap-4">
               <button onClick={onOpenDeposit} className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-gold transition-colors">
                 Inbound_Allocation
               </button>
               <button onClick={onOpenVerify} className="px-10 py-4 border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-colors">
                 {isVerified ? "View_Protocol" : "Verify_Identity"}
               </button>
            </div>
          </div>
        </motion.div>

        {/* 4. ASSET & RISK GRID */}
        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 border-y border-white/10">
          {/* Active Staked (Risk Exposure) */}
          <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/10 group hover:bg-white/[0.02] transition-colors">
             <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-4 group-hover:text-brand-gold transition-colors">Risk_Exposure</p>
             <p className="text-4xl font-light tracking-tighter tabular-nums">{formatCurrency(stakedBalance)}</p>
             <p className="text-[9px] uppercase tracking-widest text-slate-600 mt-2">Locked_Liquidity</p>
          </div>

          {/* Pending Payout */}
          <div className="p-10 border-b lg:border-b-0 lg:border-r border-white/10 group hover:bg-white/[0.02] transition-colors">
             <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-4 group-hover:text-[#00E5FF] transition-colors">Pending_Settlement</p>
             <p className="text-4xl font-light tracking-tighter tabular-nums">{nextPayout ? formatCurrency(nextPayout) : "$0.00"}</p>
             <p className="text-[9px] uppercase tracking-widest text-slate-600 mt-2">T+0 Execution</p>
          </div>

          {/* Verification Status */}
          <div className="p-10 group hover:bg-white/[0.02] transition-colors relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <div className={`w-2 h-2 rounded-full ${isVerified ? "bg-[#00E5FF]" : "bg-brand-gold"} animate-pulse`} />
             </div>
             <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 mb-4">Compliance_Node</p>
             <p className={`text-2xl font-mono tracking-widest uppercase ${isVerified ? "text-[#00E5FF]" : "text-brand-gold"}`}>
               {isVerified ? "Verified_Level_4" : "Pending_Review"}
             </p>
             <button onClick={onOpenVerify} className="text-[9px] uppercase tracking-widest text-white/40 mt-2 hover:text-white transition-colors border-b border-transparent hover:border-white">
               [ Access_Logs ]
             </button>
          </div>
        </motion.div>

        {/* 5. PROJECTION ENGINE (The Calculator) */}
        <motion.div variants={item} className="relative group">
           <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/0 via-brand-gold/10 to-brand-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl" />
           
           <div className="relative bg-[#050505] border border-white/10">
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-4 border-b border-white/10 bg-white/[0.02]">
                 <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/60 font-bold">Yield_Projection_Engine</p>
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                    <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                 </div>
              </div>

              {/* Calculator Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                 {/* Inputs */}
                 <div className="p-10 space-y-8">
                    <div className="space-y-4">
                       <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500">Allocation_Notional</label>
                       <input 
                         type="number" 
                         value={calcAmount} 
                         onChange={(e) => setCalcAmount(Number(e.target.value))}
                         className="w-full bg-transparent border-b border-white/10 py-2 font-mono text-2xl text-white focus:border-brand-gold outline-none transition-colors"
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="block font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500">Strategy_Select</label>
                       <select 
                         value={calcProgram.id} 
                         onChange={(e) => setCalcProgram(PROGRAMS[e.target.value])}
                         className="w-full bg-transparent border-b border-white/10 py-2 font-mono text-sm text-white focus:border-brand-gold outline-none appearance-none"
                       >
                         {Object.values(PROGRAMS).map(p => (
                           <option key={p.id} value={p.id}>{p.name.toUpperCase()} ({(p.rate * 100).toFixed(0)}%)</option>
                         ))}
                       </select>
                    </div>
                 </div>

                 {/* Profit Output */}
                 <div className="p-10 flex flex-col justify-center bg-[#080808]">
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00E5FF] mb-2">Net_Yield_Delta</p>
                    <p className="text-5xl font-light text-white tracking-tighter tabular-nums">{formatCurrency(profit)}</p>
                 </div>

                 {/* Total Output */}
                 <div className="p-10 flex flex-col justify-center bg-brand-gold">
                    <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-black/60 mb-2 font-bold">Gross_Settlement</p>
                    <p className="text-5xl font-bold text-black tracking-tighter tabular-nums">{formatCurrency(total)}</p>
                 </div>
              </div>
           </div>
        </motion.div>

        {/* 6. LIQUIDITY LINES (Staking Programs) */}
        <motion.div variants={item} className="space-y-8">
           <div className="flex items-center gap-6">
              <h2 className="text-3xl font-light uppercase tracking-tighter">Active_Lines</h2>
              <div className="h-[0.5px] flex-1 bg-white/10" />
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
              {Object.values(PROGRAMS).map((p) => (
                <ProgramCard key={p.id} program={p} onStakeClick={onOpenStake} />
              ))}
           </div>
        </motion.div>

        {/* FOOTER */}
        <motion.footer variants={item} className="pt-20 pb-10 flex justify-between border-t border-white/5 font-mono text-[8px] uppercase tracking-[0.4em] text-slate-700">
           <span>Encrypted_Connection_SHA256</span>
           <span>Node_Lagos_Verified</span>
        </motion.footer>

      </motion.div>
    </div>
  );
}