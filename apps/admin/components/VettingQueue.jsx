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
      <div className="flex justify-between items-end border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500 flex items-center gap-2">
            <ShieldAlert className="w-3 h-3" /> Identity_Verification_Protocol
          </h2>
          <p className="text-xl font-light text-white tracking-tight">
            Pending <span className="text-white/30">Principals</span>
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[9px] text-gray-600 uppercase">
            Queue_Depth: <span className="text-white">{pendingUsers.length}</span>
          </p>
        </div>
      </div>

      {/* 2. THE TACTICAL LIST */}
      <div className="min-h-[300px] relative bg-brand-black border border-white/5">
        {/* Background Grid for Texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-[size:16px_16px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] pointer-events-none" />

        <div className="relative z-10 divide-y divide-white/5">
          <AnimatePresence mode="popLayout">
            {pendingUsers.length === 0 ? (
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
        group relative p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between hover:bg-white/[0.02] transition-colors
        ${processing === 'approved' ? 'bg-brand-gold/10' : ''}
        ${processing === 'rejected' ? 'bg-red-900/10' : ''}
      `}
    >
      {/* Loading Overlay */}
      {processing && (
        <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className={`h-1.5 w-1.5 rounded-full animate-ping ${processing === 'approved' ? 'bg-brand-gold' : 'bg-red-500'}`} />
            <span className="font-mono text-[9px] uppercase tracking-widest text-white">
              {processing === 'approved' ? 'Provisioning_Infrastructure...' : 'Terminating_Request...'}
            </span>
          </div>
        </div>
      )}

      {/* A. IDENTITY DATA */}
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
          <UserCheck className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-mono text-sm text-white font-bold tracking-wider">{user.email}</h3>
            <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest">
              New_Applicant
            </span>
          </div>
          <div className="flex items-center gap-4 text-[9px] text-gray-500 font-mono uppercase tracking-widest">
            <span>ID: {user.id.substring(0, 8)}...</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {new Date(user.createdAt).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3" /> Region: Global
            </span>
          </div>
        </div>
      </div>

      {/* B. RISK ASSESSMENT (Simulated Visual) */}
      <div className="hidden lg:block">
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => handleAction('rejected')}
          disabled={!!processing}
          className="group/btn flex items-center gap-2 px-4 py-2 border border-transparent hover:border-red-900/50 text-gray-500 hover:text-red-500 transition-all"
        >
          <XCircle className="w-4 h-4" />
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] font-bold hidden group-hover/btn:inline-block">Reject</span>
        </button>

        <button
          onClick={() => handleAction('approved')}
          disabled={!!processing}
          className="relative overflow-hidden group/approve px-6 py-3 bg-brand-gold text-black hover:bg-white transition-colors"
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 translate-x-[-100%] group-hover/approve:animate-[loading-scan_1s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          <div className="relative flex items-center gap-3">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]">Authorize_Principal</span>
            <ChevronRight className="w-3 h-3" />
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
      className="flex flex-col items-center justify-center py-20 text-gray-600"
    >
      <div className="w-16 h-16 rounded-full border border-white/5 bg-white/[0.02] flex items-center justify-center mb-4">
        <CheckCircle className="w-6 h-6 text-gray-700" />
      </div>
      <h3 className="text-white font-light tracking-widest uppercase">All Protocols Clear</h3>
      <p className="font-mono text-[10px] mt-2 tracking-[0.2em]">No pending identities found in buffer.</p>
    </motion.div>
  );
}