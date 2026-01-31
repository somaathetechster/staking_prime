export default function ProgramCard({ program, onStakeClick }) {
  const isDecade = program.id === "decade";
  const isAnnual = program.id === "annual";

  // Container styling with conditional gradients for depth
  const baseClasses =
    "relative rounded-[2.5rem] p-[1px] shadow-[0_20px_80px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-2 group";
  
  const innerClasses =
    "h-full rounded-[2.4rem] p-8 bg-brand-gray/95 flex flex-col justify-between backdrop-blur-sm overflow-hidden";

  return (
    <div
      className={
        baseClasses +
        " " +
        (isDecade
          ? "bg-gradient-to-br from-brand-gold via-brand-gold/20 to-transparent shadow-brand-gold/5"
          : isAnnual
          ? "bg-gradient-to-br from-white/20 via-white/5 to-transparent"
          : "bg-white/10")
      }
    >
      <div className={innerClasses}>
        {/* Subtle decorative background element */}
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-brand-gold/5 rounded-full blur-2xl group-hover:bg-brand-gold/10 transition-colors" />

        <div>
          <div className="flex items-start justify-between gap-3 relative z-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] mb-2 text-gray-500 font-bold">
                {program.label}
              </p>
              <h3 className="text-xl font-light text-white tracking-tight">
                {program.name}
              </h3>
            </div>
            <span className="text-[10px] uppercase tracking-widest rounded-full px-3 py-1 border border-white/10 bg-black/40 text-gray-400 font-medium">
              MIN: ${program.min.toLocaleString()}
            </span>
          </div>

          <div className="mt-8 relative z-10">
            <p className="text-4xl font-light tracking-tighter text-white">
              {program.headlineRate}
            </p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-gold mt-1 font-bold">
              Target Yield
            </p>
          </div>

          <ul className="mt-8 text-xs text-gray-400 space-y-3 font-light relative z-10">
            <li className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-brand-gold" />
              Allocation: ${program.min.toLocaleString()}+
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-brand-gold" />
              Maturity: {program.lock}
            </li>
            <li className="flex items-center gap-3">
              <span className="h-1 w-1 rounded-full bg-brand-gold" />
              Settlement: Principal + Staked Yield
            </li>
          </ul>
        </div>

        <button
          onClick={() => onStakeClick(program)}
          className={
            "mt-10 w-full text-[11px] uppercase tracking-[0.2em] font-bold rounded-full py-4 transition-all relative z-10 " +
            (isDecade
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-brand-gold text-black hover:bg-brand-gold-muted")
          }
        >
          {isDecade ? "Request Decade Allocation" : "Execute Stake"}
        </button>
      </div>
    </div>
  );
}