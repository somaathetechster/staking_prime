"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Lock } from "lucide-react";

export default function CurrencyManager({ rates, onUpdate }) {
  const symbols = Object.keys(rates);

  return (
    <div className="space-y-6">
      {/* 1. COMPONENT HEADER */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Exchange_Authority_Node
          </h2>
          <p className="text-xl font-light text-white tracking-tight">
            Asset <span className="text-white/30">Pegging</span>
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" />
            <span className="font-mono text-[9px] text-signal-green uppercase tracking-widest">
              Oracle_Link: Active
            </span>
          </div>
          <p className="font-mono text-[9px] text-gray-600 uppercase mt-1">
            Latency: 14ms
          </p>
        </div>
      </div>

      {/* 2. THE RACK MOUNT GRID */}
      <div className="grid grid-cols-1 gap-4">
        {symbols.map((symbol) => (
          <CurrencyBlade 
            key={symbol} 
            symbol={symbol} 
            data={rates[symbol]} 
            onUpdate={onUpdate} 
          />
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: THE "BLADE" ---
function CurrencyBlade({ symbol, data, onUpdate }) {
  const isManual = data.useManual;
  const adminRate = parseFloat(data.adminRate) || 0;
  const marketRate = parseFloat(data.marketRate) || 0;

  // Calculate the "Spread" (How much are we marking up/down?)
  const spread = adminRate > 0 
    ? ((adminRate - marketRate) / marketRate) * 100 
    : 0;

  return (
    <div className={`relative overflow-hidden group border transition-all duration-300 ${isManual ? 'bg-brand-gold/5 border-brand-gold/30' : 'bg-black/40 border-white/5 hover:border-white/10'}`}>
      
      {/* Active Indicator Line */}
      {isManual && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" />}

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* A. ASSET IDENTIFIER */}
        <div className="lg:col-span-3 flex items-center gap-4">
          <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg border ${isManual ? 'border-brand-gold text-brand-gold' : 'border-white/10 text-gray-500'}`}>
            {symbol.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-white text-lg tracking-wider">{symbol}</h3>
            <p className="font-mono text-[9px] text-gray-500 uppercase tracking-widest">
              {isManual ? 'Manual_Override' : 'Market_Sync'}
            </p>
          </div>
        </div>

        {/* B. MARKET DATA (Read Only) */}
        <div className="lg:col-span-3">
          <label className="block font-mono text-[8px] uppercase text-gray-600 mb-1 tracking-widest">Global_Index_Price</label>
          <div className="flex items-center gap-2 font-mono text-sm text-gray-400">
            <span>$</span>
            <span className="tracking-widest">{marketRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* C. ADMIN CONTROL (Write) */}
        <div className="lg:col-span-4 relative">
          <label className="block font-mono text-[8px] uppercase text-brand-gold mb-1 tracking-widest flex justify-between">
            <span>Internal_Peg_Rate</span>
            {isManual && (
              <span className={spread > 0 ? "text-signal-green" : "text-red-500"}>
                Spread: {spread > 0 ? "+" : ""}{spread.toFixed(2)}%
              </span>
            )}
          </label>
          
          <div className="relative group/input">
            <span className={`absolute left-3 top-2.5 text-[10px] transition-colors ${isManual ? 'text-brand-gold' : 'text-gray-600'}`}>USD</span>
            <input
              type="number"
              disabled={!isManual}
              value={data.adminRate || ""}
              onChange={(e) => onUpdate(symbol, 'adminRate', e.target.value)}
              placeholder={marketRate.toFixed(2)}
              className={`w-full bg-black border py-2 pl-10 pr-4 font-mono text-sm outline-none transition-all
                ${isManual 
                  ? 'border-brand-gold/50 text-white focus:border-brand-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                  : 'border-white/10 text-gray-600 cursor-not-allowed bg-white/[0.02]'
                }
              `}
            />
          </div>
        </div>

        {/* D. MASTER SWITCH */}
        <div className="lg:col-span-2 flex justify-end">
          <button
            onClick={() => onUpdate(symbol, 'useManual', !isManual)}
            className={`
              relative h-8 w-14 border transition-all duration-300 flex items-center px-1
              ${isManual ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-700 bg-transparent hover:border-gray-500'}
            `}
          >
            <motion.div
              layout
              className={`h-5 w-5 border shadow-sm transition-colors ${isManual ? 'bg-brand-gold border-brand-gold' : 'bg-gray-600 border-gray-600'}`}
              animate={{ x: isManual ? 22 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          </button>
        </div>

      </div>

      {/* WARNING FOOTER (Conditional) */}
      <AnimatePresence>
        {isManual && Math.abs(spread) > 10 && (
          <motion.div 
            initial={{ height: 0 }} 
            animate={{ height: "auto" }} 
            exit={{ height: 0 }} 
            className="bg-brand-gold/10 border-t border-brand-gold/20 px-6 py-2 flex items-center gap-3"
          >
            <AlertCircle className="w-3 h-3 text-brand-gold" />
            <p className="font-mono text-[9px] text-brand-gold uppercase tracking-widest">
              Warning: Significant divergence from market index ({spread.toFixed(1)}%)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}