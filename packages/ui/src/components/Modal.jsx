"use client";

export default function Modal({ open, title, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4">
      {/* Backdrop overlay */}
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-[2rem] bg-brand-gray border border-white/10 shadow-[0_32px_100px_rgba(0,0,0,0.9)] overflow-hidden transition-all scale-100">
        
        {/* Header with Gold Accent */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-white/5">
          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-1">
              Primestake Terminal
            </p>
            <h2 className="text-lg font-light text-white tracking-tight">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}