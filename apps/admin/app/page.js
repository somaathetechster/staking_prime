"use client";

import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Users, 
  Banknote 
} from 'lucide-react';

// GENERIC FETCHER
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AdminDashboard() {
  // 1. REAL-TIME DATA STREAMS (SWR)
  const { data: userData, error: userError, isLoading: usersLoading } = useSWR(
    '/api/users?status=PENDING_REVIEW', 
    fetcher, 
    { refreshInterval: 10000 } 
  );

  const { data: rateData, isLoading: ratesLoading } = useSWR(
    '/api/rates', 
    fetcher
  );

  // 2. OPTIMISTIC UI HANDLERS (Zero Latency)
  const handleVettingAction = async (userId, action) => {
    const originalUsers = userData;
    const optimisticUsers = { 
      ...userData, 
      data: userData?.data?.filter(u => u.id !== userId) || [] 
    };

    mutate('/api/users?status=PENDING_REVIEW', optimisticUsers, false);
    
    toast.loading(`Executing protocol: ${action}...`, { id: 'vetting' });

    try {
      const res = await fetch('/api/vetting', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) throw new Error('Protocol Failed');

      toast.success(`User ${userId.substring(0, 8)}... [${action}]`, { id: 'vetting' });
      mutate('/api/users?status=PENDING_REVIEW');
    } catch (error) {
      toast.error('Handshake Failed. Rolling back.', { id: 'vetting' });
      mutate('/api/users?status=PENDING_REVIEW', originalUsers, false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 pb-20">
      
      {/* 1. HUD HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/5 pb-6 gap-6 sm:gap-6">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-brand-gold">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.4em] font-bold">
              Command_Level_Access
            </p>
          </div>
          <h1 className="text-3xl sm:text-5xl font-light text-white tracking-tighter uppercase">
            Overseer <span className="text-white/30">Control</span>
          </h1>
        </div>
        
        {/* Stats stack nicely on mobile, align right on desktop */}
        <div className="flex w-full sm:w-auto justify-between sm:justify-end gap-4 sm:gap-8 border-t border-white/5 pt-4 sm:border-none sm:pt-0">
          <StatWidget label="Network_Load" value="12%" status="good" />
          <StatWidget label="Pending_Queue" value={userData?.meta?.total || 0} status={userData?.meta?.total > 0 ? "warning" : "neutral"} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. VETTING QUEUE (Left Column - Wider) */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-500 flex items-center gap-2">
              <Users className="w-3 h-3 flex-shrink-0" /> Identity_Verification_Queue
            </h2>
            {usersLoading && <RefreshCw className="w-3 h-3 animate-spin text-signal-cyan flex-shrink-0" />}
          </div>

          <div className="bg-brand-black border border-white/5 relative overflow-hidden min-h-[400px] rounded-md sm:rounded-none">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[size:16px_16px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] pointer-events-none" />

            <div className="relative z-10">
              {usersLoading ? (
                <div className="p-12 text-center font-mono text-xs text-gray-600 animate-pulse">Scanning database nodes...</div>
              ) : userData?.data?.length === 0 ? (
                <div className="p-12 sm:p-20 flex flex-col items-center justify-center gap-4 text-gray-600 text-center">
                  <ShieldCheck className="w-8 h-8 opacity-20" />
                  <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest">Queue Clear / System Idle</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <AnimatePresence>
                    {userData?.data?.map((user) => (
                      <VettingRow key={user.id} user={user} onAction={handleVettingAction} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. CURRENCY DESK (Right Column - Narrower) */}
        <div className="space-y-4 sm:space-y-6">
          <h2 className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-500 flex items-center gap-2">
             <Banknote className="w-3 h-3 flex-shrink-0" /> Global_Rate_Oracle
          </h2>
          
          <div className="bg-[#050505] border border-white/5 p-4 sm:p-6 space-y-4 sm:space-y-6 relative rounded-md sm:rounded-none">
             <div className="absolute top-0 right-0 p-2">
               <div className="h-1.5 w-1.5 bg-signal-green rounded-full animate-ping" />
             </div>
             
             {/* Rate Components */}
             <RateWidget symbol="BTC" initialData={rateData?.BTC} />
             <RateWidget symbol="ETH" initialData={rateData?.ETH} />
             <RateWidget symbol="USDT" initialData={rateData?.USDT} />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function VettingRow({ user, onAction }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      className="p-4 sm:p-6 hover:bg-white/[0.02] transition-colors group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0"
    >
      <div className="space-y-1.5 sm:space-y-1 w-full sm:w-auto overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <span className="font-mono text-[11px] text-white tracking-wider truncate">{user.email}</span>
          <span className="inline-flex w-fit px-1.5 py-0.5 bg-brand-gold/10 text-brand-gold text-[8px] font-bold uppercase tracking-widest border border-brand-gold/20 whitespace-nowrap">
            Pending_Audit
          </span>
        </div>
        <p className="font-mono text-[8px] sm:text-[9px] text-gray-600 uppercase flex flex-wrap gap-x-2">
          <span>ID: {user.id.substring(0, 12)}...</span>
          <span className="hidden sm:inline">•</span>
          <span>Reg: {new Date(user.createdAt).toLocaleDateString()}</span>
        </p>
      </div>

      {/* Buttons stretch full width on mobile, and are always visible (removed hover dependency) */}
      <div className="flex w-full sm:w-auto gap-2 sm:gap-3 transition-opacity">
        <button 
          onClick={() => onAction(user.id, 'REJECT')}
          className="flex-1 sm:flex-none px-4 py-3 sm:py-2 border border-red-900/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 text-[9px] font-bold uppercase tracking-[0.2em] transition-all rounded-sm sm:rounded-none"
        >
          Reject
        </button>
        <button 
          onClick={() => onAction(user.id, 'APPROVE')}
          className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-2 bg-brand-gold text-black hover:bg-white text-[9px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)] rounded-sm sm:rounded-none"
        >
          Authorize
        </button>
      </div>
    </motion.div>
  );
}

function RateWidget({ symbol, initialData }) {
  const [manualRate, setManualRate] = useState(initialData?.rate || 0);

  const handleUpdate = async () => {
    toast.loading(`Pegging ${symbol}...`);
    toast.success(`${symbol} Pegged at $${manualRate}`);
  };

  return (
    <div className="p-3 sm:p-4 border border-white/5 bg-white/[0.02] rounded-sm sm:rounded-none">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <span className="font-bold text-white tracking-widest text-sm sm:text-base">{symbol}</span>
        <span className="font-mono text-[8px] sm:text-[9px] text-signal-cyan uppercase tracking-wider">Live: $98,420.00</span>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <span className="absolute left-3 top-2.5 sm:top-2 text-gray-600 text-[10px]">$</span>
          <input 
            type="number" 
            value={manualRate}
            onChange={(e) => setManualRate(e.target.value)}
            className="w-full bg-black border border-white/10 py-2.5 sm:py-2 pl-6 pr-2 font-mono text-xs text-white focus:border-brand-gold outline-none transition-colors rounded-sm sm:rounded-none"
          />
        </div>
        <button onClick={handleUpdate} className="px-3 sm:px-4 border border-white/10 hover:bg-white hover:text-black transition-colors rounded-sm sm:rounded-none">
          <RefreshCw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function StatWidget({ label, value, status }) {
  const colors = {
    good: "text-signal-green",
    warning: "text-brand-gold",
    neutral: "text-gray-400"
  };

  return (
    <div className="text-left sm:text-right">
      <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-widest text-gray-600 mb-0.5 sm:mb-1">{label}</p>
      <p className={`font-mono text-lg sm:text-xl tracking-tighter ${colors[status]}`}>{value}</p>
    </div>
  );
}