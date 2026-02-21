"use client";

import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";

const fetcher = (url) => fetch(url).then((res) => res.json());

const TYPE_COLORS = {
  DEPOSIT: "text-signal-green",
  YIELD_PAYOUT: "text-signal-cyan",
  MANUAL_ADJUSTMENT: "text-brand-gold",
  STAKE_DELEGATION: "text-white",
  SYSTEM_INIT: "text-slate-500",
};

export default function ActivityFeed() {
  const { data: logs } = useSWR('/api/activity', fetcher, { refreshInterval: 5000 });

  return (
    <div className="border border-white/10 bg-black/40 backdrop-blur-sm flex flex-col h-[500px]">
      <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 bg-brand-gold rounded-full animate-pulse" />
          <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-white">Live_Activity_Buffer</h2>
        </div>
        <span className="font-mono text-[8px] text-slate-500">Auto_Refresh: 5s</span>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
        <AnimatePresence initial={false}>
          {logs?.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-4 font-mono text-[9px] group"
            >
              <span className="text-slate-700 shrink-0">
                [{new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}]
              </span>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`${TYPE_COLORS[log.type] || 'text-white'} font-bold`}>
                    {log.type}
                  </span>
                  <span className="text-slate-500 text-[7px]">ID: {log.id.slice(-8)}</span>
                </div>
                
                <p className="text-slate-400 uppercase tracking-tighter leading-tight">
                  <span className="text-white">{log.user?.email || 'SYSTEM'}</span>
                  {log.amount !== 0 && (
                    <>
                      <span className="mx-2">{'>>'}</span>
                      <span className={log.amount > 0 ? 'text-signal-green' : 'text-signal-crimson'}>
                        {log.amount > 0 ? '+' : ''}{log.amount.toLocaleString()} {log.currency}
                      </span>
                    </>
                  )}
                </p>
                
                {log.metadata?.admin_note && (
                  <p className="text-[7px] text-brand-gold/50 italic">
                    Note: {log.metadata.admin_note}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <footer className="p-2 bg-white/[0.02] border-t border-white/5 text-center">
        <p className="font-mono text-[7px] text-slate-700 uppercase tracking-widest">
          End_Of_Buffer // Secure_Audit_Active
        </p>
      </footer>
    </div>
  );
}