"use client";

import { useRouter, usePathname } from "next/navigation";
import LogoTower from "./LogoTower";
import { motion } from "framer-motion";

export default function Sidebar({ isAdmin = false, currentView, userStatus }) {
  const router = useRouter();
  const pathname = usePathname(); // Detects current URL
  const isApproved = userStatus === "approved" || isAdmin;

  // 1. DYNAMIC NAVIGATION LOGIC
  // If admin, we use routes. If user, we use the View state.
  const navItems = isAdmin 
    ? [
        { label: "Oversight_Hub", path: "/", status: "LIVE" },
        { label: "Global_Directory", path: "/users", status: "AUDIT" },
        { label: "Settlement_Queue", path: "/payouts", status: "QUEUE" },
      ]
    : [
        { label: "Portfolio", path: null, view: "dashboard", status: "LIVE_FEED" },
        { label: "Liquidity_Lines", path: "/withdraw", view: null, status: "EXIT" },
        { label: "Audit_Ledger", path: "/transactions", view: null, status: "LOGS" },
      ];

  return (
    <aside className="hidden lg:flex w-72 flex-col border-r border-tech-900 bg-brand-black px-8 py-10 h-full">
      <div className="mb-16">
        <LogoTower />
      </div>

      <nav className="flex-1 space-y-12">
        <section>
          <p className="font-mono-data text-[9px] text-tech-600 mb-6 uppercase tracking-[0.5em]">
            {isAdmin ? "Oversight_Navigation" : "Terminal_Navigation"}
          </p>

          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive = isAdmin 
                ? pathname === item.path 
                : currentView === item.view;

              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.path) router.push(item.path);
                    // Add view switching for the client-side dashboard if needed
                  }}
                  disabled={!isApproved}
                  className={`group relative w-full flex items-center justify-between border py-4 px-5 transition-all duration-300 ${
                    isActive
                      ? "bg-brand-obsidian border-tech-800 text-white"
                      : isApproved
                      ? "border-transparent hover:border-tech-800 text-tech-600 hover:text-white"
                      : "border-transparent opacity-30 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <div className={`h-1.5 w-1.5 transition-all ${
                      isActive 
                        ? "bg-brand-gold glow-gold shadow-[0_0_8px_rgba(212,175,55,0.4)]" 
                        : isApproved ? "bg-signal-cyan" : "bg-tech-700"
                    }`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  
                  <span className="font-mono-data text-[7px] text-tech-700 opacity-70 uppercase tracking-tighter">
                    {item.status}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute left-0 w-[2px] h-full bg-brand-gold" 
                    />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </nav>

      {/* FOOTER VITALS */}
      <div className="mt-auto pt-10 border-t border-tech-900 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-[8px] text-tech-700 uppercase">System_Mode</span>
            <span className="font-mono-data text-[9px] text-brand-gold uppercase">
              {isAdmin ? "Oversight_LX" : "Client_Node"}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-mono-data text-[8px] text-tech-700 uppercase">Connection</span>
            <span className="font-mono-data text-[9px] text-signal-green animate-pulse">ENCRYPTED</span>
          </div>
        </div>

        <div className="bg-tech-900/30 border border-tech-900 p-4">
          <p className="text-[10px] text-tech-700 leading-relaxed font-mono italic uppercase tracking-tighter">
            {isAdmin 
              ? "Administrator actions are logged to the immutable audit ledger."
              : "Terminal connection encrypted via node_v4.2."}
          </p>
        </div>
      </div>
    </aside>
  );
}