"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar, Sidebar, Modal } from "@primestakecorp/ui";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutDashboard, Wallet, ArrowUpRight, History, Settings } from "lucide-react"; 
import MarketingPage from "../screens/MarketingPage";
import AuthFlow from "../screens/AuthFlow";
import Dashboard from "../screens/Dashboard";
import PendingPage from "./pending/page";

/**
 * PRIMESTAKE CORE TERMINAL
 * Handling view states: marketing | auth | pending | dashboard
 */
export default function HomePage() {
  const router = useRouter();

  // --- VIEW STATE ---
  const [view, setView] = useState("marketing");
  const [userStatus, setUserStatus] = useState(null); 

  // --- FINANCIAL STATE ---
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [nextPayout, setNextPayout] = useState("");

  // --- UI MODALS ---
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [stakeProgram, setStakeProgram] = useState(null);

  /**
   * IDENTITY RESOLUTION
   * Triggered after OTP verification
   */
  const handleAuthComplete = (status) => {
    setUserStatus(status);
    const normalizedStatus = status.toUpperCase();
    if (normalizedStatus === "PENDING_REVIEW") setView("pending");
    if (normalizedStatus === "APPROVED") setView("dashboard");
  };

  /**
   * STAKING ENGINE TRIGGER
   */
  const handleOpenStake = (program) => {
    setStakeProgram(program);
    setStakeModalOpen(true);
  };

  return (
    <div className="h-screen bg-brand-black text-white flex flex-col font-sans selection:bg-brand-gold selection:text-black overflow-hidden relative">
      
      {/* 1. ARCHITECTURAL NAVBAR */}
      <Navbar
        onGoMarketing={() => setView("marketing")}
        onGoDashboard={() => userStatus === 'APPROVED' ? setView("dashboard") : null}
        onGoAuth={() => setView("auth")}
        isApproved={userStatus === "APPROVED"}
      />

      <div className="flex flex-1 overflow-hidden relative pb-16 lg:pb-0">
        
        {/* 2. SIDEBAR (DESKTOP_ONLY) */}
        <AnimatePresence mode="wait">
          {(view === "dashboard" || view === "pending") && (
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="z-30 h-full hidden lg:block shrink-0"
            >
              <Sidebar
                currentView={view}
                userStatus={userStatus?.toLowerCase()}
                onNavigateDashboard={() => setView("dashboard")}
                // Routing to dedicated physical pages
                onNavigateTransactions={() => router.push('/transactions')}
                onNavigateWithdraw={() => router.push('/withdraw')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 3. MAIN TERMINAL VIEWPORT */}
        <main className="flex-1 relative flex flex-col min-w-0 overflow-y-auto bg-brand-black scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          <AnimatePresence mode="wait">
            
            {view === "marketing" && (
              <motion.div key="marketing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full">
                <MarketingPage onEnter={() => setView("auth")} />
              </motion.div>
            )}

            {view === "auth" && (
              <motion.div key="auth" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="min-h-full">
                <AuthFlow onCompleteVerify={handleAuthComplete} />
              </motion.div>
            )}

            {view === "pending" && (
              <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-full">
                <PendingPage />
              </motion.div>
            )}

            {view === "dashboard" && (
              <motion.div key="dashboard" initial={{ opacity: 0, filter: "blur(10px)" }} animate={{ opacity: 1, filter: "blur(0px)" }} exit={{ opacity: 0 }} className="min-h-full">
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

      {/* 4. MOBILE BOTTOM DOCK (Vetted Users Only) */}
      <AnimatePresence>
        {(view === "dashboard" || view === "pending") && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-black/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe"
          >
            {/* Hub - Returns to Dashboard View */}
            <button 
              onClick={() => setView("dashboard")}
              className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${view === 'dashboard' ? 'text-brand-gold' : 'text-gray-500 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5 mb-1" />
              <span className="font-mono text-[8px] uppercase tracking-widest">Hub</span>
            </button>
            
            {/* Asset - Triggers Deposit Modal */}
            <button 
              onClick={() => setDepositModalOpen(true)}
              disabled={view === "pending"}
              className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-white transition-colors disabled:opacity-30"
            >
              <Wallet className="w-5 h-5 mb-1" />
              <span className="font-mono text-[8px] uppercase tracking-widest">Asset</span>
            </button>

            {/* Exit - Navigates to /withdraw */}
            <button 
              onClick={() => router.push('/withdraw')}
              disabled={view === "pending"}
              className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-white transition-colors disabled:opacity-30"
            >
              <ArrowUpRight className="w-5 h-5 mb-1" />
              <span className="font-mono text-[8px] uppercase tracking-widest">Exit</span>
            </button>

            {/* Logs - Navigates to /transactions */}
            <button 
              onClick={() => router.push('/transactions')}
              className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-white transition-colors"
            >
              <History className="w-5 h-5 mb-1" />
              <span className="font-mono text-[8px] uppercase tracking-widest">Logs</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- INSTITUTIONAL MODALS --- */}
      
      {/* DEPOSIT MODAL */}
      <Modal
        open={depositModalOpen}
        title="Inbound_Capital_Provision"
        onClose={() => setDepositModalOpen(false)}
      >
        <div className="space-y-6 sm:space-y-8 py-4 sm:py-6">
          <div className="bg-tech-900/50 border-[0.5px] border-tech-800 p-4 sm:p-8 relative">
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold/40" />
            <p className="font-mono text-[8px] text-tech-600 uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-3 sm:mb-4">Dedicated_BTC_Node</p>
            <div className="flex items-center justify-between gap-2 sm:gap-4 bg-brand-black p-3 sm:p-4 border border-tech-900 group">
              <code className="font-mono text-[9px] sm:text-[11px] text-brand-gold break-all tabular-nums">
                bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
              </code>
              <button className="text-tech-700 hover:text-white transition-colors shrink-0 p-2 border border-white/5 active:bg-white/10 rounded-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              </button>
            </div>
          </div>
          <div className="flex gap-3 sm:gap-4 items-start bg-signal-cyan/5 p-3 sm:p-4 border border-signal-cyan/10">
            <div className="h-1.5 w-1.5 rounded-full bg-signal-cyan mt-1 sm:mt-1.5 glow-cyan shrink-0" />
            <p className="font-mono text-[8px] sm:text-[9px] text-tech-500 uppercase leading-relaxed tracking-tighter">
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
        <div className="space-y-6 sm:space-y-10 py-4 sm:py-6">
          <div className="space-y-2">
            <p className="font-mono text-[8px] text-tech-600 uppercase tracking-[0.2em] sm:tracking-[0.4em]">Allocation_Parameters</p>
            <p className="text-xs sm:text-sm text-tech-700 leading-relaxed uppercase tracking-tighter">
              Confirming principal movement into the <span className="text-white">{stakeProgram?.label}</span> yield stream. This action is immutable once recorded on the ledger.
            </p>
          </div>

          <button className="relative w-full py-4 sm:py-5 bg-white text-black font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[9px] sm:text-[10px] overflow-hidden group active:scale-[0.98] transition-transform">
             <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent group-hover:animate-[loading-scan_2s_infinite] hidden sm:block" />
             Authorize_Position
          </button>
        </div>
      </Modal>
    </div>
  );
}