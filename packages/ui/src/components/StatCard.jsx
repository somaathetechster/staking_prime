export default function StatCard({ label, value, sub }) {
  return (
    <div className="rounded-[2rem] bg-brand-gray border border-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.8)] p-6 transition-all hover:border-brand-gold/20 group">
      <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold mb-3 transition-colors group-hover:text-brand-gold">
        {label}
      </p>
      
      <p className="text-3xl font-light tracking-tight text-white">
        {value}
      </p>
      
      {sub && (
        <p className="mt-2 text-[11px] text-gray-500 leading-relaxed font-light">
          {sub}
        </p>
      )}
      
      {/* Subtle bottom accent line */}
      <div className="mt-4 h-[1px] w-8 bg-brand-gold/30 transition-all group-hover:w-full group-hover:bg-brand-gold/50" />
    </div>
  );
}