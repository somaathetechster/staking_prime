"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Globe, 
  ChevronRight,
  UserCheck
} from 'lucide-react';

export default function VettingQueue({ pendingUsers, onAction }) {
  return (
    <div className="space-y-6">
      {/* 1. COMPONENT HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-4 gap-4 sm:gap-0">
        <div className="space-y-1">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.4em] text-gray-500 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3 flex-shrink-0" /> Identity_Verification_Protocol
          </h2>
          <p className="text-xl font-light text-white tracking-tight">
            Pending <span className="text-white/30">Principals</span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-[9px] text-gray-600 uppercase">
            Queue_Depth: <span className="text-white">{pendingUsers?.length || 0}</span>
          </p>
        </div>
      </div>

      {/* 2. THE TACTICAL LIST */}
      <div className="min-h-[300px] relative bg-brand-black border border-white/5 rounded-md overflow-hidden">
        {/* Background Grid for Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[size:16px_16px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] pointer-events-none" />

        <div className="relative z-10 divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {!pendingUsers || pendingUsers.length === 0 ? (
              <EmptyState />
            ) : (
              pendingUsers.map((user) => (
                <VettingRow key={user.id} user={user} onAction={onAction} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: ROW ITEM ---
function VettingRow({ user, onAction }) {
  const [processing, setProcessing] = useState(null); // 'approved' | 'rejected' | null

  const handleAction = async (type) => {
    setProcessing(type);
    // Artificial delay for "Weight" (optional, purely for feel)
    await new Promise(r => setTimeout(r, 600)); 
    onAction(user.id, type);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className={`
        group relative p-4 sm:p-6 flex flex-col xl:flex-row gap-4 xl:gap-6 items-start xl:items-center justify-between hover:bg-white/[0.02] transition-colors
        ${processing === 'approved' ? 'bg-brand-gold/10' : ''}
        ${processing === 'rejected' ? 'bg-red-900/10' : ''}
      `}
    >
      {/* Loading Overlay */}
      {processing && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] flex flex-col sm:flex-row items-center justify-center p-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className={`h-1.5 w-1.5 rounded-full animate-ping flex-shrink-0 ${processing === 'approved' ? 'bg-brand-gold' : 'bg-red-500'}`} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-white whitespace-normal sm:whitespace-nowrap">
              {processing === 'approved' ? 'Provisioning_Infrastructure...' : 'Terminating_Request...'}
            </span>
          </div>
        </div>
      )}

      {/* A. IDENTITY DATA */}
      <div className="flex items-start gap-3 sm:gap-4 w-full xl:w-auto overflow-hidden">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 flex-shrink-0 mt-1 sm:mt-0">
          <UserCheck className="w-3 h-3 sm:w-4 sm:h-4" />
        </div>
        <div className="min-w-0 flex-1"> {/* min-w-0 prevents text overflow breaking flex container */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
            <h3 className="font-mono text-xs sm:text-sm text-white font-bold tracking-wider truncate">
              {user.email}
            </h3>
            <span className="inline-flex w-fit px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest whitespace-nowrap">
              New_Applicant
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 sm:gap-4 text-[8px] sm:text-[9px] text-gray-500 font-mono uppercase tracking-widest">
            <span>ID: {user.id.substring(0, 8)}...</span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Globe className="w-3 h-3" /> Global
            </span>
          </div>
        </div>
      </div>

      {/* B. RISK ASSESSMENT (Simulated Visual) */}
      <div className="hidden lg:block shrink-0">
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[8px] text-gray-600 uppercase tracking-widest">Algorithmic_Risk_Score</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-1 h-3 ${i < 2 ? 'bg-signal-green' : 'bg-white/10'}`} />
              ))}
            </div>
            <span className="font-mono text-xs text-signal-green tracking-widest">LOW_RISK</span>
          </div>
        </div>
      </div>

      {/* C. ACTION COMMANDS */}
      <div className="flex items-center justify-between xl:justify-end gap-2 sm:gap-4 w-full xl:w-auto mt-2 xl:mt-0 pt-4 xl:pt-0 border-t border-white/5 xl:border-none">
        <button
          onClick={() => handleAction('rejected')}
          disabled={!!processing}
          className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-3 sm:py-2 border border-white/5 xl:border-transparent hover:border-red-900/50 bg-black/50 xl:bg-transparent text-gray-500 hover:text-red-500 transition-all rounded-sm xl:rounded-none"
        >
          <XCircle className="w-4 h-4 flex-shrink-0" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold inline-block xl:hidden group-hover/btn:inline-block">Reject</span>
        </button>

        <button
          onClick={() => handleAction('approved')}
          disabled={!!processing}
          className="flex-1 xl:flex-none relative overflow-hidden group/approve px-4 sm:px-6 py-3 bg-brand-gold text-black hover:bg-white transition-colors rounded-sm xl:rounded-none"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover/approve:animate-[loading-scan_1s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="relative flex items-center justify-center gap-2 sm:gap-3">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.1em] sm:tracking-[0.2em] whitespace-nowrap">
              Authorize<span className="hidden sm:inline">_Principal</span>
            </span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
          </div>
        </button>
      </div>
    </motion.div>
  );
}

// --- SUB-COMPONENT: EMPTY STATE ---
function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12 sm:py-20 text-gray-600 px-4 text-center"
    >
      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-4">
        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
      </div>
      <h3 className="text-white text-sm sm:text-base font-light tracking-widest uppercase">All Protocols Clear</h3>
      <p className="font-mono text-[9px] sm:text-[10px] mt-2 tracking-[0.1em] sm:tracking-[0.2em] max-w-[200px] sm:max-w-none">No pending identities found in buffer.</p>
    </motion.div>
  );
}