"use client";

import { StatCard } from "@primestakecorp/ui";

export default function MarketingPage({ onEnter }) {
  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-12 py-10 bg-brand-black">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
          
          {/* Left Column: Value Proposition */}
          <div className="space-y-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold mb-4">
                Institutional Staking Infrastructure
              </p>
              <h1 className="text-4xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
                Private capital. <br />
                <span className="text-brand-gold">Prime yields.</span>
              </h1>
              <p className="mt-6 text-gray-400 text-sm leading-relaxed max-w-md font-light">
                Secure your digital assets through our proprietary multi-horizon 
                staking programs. Precision execution for family offices and 
                institutional principals.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-xs">
              <button
                onClick={onEnter}
                className="px-8 py-3 rounded-full bg-brand-gold text-black font-bold hover:bg-brand-gold-muted transition-all shadow-lg shadow-brand-gold/10"
              >
                Access Private Desk
              </button>
              <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-white/5 bg-white/5 text-gray-400">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-gold animate-pulse" />
                <span className="uppercase tracking-widest text-[9px] font-bold">Node Status: Active</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5 text-[10px] text-gray-500 uppercase tracking-widest font-medium">
              <div className="space-y-2">
                <p className="text-white text-lg font-light tracking-normal">13% — 3200%</p>
                <p>Target Yields</p>
              </div>
              <div className="space-y-2">
                <p className="text-white text-lg font-light tracking-normal">T+0</p>
                <p>Settlement</p>
              </div>
              <div className="space-y-2">
                <p className="text-white text-lg font-light tracking-normal">24/7</p>
                <p>Desk Access</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Preview Card */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-brand-gold/5 blur-3xl rounded-full" />
            
            <div className="relative rounded-[2.5rem] bg-brand-gray border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.9)] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-1">
                    Terminal Preview
                  </p>
                  <h3 className="text-white font-light">Principal Account</h3>
                </div>
                <div className="h-2 w-2 rounded-full bg-brand-gold" />
              </div>

              <div className="grid grid-cols-1 gap-6 mb-8">
                <StatCard
                  label="Available Liquidity"
                  value="$0.00"
                  sub="Provisioned via unique deposit address."
                />
                <StatCard
                  label="Yield Programs"
                  value="Tier I / II / III"
                  sub="Prime30, Prime150, Prime3200"
                />
              </div>

              <p className="text-[10px] text-gray-600 leading-relaxed italic text-center uppercase tracking-tighter">
                Private Placement Memorandum Required for Full Disclosure
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-20 border-t border-white/5 pt-8 text-[10px] text-gray-600 max-w-5xl mx-auto flex flex-col md:flex-row justify-between gap-4 uppercase tracking-[0.2em]">
        <p>© 2026 Primestakecorp Institutional Services</p>
        <div className="flex gap-6">
          <span className="hover:text-brand-gold cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-brand-gold cursor-pointer transition-colors">Terms of Desk</span>
        </div>
      </footer>
    </div>
  );
}