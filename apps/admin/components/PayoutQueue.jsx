"use client";

import useSWR from "swr";
import { toast } from "sonner";

const fetcher = (url) => fetch(url).then(res => res.json());

export default function PayoutQueue() {
  const { data: queue, mutate } = useSWR('/api/payouts/queue', fetcher);

  const handleProcess = async (logId, action) => {
    const confirmAction = confirm(`ARE_YOU_SURE: ${action}_PAYOUT?`);
    if (!confirmAction) return;

    try {
      const res = await fetch(`/api/payouts/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId, action })
      });

      if (res.ok) {
        toast.success(`PAYOUT_${action}_SUCCESSFUL`);
        mutate();
      }
    } catch (e) {
      toast.error("COMMUNICATION_ERROR_WITH_LEDGER");
    }
  };

  return (
    <div className="border border-white/10 bg-[#050505] overflow-hidden">
      <header className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
        <h2 className="font-mono text-[10px] uppercase tracking-[0.3em] text-brand-gold">Pending_Settlement_Queue</h2>
        <span className="font-mono text-[8px] text-slate-500">Count: {queue?.length || 0}</span>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black/40 font-mono text-[8px] uppercase tracking-widest text-slate-600">
            <tr>
              <th className="p-4">Principal</th>
              <th className="p-4">Asset_Amount</th>
              <th className="p-4">Destination</th>
              <th className="p-4 text-right">Settlement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono text-[9px]">
            {queue?.map(item => (
              <tr key={item.id} className="hover:bg-white/[0.01]">
                <td className="p-4 text-white uppercase">{item.user.email}</td>
                <td className="p-4 text-signal-crimson">
                  {Math.abs(item.amount).toLocaleString()} {item.currency}
                </td>
                <td className="p-4 text-slate-500 truncate max-w-[150px]">
                  {item.metadata.destinationAddress}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => handleProcess(item.id, 'REJECT')}
                    className="px-3 py-1 border border-white/10 text-slate-500 hover:text-white transition-colors"
                  >
                    [ REJECT ]
                  </button>
                  <button 
                    onClick={() => handleProcess(item.id, 'APPROVE')}
                    className="px-3 py-1 bg-white text-black font-bold hover:bg-brand-gold transition-colors"
                  >
                    [ EXECUTE ]
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {queue?.length === 0 && (
          <div className="p-12 text-center text-slate-700 font-mono text-[8px] uppercase tracking-[0.4em]">
            No_Pending_Settlements_In_The_Stack
          </div>
        )}
      </div>
    </div>
  );
}