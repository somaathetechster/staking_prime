"use client";

export default function CurrencyManager({ rates, onUpdate }) {
  const symbols = Object.keys(rates);

  return (
    <div className="bg-brand-gray border border-white/5 rounded-2xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-light text-white">Rate Authority Control</h2>
        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Priority: Admin {">"} API</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {symbols.map((symbol) => (
          <div key={symbol} className="bg-black/40 border border-white/5 rounded-xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-white">{symbol}</span>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] uppercase font-bold ${rates[symbol].useManual ? 'text-brand-gold' : 'text-gray-600'}`}>
                  {rates[symbol].useManual ? 'Manual Active' : 'Market Auto'}
                </span>
                {/* Authority Toggle */}
                <button
                  onClick={() => onUpdate(symbol, 'useManual', !rates[symbol].useManual)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${rates[symbol].useManual ? 'bg-brand-gold' : 'bg-gray-800'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rates[symbol].useManual ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-2">Admin Rate</label>
                <input
                  type="number"
                  value={rates[symbol].adminRate || ""}
                  onChange={(e) => onUpdate(symbol, 'adminRate', e.target.value)}
                  placeholder="Set manual"
                  className="w-full bg-black border border-white/10 rounded-lg px-3 py-2 text-white focus:border-brand-gold outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase text-gray-500 mb-2">Market Price</label>
                <div className="px-3 py-2 text-sm text-gray-400 bg-white/5 rounded-lg border border-transparent">
                  ${rates[symbol].marketRate.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}