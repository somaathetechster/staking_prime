"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* 1. The Tactical Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* 2. Top Navigation Metadata */}
      <div className="absolute top-8 left-8 right-8 flex justify-between font-mono-data text-[7px] text-tech-800 uppercase tracking-[0.4em] z-10">
        <div className="flex gap-6">
          <span>Err_Log: 0x404</span>
          <span className="text-signal-crimson">Status: Resource_Void</span>
        </div>
        <span>Terminal_Secure_V4</span>
      </div>

      {/* 3. Central Diagnostic Module */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-brand-obsidian border-[0.5px] border-tech-900 p-12 lg:p-20 relative z-10"
      >
        {/* Hardware Corner Brackets */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tech-700" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tech-700" />

        <div className="space-y-12">
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 bg-signal-crimson animate-pulse shadow-[0_0_8px_rgba(255,0,85,0.4)]" />
              <p className="font-mono-data text-[9px] text-signal-crimson uppercase tracking-[0.5em]">Anomaly_Detected</p>
            </div>
            <h1 className="text-7xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-[0.8]">
              Path<br />Not_Found
            </h1>
          </header>

          <div className="space-y-8">
            <p className="text-tech-700 text-sm leading-relaxed max-w-sm uppercase tracking-tighter">
              The requested resource has been moved, purged, or never existed within this institutional gateway. Verification of the path hierarchy has failed.
            </p>

            {/* Simulated Debug Console */}
            <div className="bg-tech-900/20 border border-tech-900 p-6 font-mono-data text-[9px] text-tech-600 space-y-1">
              <p className="text-tech-500"> RUNNING PATH_DIAGNOSTIC...</p>
              <p> [FAIL] RESOURCE_LOCATOR_TIMEOUT</p>
              <p> [FAIL] ROUTE_INTEGRITY_COMPROMISED</p>
              <div className="flex items-center gap-2">
                <p className="text-signal-cyan"> SUGGESTION: RETURN TO CONTROL_CENTER</p>
                <div className="h-1 w-1 bg-signal-cyan animate-ping" />
              </div>
            </div>
          </div>

          {/* Action: The "Hard Reset" Button */}
          <div className="pt-8">
            <Link href="/" className="group relative inline-flex items-center justify-center overflow-hidden border border-tech-800 bg-transparent px-10 py-5 transition-all hover:bg-white hover:text-black">
              {/* Scanline Animation */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[loading-scan_1.5s_infinite]" />
              
              <span className="font-mono-data text-[10px] font-bold uppercase tracking-[0.3em] relative z-10">
                Execute_Home_Reset
              </span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 4. Footer Technical Data */}
      <footer className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row justify-between items-center gap-4 font-mono-data text-[7px] text-tech-900 uppercase tracking-[0.4em]">
        <div className="flex gap-8">
          <span>Node_Uptime: 99.99%</span>
          <span>Security_Tier: Institutional_Gold</span>
        </div>
        <div className="text-tech-800">
          Trace_ID: {Math.random().toString(36).substring(7).toUpperCase()}
        </div>
      </footer>
    </div>
  );
}