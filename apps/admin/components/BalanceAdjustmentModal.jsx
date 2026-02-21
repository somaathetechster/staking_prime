"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function BalanceAdjustmentModal({ user, onClose, onRefresh }) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdjust = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/adjust-balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, reason })
      });

      if (res.ok) {
        toast.success("LEDGER_MODIFIED_SUCCESSFULLY");
        onRefresh();
        onClose();
      }
    } catch (e) {
      toast.error("PROTOCOL_ERROR: FAILED_TO_UPDATE_LEDGER");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#050505] border border-white/10 max-w-lg w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        
        <header className="mb-8">
          <p className="font-mono text-[9px] text-brand-gold uppercase tracking-widest">Vault_Modification // {user.email}</p>
          <h2 className="text-2xl font-light uppercase">Manual_Ledger_Entry</h2>
        </header>

        <div className="space-y-6">
          {/* CURRENCY SELECT */}
          <div>
            <label className="block font-mono text-[8px] text-slate-500 uppercase mb-2">Asset_Type</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 text-sm outline-none focus:border-brand-gold transition-colors"
            >
              <option value="BTC">BTC (Bitcoin)</option>
              <option value="USDT">USDT (Tether)</option>
              <option value="USD">USD (Cash/Balance)</option>
            </select>
          </div>

          {/* AMOUNT INPUT */}
          <div>
            <label className="block font-mono text-[8px] text-slate-500 uppercase mb-2">Delta_Amount (Use negative for deduction)</label>
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 text-xl font-mono outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          {/* REASON / AUDIT NOTE */}
          <div>
            <label className="block font-mono text-[8px] text-slate-500 uppercase mb-2">Audit_Note (Offline Transfer ID, Cash Receipt, etc.)</label>
            <textarea 
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-3 text-xs outline-none focus:border-brand-gold transition-colors"
              placeholder="ENTER_REASON_FOR_MANUAL_OVERRIDE..."
            />
          </div>

          <button 
            disabled={loading}
            onClick={handleAdjust}
            className="w-full bg-white text-black py-4 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-brand-gold transition-all"
          >
            {loading ? "EXECUTING_TRANSACTION..." : "COMMIT_CHANGES_TO_LEDGER"}
          </button>
        </div>
      </div>
    </div>
  );
}