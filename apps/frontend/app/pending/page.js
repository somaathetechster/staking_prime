"use client";

import React, { useEffect, useState } from 'react';
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
// Removed LogoTower because the Navbar in HomePage already handles branding

export default function PendingPage() {
  const [timestamp, setTimestamp] = useState("");
  const handleSignOut = () => signOut({ callbackUrl: '/' });

  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  return (
    // Removed min-h-screen and absolute positioning. 
    // This now acts as a standard component injected into the main viewport.
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 w-full h-full pb-20 sm:pb-6">
      
      {/* Top-Level Metadata (Inline instead of absolute) */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row justify-between items-start sm:items-end font-mono-data text-[7px] sm:text-[8px] text-tech-700 tracking-[0.3em] sm:tracking-[0.5em] uppercase mb-4 sm:mb-8 gap-2 sm:gap-0">
        <div className="space-y-1">
          <p>Terminal_ID: PRM-VET-092</p>
          <p>Node: Global_Primary</p>
        </div>
        <div className="sm:text-right space-y-1">
          <p>AES_256_ACTIVE</p>
          <p className="hidden sm:block">{timestamp}</p>
        </div>
      </div>

      {/* Main Content Module: The "Vault" Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-brand-obsidian border-[0.5px] border-tech-900 p-6 sm:p-12 lg:p-16 relative z-10"
      >
        {/* Hardware Corner Brackets */}
        <div className="absolute top-0 left-0 w-3 sm:w-4 h-3 sm:h-4 border-t border-l border-tech-700" />
        <div className="absolute bottom-0 right-0 w-3 sm:w-4 h-3 sm:h-4 border-b border-r border-tech-700" />

        <div className="space-y-8 sm:space-y-10">
          <header className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="h-1 w-6 sm:w-8 bg-brand-gold/30 shrink-0" />
              <p className="font-mono-data text-[7px] sm:text-[9px] text-brand-gold uppercase tracking-[0.2em] sm:tracking-[0.4em] truncate">Security_Protocol_Initiated</p>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-white uppercase leading-[0.9] sm:leading-[0.9]">
              Identity<br />Vetting_In_Progress
            </h1>
          </header>
          
          <div className="space-y-4 sm:space-y-6">
            <p className="text-tech-700 text-xs sm:text-sm leading-relaxed font-sans max-w-sm">
              Your institutional access query is currently undergoing <span className="text-white">Due Diligence Protocol 4.2</span>. 
              Manual verification of principal capital and eligibility is mandatory for all Primestakecorp entries.
            </p>
            
            {/* Technical Progress Bars */}
            <div className="space-y-2 pt-2 sm:pt-4">
              <div className="flex justify-between font-mono-data text-[6px] sm:text-[7px] text-tech-800 uppercase">
                <span>KYC_Verification_Stream</span>
                <span className="text-signal-cyan">Active</span>
              </div>
              <div className="h-[1px] w-full bg-tech-900 relative overflow-hidden">
                <motion.div 
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-signal-cyan/40 to-transparent"
                />
              </div>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="pt-4 sm:pt-8 w-full">
            <div className="inline-flex w-full sm:w-auto items-center justify-center sm:justify-start gap-3 sm:gap-4 bg-tech-900/30 border border-tech-800 px-4 sm:px-8 py-3 sm:py-4">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="glow-cyan absolute inline-flex h-full w-full rounded-full bg-signal-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-cyan"></span>
              </span>
              <span className="font-mono-data text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-white truncate">
                Vetting_Status: PENDING
              </span>
            </div>
          </div>

          {/* Action / Information Section */}
          <div className="pt-8 sm:pt-12 border-t border-tech-900 mt-8 sm:mt-12 space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <p className="font-mono-data text-[7px] sm:text-[8px] text-tech-800 uppercase tracking-widest leading-none">
                Decision_Gateway
              </p>
              <p className="text-tech-700 text-[10px] sm:text-xs leading-relaxed uppercase tracking-tighter">
                You will be notified via encrypted channel once the desk has approved your allocation.
              </p>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="group flex w-full sm:w-auto justify-center sm:justify-start items-center gap-3 text-tech-700 hover:text-white transition-all font-mono-data text-[8px] sm:text-[9px] uppercase tracking-[0.2em] active:scale-95 py-2 sm:py-0"
            >
              <span className="h-px w-4 bg-tech-700 group-hover:w-8 group-hover:bg-signal-crimson transition-all hidden sm:block" />
              Terminate_Connection
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}