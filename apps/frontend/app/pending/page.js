import React from 'react';
import { LogoTower } from "@primestakecorp/ui";

/**
 * PENDING VETTING SCREEN (MANDATORY HARD STOP)
 * This is the only screen unvetted users see after OTP verification.
 */
export default function PendingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 selection:bg-brand-gold/30">
      
      {/* Branding Section */}
      <div className="mb-12 transition-opacity duration-1000 animate-in fade-in slide-in-from-bottom-4">
        <LogoTower />
      </div>

      {/* Main Content Card */}
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-3xl font-light tracking-tight text-white sm:text-4xl">
          Access Under Review
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            Thank you for your interest in <span className="text-white">Primestakecorp</span>. 
            To maintain our institutional standards, all access requests are reviewed 
            manually by our Vetting Team.
          </p>
          
          <p className="text-gray-500 text-xs italic">
            Due diligence, eligibility, and risk assessments are currently being conducted.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="pt-6">
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-yellow-500">
              Status: Pending Vetting Review
            </span>
          </div>
        </div>

        {/* Action / Information Section */}
        <div className="pt-12 border-t border-white/5 mt-8">
          <p className="text-gray-600 text-[11px] uppercase tracking-widest mb-4">
            Next Steps
          </p>
          <p className="text-gray-400 text-sm">
            You will receive a notification at your registered email address once 
            your status has been updated.
          </p>
          
          <button 
            onClick={() => {/* Implement Logout Logic */}}
            className="mt-8 text-white/40 hover:text-white text-xs underline underline-offset-4 transition-colors"
          >
            Sign out of request
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="absolute bottom-8 text-[10px] text-gray-700 uppercase tracking-widest">
        &copy; 2026 Primestakecorp &middot; Private Yield Desk
      </footer>
    </div>
  );
}