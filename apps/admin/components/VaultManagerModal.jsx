"use client";

import { useState } from "react";
import { toast } from "sonner";

export default function VaultManagerModal({ user, onClose, onRefresh }) {
  const [activeTab, setActiveTab] = useState("balance"); // "balance" | "stake"
  const [amount, setAmount] = useState("");
  const [planId, setPlanId] = useState("PRIME_30");
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    const endpoint = activeTab === "balance" 
      ? `/api/users/${user.id}/adjust-balance` 
      : `/api/users/${user.id}/initiate-stake`;

    const body = activeTab === "balance" 
      ? { amount, currency: "USD", reason: "Manual Admin Adjustment" }
      : { amount, planId };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast.success("VAULT_MODIFIED_SUCCESSFULLY");
        onRefresh();
        onClose();
      } else {
        const err = await res.json();
        toast.error(`ERROR: ${err.error}`);
      }
    } catch (e) {
      toast.error("COMMUNICATION_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="bg-[#050505] border border-white/10 max-w-xl w-full p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white">✕</button>
        
        <header className="mb-8 space-y-2">
          <p className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.4em]">Vault_Control // {user.email}</p>
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab("balance")}
              className={`text-xl font-light uppercase tracking-tighter ${activeTab === "balance" ? "text-white" : "text-white/20"}`}
            >
              Adjust_Balance
            </button>
            <span className="text-white/10">/</span>
            <button 
              onClick={() => setActiveTab("stake")}
              className={`text-xl font-light uppercase tracking-tighter ${activeTab === "stake" ? "text-white" : "text-white/20"}`}
            >
              Deploy_Stake
            </button>
          </div>
        </header>

        <div className="space-y-6">
          {activeTab === "stake" && (
            <div>
              <label className="block font-mono text-[8px] text-slate-500 uppercase mb-2">Strategy_Selection</label>
              <select 
                value={planId} 
                onChange={(e) => setPlanId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-4 text-xs font-mono text-brand-gold uppercase outline-none focus:border-brand-gold transition-colors"
              >
                <option value="PRIME_30">PRIME_30 (13% Monthly)</option>
                <option value="PRIME_150">PRIME_150 (150% Annual)</option>
                <option value="PRIME_3200">PRIME_3200 (3200% Decade)</option>
              </select>
            </div>
          )}

          <div>
            <label className="block font-mono text-[8px] text-slate-500 uppercase mb-2">
              {activeTab === "balance" ? "Delta_Amount (USD)" : "Principal_Amount (USD)"}
            </label>
            <input 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-4 text-2xl font-mono text-white outline-none focus:border-brand-gold transition-colors"
            />
          </div>

          <div className="p-4 bg-white/5 border border-white/5 space-y-2">
             <p className="font-mono text-[8px] text-slate-500 uppercase">Current_User_Equity</p>
             <p className="text-sm font-mono text-white">
                $ {user.balances.find(b => b.currency === 'USD')?.amount.toLocaleString() || "0.00"}
             </p>
          </div>

          <button 
            disabled={loading || !amount}
            onClick={handleAction}
            className="group relative w-full bg-white text-black py-5 font-bold uppercase text-[10px] tracking-[0.3em] overflow-hidden hover:bg-brand-gold transition-all"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/5 to-transparent group-hover:animate-[loading-scan_1.5s_infinite]" />
            {loading ? "EXECUTING_COMMAND..." : "AUTHORIZE_CHANGES"}
          </button>
        </div>
      </div>
    </div>
  );
}