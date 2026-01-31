import LogoTower from "./LogoTower";

export default function Navbar({ onGoMarketing, onGoDashboard, onGoAuth, isApproved }) {
  return (
    <header className="w-full flex items-center justify-between border-b border-white/5 bg-brand-black/80 backdrop-blur-2xl px-4 lg:px-10 py-5 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <div className="cursor-pointer" onClick={onGoMarketing}>
          <LogoTower />
        </div>
        
        <div className="hidden lg:block h-8 w-[1px] bg-white/10" />

        <div className="hidden lg:block">
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-gold font-bold">
            Private Institutional Access
          </p>
          <p className="text-[11px] text-gray-500 font-light tracking-wide">
            Secure Terminal &middot; Verified Principals Only
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold">
        <button
          onClick={onGoMarketing}
          className="hidden md:inline-flex px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Market Overview
        </button>
        
        {!isApproved && (
          <button
            onClick={onGoAuth}
            className="hidden md:inline-flex px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            Terminal Login
          </button>
        )}

        <button
          onClick={isApproved ? onGoDashboard : onGoAuth}
          className={`px-6 py-2.5 rounded-full transition-all duration-300 shadow-lg ${
            isApproved 
              ? "bg-white text-black hover:bg-gray-200 shadow-white/5" 
              : "bg-brand-gold text-black hover:bg-brand-gold-muted shadow-brand-gold/10"
          }`}
        >
          {isApproved ? "Enter Active Desk" : "Request Access"}
        </button>
      </div>
    </header>
  );
}