//apps/frontend/app/page.js

"use client";

import { useState, useEffect } from "react";
import { Navbar, Sidebar, Modal } from "@primestakecorp/ui";
import { AnimatePresence, motion } from "framer-motion";
import MarketingPage from "../screens/MarketingPage";
import AuthFlow from "../screens/AuthFlow";
import Dashboard from "../screens/Dashboard";
import PendingPage from "./pending/page"; // Using the upgraded Pending UI

export default function HomePage() {
  // View State: marketing | auth | pending | dashboard
  const [view, setView] = useState("marketing");
  const [userStatus, setUserStatus] = useState(null); 

  // Financial State (Infrastructure for Phase 2)
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [nextPayout, setNextPayout] = useState("");

  // UI Modals
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [stakeProgram, setStakeProgram] = useState(null);

  /**
   * Institutional Auth Handshake
   */
  const handleAuthComplete = (status) => {
    setUserStatus(status);
    // Standardize status strings to the Prisma Schema: PENDING_REVIEW | APPROVED
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === "PENDING_REVIEW") setView("pending");
    if (normalizedStatus === "APPROVED") setView("dashboard");
  };

  const handleOpenStake = (program) => {
    setStakeProgram(program);
    setStakeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white flex flex-col font-sans selection:bg-brand-gold selection:text-black">
      
      {/* 1. ARCHITECTURAL NAVBAR */}
      <Navbar
        onGoMarketing={() => setView("marketing")}
        onGoDashboard={() => userStatus === 'APPROVED' ? setView("dashboard") : null}
        onGoAuth={() => setView("auth")}
        isApproved={userStatus === "APPROVED"}
      />

      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 2. SIDEBAR: SYSTEM CONTROL NODE */}
        <AnimatePresence mode="wait">
          {(view === "dashboard" || view === "pending") && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="z-30 h-full"
            >
              <Sidebar
                currentView={view}
                userStatus={userStatus?.toLowerCase()}
                onNavigateDashboard={() => setView("dashboard")}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. MAIN TERMINAL VIEWPORT */}
        <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden bg-brand-black">
          <AnimatePresence mode="wait">
            
            {/* MARKETING VIEW */}
            {view === "marketing" && (
              <motion.div key="marketing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <MarketingPage onEnter={() => setView("auth")} />
              </motion.div>
            )}

            {/* AUTHENTICATION GATEWAY */}
            {view === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full">
                <AuthFlow onCompleteVerify={handleAuthComplete} />
              </motion.div>
            )}

            {/* VETTING PENDING (MANDATORY VETTING) */}
            {view === "pending" && (
              <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
                <PendingPage />
              </motion.div>
            )}

            {/* ACTIVE PORTFOLIO DASHBOARD */}
            {view === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} className="h-full">
                <Dashboard
                  walletBalance={walletBalance}
                  stakedBalance={stakedBalance}
                  nextPayout={nextPayout}
                  onOpenDeposit={() => setDepositModalOpen(true)}
                  onOpenStake={handleOpenStake}
                  isVerified={userStatus === "APPROVED"}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* --- INSTITUTIONAL MODALS (Brutalist Standard) --- */}

      {/* DEPOSIT MODAL */}
      <Modal
        open={depositModalOpen}
        title="Inbound_Capital_Provision"
        onClose={() => setDepositModalOpen(false)}
      >
        <div className="space-y-8 py-6">
          <div className="bg-tech-900/50 border-[0.5px] border-tech-800 p-8 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold/40" />
            <p className="font-mono-data text-[8px] text-tech-600 uppercase tracking-[0.4em] mb-4">Dedicated_BTC_Node</p>
            <div className="flex items-center justify-between gap-4 bg-brand-black p-4 border border-tech-900 group">
              <code className="font-mono-data text-[11px] text-brand-gold break-all tabular-nums">
                bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
              </code>
              <button className="text-tech-700 hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 items-start bg-signal-cyan/5 p-4 border border-signal-cyan/10">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-cyan mt-1.5 glow-cyan" />
            <p className="font-mono-data text-[9px] text-tech-500 uppercase leading-relaxed tracking-tighter">
              Notice: Assets finalized after 3 network confirmations. Automated ledger credit upon block settlement.
            </p>
          </div>
        </div>
      </Modal>

      {/* STAKE MODAL */}
      <Modal
        open={stakeModalOpen}
        title={stakeProgram ? `Execute_Sequence: ${stakeProgram.name}` : "Capital_Allocation"}
        onClose={() => setStakeModalOpen(false)}
      >
        <div className="space-y-10 py-6">
          <div className="space-y-2">
            <p className="font-mono-data text-[8px] text-tech-600 uppercase tracking-[0.4em]">Allocation_Parameters</p>
            <p className="text-sm text-tech-700 leading-relaxed uppercase tracking-tighter">
              Confirming principal movement into the <span className="text-white">{stakeProgram?.label}</span> yield stream. This action is immutable once recorded on the ledger.
            </p>
          </div>

          <button className="relative w-full py-5 bg-white text-black font-bold uppercase tracking-[0.3em] text-[10px] overflow-hidden group active:scale-[0.98] transition-transform">
             <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent group-hover:animate-[loading-scan_2s_infinite]" />
             Authorize_Position
          </button>
        </div>
      </Modal>
    </div>
  );
}