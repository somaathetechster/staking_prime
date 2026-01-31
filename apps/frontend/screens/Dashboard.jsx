"use client";

import { useState } from "react";
// Import from shared UI package instead of local components
import { StatCard, ProgramCard } from "@primestakecorp/ui";
import { PROGRAMS } from "../config/programs";

export default function Dashboard({
  walletBalance,
  stakedBalance,
  nextPayout,
  onOpenDeposit,
  onOpenVerify,
  onOpenStake,
  isVerified,
}) {
  const [calcProgram, setCalcProgram] = useState(PROGRAMS.monthly);
  const [calcAmount, setCalcAmount] = useState(100000);

  const profit = calcAmount && calcProgram ? calcAmount * calcProgram.rate : 0;
  const total = calcAmount + profit;

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 lg:py-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Main Portfolio Card */}
        <div className="md:col-span-2 rounded-3xl bg-gradient-to-br from-brand-black via-brand-gray to-brand-black border border-white/5 shadow-[0_28px_90px_rgba(0,0,0,0.85)] p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Total portfolio value
              </p>
              <p className="mt-2 text-3xl lg:text-4xl font-semibold tracking-tight text-white">
                {`$${(walletBalance + stakedBalance).toLocaleString()}`}
              </p>
            </div>
            <div className="text-right text-[11px] text-slate-400">
              <p>Environment: Live-Ops</p>
              <p>
                Verification: {isVerified ? "Verified principal" : "Not verified"}
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-400">
            Allocate your unique BTC and USDT deposits into Prime30, Prime150 and
            Prime3200 programs to generate yield.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <button
              onClick={onOpenDeposit}
              className="inline-flex items-center gap-2 rounded-full bg-brand-gold text-black px-4 py-2 font-bold hover:bg-brand-gold-muted transition-colors"
            >
              Deposit assets
            </button>
            <button
              onClick={onOpenVerify}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-200 hover:bg-white/5 transition-colors"
            >
              {isVerified ? "Review verification" : "Verify identity"}
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
            </button>
          </div>
        </div>

        <StatCard
          label="Staked balance"
          value={`$${stakedBalance.toLocaleString()}`}
          sub="Allocated across Prime programs."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <StatCard
          label="Next payout"
          value={nextPayout ? nextPayout : "—"}
          sub="Appears after your first mock stake."
        />

        <div className="lg:col-span-2 rounded-3xl bg-brand-gray/80 border border-white/5 shadow-[0_22px_80px_rgba(0,0,0,0.85)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">
              Access controls & onboarding
            </h2>
            <span className="text-[11px] rounded-full border border-white/10 bg-black px-2 py-0.5 text-slate-400">
              2-step: Sign + verify
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your account is currently <span className="text-brand-gold font-medium">Approved</span>. 
            All capital movements are subject to institutional risk assessment.
          </p>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="rounded-3xl bg-brand-gray/80 border border-white/5 shadow-[0_22px_80px_rgba(0,0,0,0.85)] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Prime return calculator
            </h2>
            <p className="text-xs text-slate-400">
              Preview projected profit and total payout for each line.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
          <div className="space-y-3">
            <label className="block text-[11px] text-slate-500 uppercase tracking-widest">
              Amount (USD Notional)
            </label>
            <input
              type="number"
              min="0"
              value={calcAmount}
              onChange={(e) => setCalcAmount(Number(e.target.value || 0))}
              className="w-full rounded-xl bg-black border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            />
            <label className="block text-[11px] text-slate-500 uppercase tracking-widest">
              Program
            </label>
            <select
              value={calcProgram.id}
              onChange={(e) => setCalcProgram(PROGRAMS[e.target.value])}
              className="w-full rounded-xl bg-black border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-gold"
            >
              {Object.values(PROGRAMS).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Projected profit
            </p>
            <p className="text-2xl font-semibold text-brand-gold">
              {calcAmount > 0
                ? `$${profit.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`
                : "—"}
            </p>
            <p className="text-[11px] text-slate-500">
              Based on program headline yield.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
              Total payout at term
            </p>
            <p className="text-2xl font-semibold text-white">
              {calcAmount > 0
                ? `$${total.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}`
                : "—"}
            </p>
            <p className="text-[11px] text-slate-500">
              Principal + projected return.
            </p>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Prime staking programs
            </h2>
            <p className="text-xs text-slate-400">
              Three distinct lines for different horizons.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Object.values(PROGRAMS).map((p) => (
            <ProgramCard key={p.id} program={p} onStakeClick={onOpenStake} />
          ))}
        </div>
      </section>

      <footer className="pt-6 text-[10px] text-slate-600 text-center border-t border-white/5 uppercase tracking-[0.2em]">
        &copy; 2026 Primestakecorp &middot; Private Yield Desk
      </footer>
    </div>
  );
}