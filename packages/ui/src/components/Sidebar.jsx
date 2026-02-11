"use client";

import LogoTower from "./LogoTower";
import { motion } from "framer-motion";

export default function Sidebar({ currentView, userStatus, onNavigateDashboard }) {
  const isApproved = userStatus === "approved";

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-tech-900 bg-brand-black px-8 py-10">
      {/* Surgical Logo Placement */}
      <div className="mb-16">
        <LogoTower />
      </div>

      <nav className="flex-1 space-y-12">
        <section>
          <p className="font-mono-data text-[9px] text-tech-600 mb-6 uppercase tracking-[0.5em]">
            Terminal_Navigation
          </p>

          <div className="space-y-2">
            {/* PORTFOLIO: The Primary Action Node */}
            <button
              onClick={isApproved ? onNavigateDashboard : null}
              disabled={!isApproved}
              className={`group relative w-full flex items-center justify-between border py-4 px-5 transition-all duration-300 ${
                currentView === "dashboard"
                  ? "bg-brand-obsidian border-tech-800 text-white"
                  : isApproved
                  ? "border-transparent hover:border-tech-800 text-tech-600 hover:text-white"
                  : "border-transparent opacity-30 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <div className={`h-1.5 w-1.5 transition-all ${
                  isApproved 
                    ? "bg-signal-cyan glow-cyan shadow-[0_0_8px_rgba(0,229,255,0.4)]" 
                    : "bg-tech-700"
                }`} />
                <span className="text-xs font-bold uppercase tracking-widest">Portfolio</span>
              </div>
              
              {isApproved && (
                <span className="font-mono-data text-[8px] text-signal-cyan opacity-70">
                  LIVE_FEED
                </span>
              )}
              
              {/* Brutalist Selection Indicator */}
              {currentView === "dashboard" && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 w-[2px] h-full bg-brand-gold" 
                />
              )}
            </button>

            {/* SECONDARY NODES: Institutional Sub-systems */}
            <div className="pt-4 space-y-1">
              {["Liquidity_Lines", "Identity_Vault", "Audit_Ledger"].map((item) => (
                <div 
                  key={item}
                  className="group w-full flex items-center justify-between py-3 px-5 text-tech-700 text-[10px] font-mono-data uppercase cursor-default border border-transparent hover:border-tech-900 transition-all"
                >
                  <span className="group-hover:text-tech-600 transition-colors">{item}</span>
                  <div className="h-3 w-3 border border-tech-800 flex items-center justify-center">
                    <div className="h-[1px] w-1 bg-tech-800" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </nav>

      {/* SYSTEM CRITICAL STATUS: The "Hard" Footer */}
      <div className="mt-auto pt-10 border-t border-tech-900 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-[8px] text-tech-700">DESK_STATUS</span>
            <span className={`font-mono-data text-[9px] px-2 py-0.5 border ${
              isApproved 
              ? "border-signal-cyan/20 text-signal-cyan bg-signal-cyan/5" 
              : "border-tech-800 text-tech-700"
            }`}>
              {isApproved ? "CONNECTED" : "AUTH_PENDING"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-[8px] text-tech-700">GATEWAY</span>
            <span className="font-mono-data text-[9px] text-white">PROD_DESK_LX</span>
          </div>
        </div>

        {/* Encrypted Disclaimer: Brutalist Box */}
        <div className="bg-tech-900/30 border border-tech-900 p-4">
          <p className="text-[10px] text-tech-700 leading-relaxed font-mono italic uppercase tracking-tighter">
            Terminal connection encrypted via node_v4.2. unauthorized access logged.
          </p>
        </div>
      </div>
    </aside>
  );
}