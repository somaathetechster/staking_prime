"use client";

import { useState } from "react";
import { Navbar, Sidebar, Modal } from "@primestakecorp/ui";
import MarketingPage from "../screens/MarketingPage";
import AuthFlow from "../screens/AuthFlow";
import Dashboard from "../screens/Dashboard";

export default function HomePage() {
  // Navigation State: marketing | auth | pending | dashboard
  const [view, setView] = useState("marketing");
  const [userStatus, setUserStatus] = useState(null); 

  // Financial State
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [nextPayout, setNextPayout] = useState("");

  // UI Modals
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [stakeModalOpen, setStakeModalOpen] = useState(false);
  const [stakeProgram, setStakeProgram] = useState(null);

  /**
   * Called by AuthFlow after successful OTP verification
   */
  const handleAuthComplete = (status) => {
    setUserStatus(status);
    if (status === "pending_review") {
      setView("pending");
    } else if (status === "approved") {
      setView("dashboard");
    }
  };

  const handleOpenStake = (program) => {
    setStakeProgram(program);
    setStakeModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-black text-slate-100 flex flex-col">
      <Navbar
        onGoMarketing={() => setView("marketing")}
        onGoDashboard={() => userStatus === 'approved' ? setView("dashboard") : null}
        onGoAuth={() => setView("auth")}
        isApproved={userStatus === "approved"}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Only show Sidebar if user is authenticated */}
        {(view === "dashboard" || view === "pending") && (
          <Sidebar
            currentView={view}
            userStatus={userStatus}
            onNavigateDashboard={() => setView("dashboard")}
          />
        )}

        <main className="flex-1 relative flex flex-col min-w-0 overflow-hidden">
          {/* 1. MARKETING SCREEN */}
          {view === "marketing" && (
            <MarketingPage onEnter={() => setView("auth")} />
          )}

          {/* 2. AUTHENTICATION FLOW */}
          {view === "auth" && (
            <AuthFlow onCompleteVerify={handleAuthComplete} />
          )}

          {/* 3. PENDING REVIEW SCREEN */}
          {view === "pending" && (
            <div className="flex-1 flex items-center justify-center p-8 bg-brand-black">
              <div className="max-w-md w-full text-center space-y-6">
                <div className="inline-block p-4 rounded-full bg-brand-gold/10 border border-brand-gold/20 mb-4 animate-pulse">
                  <span className="text-brand-gold text-2xl font-serif">P</span>
                </div>
                <h2 className="text-3xl font-light text-white tracking-tight">Access Under Review</h2>
                <p className="text-sm text-gray-500 leading-relaxed font-light">
                  Our compliance desk is currently vetting your principal profile. 
                  Your secure deposit infrastructure will be provisioned upon approval.
                </p>
                <div className="pt-8 border-t border-white/5">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-ping" />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                      Status: Manual Vetting
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. ACTIVE DASHBOARD */}
          {view === "dashboard" && (
            <Dashboard
              walletBalance={walletBalance}
              stakedBalance={stakedBalance}
              nextPayout={nextPayout}
              onOpenDeposit={() => setDepositModalOpen(true)}
              onOpenStake={handleOpenStake}
              isVerified={userStatus === "approved"}
            />
          )}
        </main>
      </div>

      {/* DEPOSIT MODAL */}
      <Modal
        open={depositModalOpen}
        title="Institutional Deposit"
        onClose={() => setDepositModalOpen(false)}
      >
        <div className="space-y-6 py-4">
          <div className="p-4 rounded-xl bg-black border border-white/5 text-center">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Unique BTC Address</p>
             <code className="text-brand-gold text-xs block break-all bg-white/5 p-3 rounded border border-brand-gold/20">
               {/* This will be dynamic in Phase 2 */}
               bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
             </code>
          </div>
          <p className="text-[10px] text-gray-600 text-center leading-relaxed">
            Assets will be credited to your portfolio after 3 network confirmations.
          </p>
        </div>
      </Modal>

      {/* STAKE MODAL */}
      <Modal
        open={stakeModalOpen}
        title={stakeProgram ? `Stake: ${stakeProgram.name}` : "Capital Allocation"}
        onClose={() => setStakeModalOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Confirm your allocation into the {stakeProgram?.label} program.</p>
          <button className="w-full py-3 bg-brand-gold text-black font-bold rounded-full text-sm">
            Execute Allocation
          </button>
        </div>
      </Modal>
    </div>
  );
}