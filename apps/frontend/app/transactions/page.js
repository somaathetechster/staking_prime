"use client";

import useSWR from "swr";
import { motion } from "framer-motion";

const fetcher = (url) => fetch(url).then(res => res.json());

export default function TransactionHistory() {
  const { data: transactions } = useSWR('/api/transactions', fetcher);

  return (
    <div className="min-h-screen bg-brand-black p-4 sm:p-8 space-y-12">
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 border-b border-white/10 pb-8">
        <div className="space-y-2">
          <p className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.5em]">Institutional_Records</p>
          <h1 className="text-4xl sm:text-6xl font-light tracking-tighter uppercase text-white">Statement_Log</h1>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 border border-white/10 text-[9px] uppercase font-bold tracking-widest text-slate-400 hover:text-white transition-colors">
             Export_CSV
           </button>
        </div>
      </header>

      {/* TRANSACTION TABLE */}
      <div className="relative border border-white/5 bg-white/[0.01] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="font-mono text-[10px] uppercase tracking-widest text-slate-500 bg-white/5">
            <tr>
              <th className="p-5 border-b border-white/10">Timestamp</th>
              <th className="p-5 border-b border-white/10">Protocol_Type</th>
              <th className="p-5 border-b border-white/10 text-right">Amount</th>
              <th className="p-5 border-b border-white/10">Reference_ID</th>
              <th className="p-5 border-b border-white/10 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions?.map((tx, index) => (
              <motion.tr 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={tx.id} 
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="p-5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
                <td className="p-5 font-bold text-[10px] uppercase tracking-wider text-white">
                  {tx.type.replace('_', ' ')}
                </td>
                <td className={`p-5 text-right font-mono text-xs tabular-nums ${tx.amount > 0 ? 'text-signal-green' : 'text-signal-crimson'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-[9px] text-slate-600">{tx.currency}</span>
                </td>
                <td className="p-5 font-mono text-[9px] text-slate-600 uppercase">
                  {tx.txId ? tx.txId.slice(0, 16) + '...' : 'INTERNAL_LEDGER'}
                </td>
                <td className="p-5 text-right">
                  <span className="inline-block text-[8px] border border-white/10 px-2 py-0.5 text-slate-400 uppercase">
                    {tx.status}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {transactions?.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <p className="font-mono text-[9px] text-slate-700 uppercase tracking-widest italic">No_Financial_Events_Recorded_In_This_Cycle</p>
          </div>
        )}
      </div>

      <footer className="pt-12 flex justify-between font-mono text-[8px] text-slate-800 uppercase tracking-widest">
         <span>Trace_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
         <span>Security_Tier: Institutional_Gold</span>
      </footer>
    </div>
  );
}