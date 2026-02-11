"use client";

import React from 'react';
import { LogoTower } from "@primestakecorp/ui";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function PendingPage() {
  const handleSignOut = () => signOut({ callbackUrl: '/' });

  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center px-6 overflow-hidden relative">
      
      {/* 1. Atmospheric Background: The Orbital Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* 2. Top-Level Metadata (The "Swiss" Header) */}
      <div className="absolute top-12 left-12 right-12 hidden lg:flex justify-between items-start font-mono-data text-[8px] text-tech-700 tracking-[0.5em] uppercase">
        <div className="space-y-1">
          <p>Terminal_ID: PRM-VET-092</p>
          <p>Location: Global_Node_Primary</p>
        </div>
        <div className="text-right space-y-1">
          <p>Encryption: AES_256_ACTIVE</p>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </div>

      {/* Branding Section */}
      <motion.div 
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2 }}
        className="mb-16 z-10"
      >
        <LogoTower />
      </motion.div>

      {/* Main Content Module: The "Vault" Card */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-xl w-full bg-brand-obsidian border-[0.5px] border-tech-900 p-12 lg:p-16 relative z-10"
      >
        {/* Hardware Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tech-700" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tech-700" />

        <div className="space-y-10">
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-8 bg-brand-gold/30" />
              <p className="font-mono-data text-[9px] text-brand-gold uppercase tracking-[0.4em]">Security_Protocol_Initiated</p>
            </div>
            <h1 className="text-5xl font-bold tracking-tighter text-white uppercase leading-[0.9]">
              Identity<br />Vetting_In_Progress
            </h1>
          </header>
          
          <div className="space-y-6">
            <p className="text-tech-700 text-sm leading-relaxed font-sans max-w-sm">
              Your institutional access query is currently undergoing <span className="text-white">Due Diligence Protocol 4.2</span>. 
              Manual verification of principal capital and eligibility is mandatory for all Primestakecorp entries.
            </p>
            
            {/* Technical Progress Bars (Non-functional, purely aesthetic) */}
            <div className="space-y-2 pt-4">
              <div className="flex justify-between font-mono-data text-[7px] text-tech-800 uppercase">
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

          {/* Status Indicator: The "Cyber Cyan" Signal */}
          <div className="pt-8">
            <div className="inline-flex items-center gap-4 bg-tech-900/30 border border-tech-800 px-8 py-4">
              <span className="relative flex h-2 w-2">
                <span className="glow-cyan absolute inline-flex h-full w-full rounded-full bg-signal-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-cyan"></span>
              </span>
              <span className="font-mono-data text-[10px] uppercase tracking-[0.3em] font-bold text-white">
                Vetting_Status: PENDING_REVIEW
              </span>
            </div>
          </div>

          {/* Action / Information Section */}
          <div className="pt-12 border-t border-tech-900 mt-12 space-y-8">
            <div className="space-y-2">
              <p className="font-mono-data text-[8px] text-tech-800 uppercase tracking-widest leading-none">
                Decision_Gateway
              </p>
              <p className="text-tech-700 text-xs leading-relaxed uppercase tracking-tighter">
                You will be notified via encrypted channel once the desk has approved your allocation.
              </p>
            </div>
            
            <button 
              onClick={handleSignOut}
              className="group flex items-center gap-3 text-tech-700 hover:text-white transition-all font-mono-data text-[9px] uppercase tracking-[0.2em]"
            >
              <span className="h-px w-4 bg-tech-700 group-hover:w-8 group-hover:bg-signal-crimson transition-all" />
              Terminate_Connection
            </button>
          </div>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 left-12 font-mono-data text-[8px] text-tech-800 uppercase tracking-[0.5em] flex gap-8">
        <span>© 2026 PRIMESTAKECORP</span>
        <span className="hidden md:inline">PRIVATE_YIELD_DESK</span>
        <span className="text-tech-900">SYSTEM_ID_4100_X</span>
      </footer>
    </div>
  );
}