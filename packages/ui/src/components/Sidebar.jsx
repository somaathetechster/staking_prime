import LogoTower from "./LogoTower";

export default function Sidebar({ currentView, userStatus, onNavigateDashboard }) {
  const isApproved = userStatus === "approved";

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 bg-brand-black px-6 py-8">
      <LogoTower />

      <div className="mt-12 space-y-2 text-sm">
        <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 mb-4 font-bold">
          Private Terminal
        </p>

        {/* Portfolio / Dashboard Link */}
        <button
          onClick={isApproved ? onNavigateDashboard : null}
          disabled={!isApproved}
          className={
            "w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all " +
            (currentView === "dashboard"
              ? "bg-white/5 border border-white/10 text-white shadow-sm"
              : isApproved 
                ? "border border-transparent hover:bg-white/5 text-gray-400 hover:text-white" 
                : "opacity-40 cursor-not-allowed text-gray-600")
          }
        >
          <span className="flex items-center gap-3">
            <span className={`h-1.5 w-1.5 rounded-full ${isApproved ? "bg-brand-gold animate-pulse" : "bg-gray-600"}`} />
            <span className="font-medium tracking-tight">Portfolio</span>
          </span>
          {isApproved && (
            <span className="text-[9px] text-brand-gold border border-brand-gold/20 px-1.5 py-0.5 rounded uppercase tracking-widest font-bold">
              Live
            </span>
          )}
        </button>

        {/* Secondary Links (Placeholders for now) */}
        <div className="space-y-1 pt-4">
          {["Prime Programs", "Identity & Access", "Activity Ledger"].map((item) => (
            <div 
              key={item}
              className="w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-gray-500 text-xs font-light opacity-60 cursor-default"
            >
              <span>{item}</span>
              <svg className="w-3 h-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Status Section */}
      <div className="mt-auto pt-6 border-t border-white/5 text-[10px] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 uppercase tracking-widest">Desk Status</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold border ${
            isApproved 
            ? "border-brand-gold/20 bg-brand-gold/5 text-brand-gold" 
            : "border-white/10 bg-white/5 text-gray-500"
          }`}>
            <span className={`h-1 w-1 rounded-full ${isApproved ? "bg-brand-gold" : "bg-gray-600"}`} />
            {isApproved ? "ACTIVE" : "PENDING"}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 uppercase tracking-widest">Environment</span>
          <span className="text-white font-medium">Production Desk</span>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/5 mt-4">
          <p className="text-gray-500 leading-relaxed italic">
            Secure connection established via encrypted institutional gateway.
          </p>
        </div>
      </div>
    </aside>
  );
}