"use client";

import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("USDT");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency, destinationAddress: address })
      });

      if (res.ok) {
        toast.success("WITHDRAWAL_REQUEST_SUBMITTED");
        setAmount(""); setAddress("");
      } else {
        const data = await res.json();
        toast.error(data.error || "REQUEST_FAILED");
      }
    } catch (err) {
      toast.error("CONNECTION_ERROR");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-12">
      <header className="space-y-2">
        <p className="font-mono text-[9px] text-brand-gold uppercase tracking-[0.5em]">Capital_Exit_Gateway</p>
        <h1 className="text-4xl font-light tracking-tighter uppercase text-white">Request_Payout</h1>
      </header>

      <form onSubmit={handleWithdraw} className="space-y-8 bg-white/[0.02] border border-white/10 p-8 relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-brand-gold" />
        
        <div className="space-y-6">
          {/* ASSET SELECT */}
          <div className="space-y-2">
            <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Select_Asset</label>
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 font-mono text-xs text-white outline-none focus:border-brand-gold"
            >
              <option value="USDT">USDT (TRC20)</option>
              <option value="BTC">BTC (Bitcoin)</option>
            </select>
          </div>

          {/* DESTINATION ADDRESS */}
          <div className="space-y-2">
            <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">External_Destination_Address</label>
            <input 
              required
              placeholder="PASTE_ADDRESS_HERE..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 font-mono text-xs text-brand-gold outline-none focus:border-brand-gold"
            />
          </div>

          {/* AMOUNT */}
          <div className="space-y-2">
            <label className="font-mono text-[8px] text-slate-500 uppercase tracking-widest">Amount_To_Withdraw</label>
            <input 
              required
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-black border border-white/10 p-4 font-mono text-2xl text-white outline-none focus:border-brand-gold"
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-5 bg-white text-black font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-brand-gold transition-all active:scale-[0.98]"
        >
          {loading ? "PROCESSING_HANDSHAKE..." : "AUTHORIZE_PAYOUT"}
        </button>

        <p className="font-mono text-[7px] text-slate-600 uppercase text-center tracking-widest">
          Notice: Payouts are manually vetted for institutional compliance. Time-to-settlement: 1-6 Hours.
        </p>
      </form>
    </div>
  );
}