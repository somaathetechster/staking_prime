export default function LogoTower() {
  return (
    <div className="flex items-center gap-4 group transition-all">
      <div className="relative h-10 w-10 rounded-2xl bg-black border border-brand-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.15)] overflow-hidden flex items-end justify-center transition-transform group-hover:scale-105">
        
        {/* The "Tower" Bars */}
        <div className="flex gap-[3px] items-end h-full px-[8px] pb-[8px] relative z-10">
          <div className="w-[5px] h-[40%] bg-brand-gold/30 rounded-full transition-all group-hover:h-[45%]" />
          <div className="w-[5px] h-[65%] bg-brand-gold/60 rounded-full transition-all group-hover:h-[75%]" />
          <div className="w-[5px] h-[90%] bg-brand-gold rounded-full transition-all group-hover:h-[95%]" />
        </div>

        {/* Abstract Architectural Accent */}
        <div className="absolute inset-y-2 right-1 w-6 h-6 border-[1.5px] border-brand-gold/40 rounded-full border-l-transparent border-b-transparent opacity-50 rotate-[15deg]" />
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold/10 to-transparent opacity-50" />
      </div>

      <div className="leading-tight">
        <p className="text-[9px] uppercase tracking-[0.45em] text-gray-500 font-bold mb-0.5">
          Primestakecorp
        </p>
        <p className="text-sm font-light tracking-tight text-white flex items-center gap-1.5">
          <span className="font-semibold text-brand-gold">Private</span> Yield Desk
        </p>
      </div>
    </div>
  );
}