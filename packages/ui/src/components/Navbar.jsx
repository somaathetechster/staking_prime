"use client";

import { useState, useEffect } from "react";
import LogoTower from "./LogoTower";
import { motion } from "framer-motion";

export default function Navbar({ onGoMarketing, onGoDashboard, onGoAuth, isApproved }) {
  const [time, setTime] = useState("");

  // Live UTC Ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().split("T")[1].split(".")[0] + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#020202]/90 backdrop-blur-md border-b border-white/5">
      {/* Top Gold Line (The "Power Rail") */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />

      <div className="max-w-[1920px] mx-auto px-6 lg:px-12 h-24 flex items-center justify-between">
        
        {/* LEFT: BRAND & SYSTEM STATUS */}
        <div className="flex items-center gap-10">
          <div className="cursor-pointer hover:opacity-80 transition-opacity" onClick={onGoMarketing}>
            <LogoTower />
          </div>
          
          {/* Vertical Divider */}
          <div className="hidden lg:block h-10 w-[1px] bg-white/10" />

          {/* System Telemetry */}
          <div className="hidden lg:block space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full animate-pulse" />
              <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#00E5FF]">
                Node_Link_Active
              </p>
            </div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
              Latency: 12ms &middot; {time}
            </p>
          </div>
        </div>

        {/* RIGHT: COMMANDS */}
        <div className="flex items-center gap-8">
          
          {/* Nav Links (Terminal Style) */}
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={onGoMarketing}
              className="group relative px-2 py-1"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">
                Market_Data
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-300" />
            </button>

            {!isApproved && (
              <button 
                onClick={onGoAuth}
                className="group relative px-2 py-1"
              >
                <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-slate-400 group-hover:text-white transition-colors">
                  Client_Login
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-300" />
              </button>
            )}
          </div>

          {/* THE MAIN TRIGGER (Hard-Edge Button) */}
          <button
            onClick={isApproved ? onGoDashboard : onGoAuth}
            className="group relative overflow-hidden bg-white text-black px-10 py-4 transition-all hover:bg-brand-gold"
          >
            {/* Hover Scanline */}
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[loading-scan_1s_ease-in-out_infinite]" />
            
            <div className="relative z-10 flex flex-col items-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                {isApproved ? "Enter_Mainframe" : "Request_Access"}
              </span>
              {/* Micro-text for depth */}
              <span className="hidden group-hover:block absolute -bottom-6 font-mono text-[7px] tracking-widest text-black/60 group-hover:-bottom-1 transition-all duration-300">
                SECURE_UPLINK
              </span>
            </div>

            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-black opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-black opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

        </div>
      </div>
    </header>
  );
}