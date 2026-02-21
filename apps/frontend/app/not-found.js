"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function NotFound() {
  // Prevent hydration mismatch on the random Trace_ID
  const [traceId, setTraceId] = useState("");
  useEffect(() => {
    setTraceId(Math.random().toString(36).substring(7).toUpperCase());
  }, []);

  return (
    <div className="min-h-screen sm:min-h-screen bg-brand-black flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      
      {/* 1. The Tactical Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* 2. Top Navigation Metadata (Switched from absolute to relative flex) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 font-mono-data text-[7px] sm:text-[9px] text-tech-800 uppercase tracking-[0.2em] sm:tracking-[0.4em] z-10 w-full">
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-6">
          <span>Err_Log: 0x404</span>
          <span className="text-signal-crimson">Status: Resource_Void</span>
        </div>
        <span className="mt-2 sm:mt-0">Terminal_Secure_V4</span>
      </div>

      {/* 3. Central Diagnostic Module */}
      <div className="flex-1 flex items-center justify-center py-8 z-10 w-full">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-brand-obsidian border-[0.5px] border-tech-900 p-6 sm:p-12 lg:p-20 relative"
        >
          {/* Hardware Corner Brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-tech-700" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-tech-700" />

          <div className="space-y-8 sm:space-y-12">
            <header className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-signal-crimson animate-pulse shadow-[0_0_8px_rgba(255,0,85,0.4)] flex-shrink-0" />
                <p className="font-mono-data text-[8px] sm:text-[9px] text-signal-crimson uppercase tracking-[0.3em] sm:tracking-[0.5em]">Anomaly_Detected</p>
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter text-white uppercase leading-[0.85] sm:leading-[0.8] break-words">
                Path<br />Not_Found
              </h1>
            </header>

            <div className="space-y-6 sm:space-y-8">
              <p className="text-tech-700 text-xs sm:text-sm leading-relaxed max-w-sm uppercase tracking-tighter">
                The requested resource has been moved, purged, or never existed within this institutional gateway. Verification of the path hierarchy has failed.
              </p>

              {/* Simulated Debug Console */}
              <div className="bg-tech-900/20 border border-tech-900 p-4 sm:p-6 font-mono-data text-[8px] sm:text-[9px] text-tech-600 space-y-1.5">
                <p className="text-tech-500">{'>'} RUNNING PATH_DIAGNOSTIC...</p>
                <p>{'>'} [FAIL] RESOURCE_LOCATOR_TIMEOUT</p>
                <p>{'>'} [FAIL] ROUTE_INTEGRITY_COMPROMISED</p>
                <div className="flex items-center gap-2 pt-2 border-t border-tech-900/50 mt-2">
                  <p className="text-signal-cyan">SUGGESTION: RETURN TO CONTROL_CENTER</p>
                  <div className="h-1 w-1 bg-signal-cyan animate-ping flex-shrink-0" />
                </div>
              </div>
            </div>

            {/* Action: The "Hard Reset" Button */}
            <div className="pt-4 sm:pt-8">
              <Link href="/" className="group relative w-full sm:w-auto inline-flex items-center justify-center overflow-hidden border border-tech-800 bg-transparent px-6 sm:px-10 py-4 sm:py-5 transition-all hover:bg-white hover:text-black">
                {/* Scanline Animation */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:animate-[loading-scan_1.5s_infinite] hidden sm:block" />
                
                <span className="font-mono-data text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] relative z-10 whitespace-nowrap">
                  Execute_Home_Reset
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* 4. Footer Technical Data (Switched to relative flex) */}
      <footer className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 font-mono-data text-[7px] sm:text-[9px] text-tech-900 uppercase tracking-[0.2em] sm:tracking-[0.4em] z-10 w-full mt-auto">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8">
          <span>Node_Uptime: 99.99%</span>
          <span>Tier: Inst_Gold</span>
        </div>
        <div className="text-tech-800">
          Trace_ID: {traceId}
        </div>
      </footer>
    </div>
  );
}