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
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gray-500 flex items-center gap-2">
            <Lock className="w-3 h-3 flex-shrink-0" /> Exchange_Authority_Node
          </h2>
          <p className="text-xl font-light text-white tracking-tight">
            Asset <span className="text-white/30">Pegging</span>
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-2 justify-end">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-green animate-pulse" />
            <span className="font-mono text-[9px] text-signal-green uppercase tracking-widest hidden sm:inline-block">
              Oracle_Link: Active
            </span>
            <span className="font-mono text-[9px] text-signal-green uppercase tracking-widest sm:hidden">
              Active
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
    <div className={`relative overflow-hidden group border transition-all duration-300 rounded-md sm:rounded-none ${isManual ? 'bg-brand-gold/5 border-brand-gold/30' : 'bg-black/40 border-white/5 hover:border-white/10'}`}>
      
      {/* Active Indicator Line */}
      {isManual && <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-gold shadow-[0_0_15px_rgba(212,175,55,0.5)]" />}

      {/* RESPONSIVE GRID SETUP
        Mobile: Uses flexbox for careful stacking
        Desktop (lg): Uses the original 12-column grid layout
      */}
      <div className="p-4 sm:p-6 flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 items-start lg:items-center">
        
        {/* ROW 1 (Mobile): ASSET IDENTIFIER & SWITCH */}
        <div className="w-full flex justify-between items-center lg:col-span-3 lg:contents">
          
          {/* A. ASSET IDENTIFIER */}
          <div className="flex items-center gap-3 sm:gap-4 lg:col-span-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-base sm:text-lg border shrink-0 ${isManual ? 'border-brand-gold text-brand-gold' : 'border-white/10 text-gray-500'}`}>
              {symbol.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg tracking-wider">{symbol}</h3>
              <p className="font-mono text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-widest whitespace-nowrap">
                {isManual ? 'Manual_Override' : 'Market_Sync'}
              </p>
            </div>
          </div>

          {/* D. MASTER SWITCH (Moved up for mobile) */}
          <div className="lg:hidden shrink-0">
            <MasterSwitch isManual={isManual} symbol={symbol} onUpdate={onUpdate} />
          </div>
        </div>

        {/* ROW 2 (Mobile): MARKET DATA & ADMIN CONTROL */}
        <div className="w-full flex flex-col sm:flex-row gap-4 sm:gap-6 lg:col-span-9 lg:contents">
          
          {/* B. MARKET DATA (Read Only) */}
          <div className="w-full sm:w-1/3 lg:col-span-3 pt-2 border-t border-white/5 sm:border-t-0 sm:pt-0 lg:border-none">
            <label className="block font-mono text-[8px] uppercase text-gray-600 mb-1 tracking-widest">Global_Index_Price</label>
            <div className="flex items-center gap-2 font-mono text-xs sm:text-sm text-gray-400 bg-white/[0.02] sm:bg-transparent p-2 sm:p-0 rounded border border-white/5 sm:border-none">
              <span>$</span>
              <span className="tracking-widest">{marketRate.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* C. ADMIN CONTROL (Write) */}
          <div className="w-full sm:w-2/3 lg:col-span-4 relative">
            <label className="block font-mono text-[8px] uppercase text-brand-gold mb-1 tracking-widest flex justify-between">
              <span>Internal_Peg_Rate</span>
              {isManual && (
                <span className={spread > 0 ? "text-signal-green" : "text-red-500"}>
                  Spread: {spread > 0 ? "+" : ""}{spread.toFixed(2)}%
                </span>
              )}
            </label>
            
            <div className="relative group/input">
              <span className={`absolute left-3 top-2.5 sm:top-2 text-[10px] transition-colors ${isManual ? 'text-brand-gold' : 'text-gray-600'}`}>USD</span>
              <input
                type="number"
                disabled={!isManual}
                value={data.adminRate || ""}
                onChange={(e) => onUpdate(symbol, 'adminRate', e.target.value)}
                placeholder={marketRate.toFixed(2)}
                className={`w-full bg-black border py-2.5 sm:py-2 pl-10 pr-4 font-mono text-sm outline-none transition-all rounded-sm sm:rounded-none
                  ${isManual 
                    ? 'border-brand-gold/50 text-white focus:border-brand-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.1)]' 
                    : 'border-white/10 text-gray-600 cursor-not-allowed bg-white/[0.02]'
                  }
                `}
              />
            </div>
          </div>
          
          {/* D. MASTER SWITCH (Desktop Position) */}
          <div className="hidden lg:flex lg:col-span-2 justify-end">
            <MasterSwitch isManual={isManual} symbol={symbol} onUpdate={onUpdate} />
          </div>
        </div>

      </div>

      {/* WARNING FOOTER (Conditional) */}
      <AnimatePresence>
        {isManual && Math.abs(spread) > 10 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }} 
            className="bg-brand-gold/10 border-t border-brand-gold/20 px-4 sm:px-6 py-3 sm:py-2 flex items-start sm:items-center gap-3"
          >
            <AlertCircle className="w-4 h-4 sm:w-3 sm:h-3 text-brand-gold flex-shrink-0 mt-0.5 sm:mt-0" />
            <p className="font-mono text-[8px] sm:text-[9px] text-brand-gold uppercase tracking-widest leading-relaxed">
              Warning: Significant divergence from market index ({spread.toFixed(1)}%)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Extracted the switch to a sub-component to reuse it in both mobile and desktop layouts
function MasterSwitch({ isManual, symbol, onUpdate }) {
  return (
    <button
      onClick={() => onUpdate(symbol, 'useManual', !isManual)}
      className={`
        relative h-7 sm:h-8 w-12 sm:w-14 border transition-all duration-300 flex items-center px-1 rounded-sm sm:rounded-none
        ${isManual ? 'border-brand-gold bg-brand-gold/10' : 'border-gray-700 bg-transparent hover:border-gray-500'}
      `}
    >
      <motion.div
        layout
        className={`h-4 sm:h-5 w-4 sm:w-5 border shadow-sm transition-colors rounded-sm sm:rounded-none ${isManual ? 'bg-brand-gold border-brand-gold' : 'bg-gray-600 border-gray-600'}`}
        // Adjusted toggle distance based on button width for mobile vs desktop
        animate={{ x: isManual ? "100%" : 0 }}
        style={{ x: isManual ? "calc(100% + 4px)" : "0px" }} // Added inline style to help framer-motion with percentage calculations
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}