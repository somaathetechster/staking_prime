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
  // FIXED: Removed '/admin' prefix to match your actual file structure
  const { data: userData, error: userError, isLoading: usersLoading } = useSWR(
    '/api/users?status=PENDING_REVIEW', 
    fetcher, 
    { refreshInterval: 10000 } 
  );

  // FIXED: Removed '/admin' prefix
  const { data: rateData, isLoading: ratesLoading } = useSWR(
    '/api/rates', 
    fetcher
  );

  // 2. OPTIMISTIC UI HANDLERS (Zero Latency)
  const handleVettingAction = async (userId, action) => {
    // Immediate visual feedback
    const originalUsers = userData;
    const optimisticUsers = { 
      ...userData, 
      data: userData?.data?.filter(u => u.id !== userId) || [] 
    };

    // Update local cache instantly with the CORRECT path
    mutate('/api/users?status=PENDING_REVIEW', optimisticUsers, false);
    
    toast.loading(`Executing protocol: ${action}...`, { id: 'vetting' });

    try {
      // FIXED: Removed '/route' suffix. Next.js routes to the folder name.
      const res = await fetch('/api/vetting', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action }),
      });

      if (!res.ok) throw new Error('Protocol Failed');

      toast.success(`User ${userId.substring(0, 8)}... [${action}]`, { id: 'vetting' });
      // Trigger a real re-fetch to ensure sync
      mutate('/api/users?status=PENDING_REVIEW');
    } catch (error) {
      toast.error('Handshake Failed. Rolling back.', { id: 'vetting' });
      // Rollback on error
      mutate('/api/users?status=PENDING_REVIEW', originalUsers, false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20">
      
      {/* 1. HUD HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-brand-gold">
            <ShieldCheck className="w-4 h-4" />
            <p className="font-mono text-[9px] uppercase tracking-[0.4em] font-bold">
              Command_Level_Access
            </p>
          </div>
          <h1 className="text-5xl font-light text-white tracking-tighter uppercase">
            Overseer <span className="text-white/30">Control</span>
          </h1>
        </div>
        
        <div className="flex gap-8">
          <StatWidget label="Network_Load" value="12%" status="good" />
          <StatWidget label="Pending_Queue" value={userData?.meta?.total || 0} status={userData?.meta?.total > 0 ? "warning" : "neutral"} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. VETTING QUEUE (Left Column - Wider) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
              <Users className="w-3 h-3" /> Identity_Verification_Queue
            </h2>
            {usersLoading && <RefreshCw className="w-3 h-3 animate-spin text-signal-cyan" />}
          </div>

          <div className="bg-brand-black border border-white/5 relative overflow-hidden min-h-[400px]">
            {/* Tactical Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] bg-[size:16px_16px] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] pointer-events-none" />

            <div className="relative z-10">
              {usersLoading ? (
                <div className="p-12 text-center font-mono text-xs text-gray-600 animate-pulse">Scanning database nodes...</div>
              ) : userData?.data?.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-600">
                  <ShieldCheck className="w-8 h-8 opacity-20" />
                  <p className="font-mono text-[10px] uppercase tracking-widest">Queue Clear / System Idle</p>
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
        <div className="space-y-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
             <Banknote className="w-3 h-3" /> Global_Rate_Oracle
          </h2>
          
          <div className="bg-[#050505] border border-white/5 p-6 space-y-6 relative">
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

// --- SUB-COMPONENTS FOR CLEAN ARCHITECTURE ---

function VettingRow({ user, onAction }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
      className="p-6 hover:bg-white/[0.02] transition-colors group flex justify-between items-center"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-white tracking-wider">{user.email}</span>
          <span className="px-1.5 py-0.5 bg-brand-gold/10 text-brand-gold text-[8px] font-bold uppercase tracking-widest border border-brand-gold/20">
            Pending_Audit
          </span>
        </div>
        <p className="font-mono text-[9px] text-gray-600 uppercase">
          ID: {user.id.substring(0, 12)}... • Registered: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-3 opacity-40 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={() => onAction(user.id, 'REJECT')}
          className="px-4 py-2 border border-red-900/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 text-[9px] font-bold uppercase tracking-[0.2em] transition-all"
        >
          Reject
        </button>
        <button 
          onClick={() => onAction(user.id, 'APPROVE')}
          className="px-6 py-2 bg-brand-gold text-black hover:bg-white text-[9px] font-bold uppercase tracking-[0.2em] transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]"
        >
          Authorize
        </button>
      </div>
    </motion.div>
  );
}

function RateWidget({ symbol, initialData }) {
  // Local state for immediate input feedback before saving
  const [manualRate, setManualRate] = useState(initialData?.rate || 0);

  const handleUpdate = async () => {
    toast.loading(`Pegging ${symbol}...`);
    // API Call logic here...
    toast.success(`${symbol} Pegged at $${manualRate}`);
  };

  return (
    <div className="p-4 border border-white/5 bg-white/[0.02]">
      <div className="flex justify-between items-center mb-4">
        <span className="font-bold text-white tracking-widest">{symbol}</span>
        <span className="font-mono text-[9px] text-signal-cyan uppercase tracking-wider">Live: $98,420.00</span>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <span className="absolute left-3 top-2.5 text-gray-600 text-[10px]">$</span>
          <input 
            type="number" 
            value={manualRate}
            onChange={(e) => setManualRate(e.target.value)}
            className="w-full bg-black border border-white/10 py-2 pl-6 pr-2 font-mono text-xs text-white focus:border-brand-gold outline-none transition-colors"
          />
        </div>
        <button onClick={handleUpdate} className="px-3 border border-white/10 hover:bg-white hover:text-black transition-colors">
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
    <div className="text-right">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-600 mb-1">{label}</p>
      <p className={`font-mono text-xl tracking-tighter ${colors[status]}`}>{value}</p>
    </div>
  );
}