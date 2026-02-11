import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Sidebar } from "@primestakecorp/ui";
import { Toaster } from "sonner"; 
import AdminLogout from "../components/AdminLogout"; // <--- INTEGRATED HERE
import "@primestakecorp/ui/styles.css";   // Ensure this imports your Tailwind setup

// 1. TYPOGRAPHY LOADERS
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "PRIMESTAKE | OVERSIGHT_NODE_V1",
  description: "Restricted Access: Institutional Control Environment",
  robots: "noindex, nofollow", 
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable} h-full`}>
      <body className="antialiased bg-brand-black text-slate-200 h-full overflow-hidden selection:bg-signal-cyan selection:text-black">
        
        {/* 2. THE TACTICAL GRID */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* 3. GLOBAL INTERFACE CONTAINER */}
        <div className="relative z-10 flex h-full">
          
          {/* NAVIGATION NODE */}
          {/* Changed to 'flex flex-col' to support pinned footer */}
          <aside className="hidden lg:flex flex-col w-[280px] border-r border-white/5 bg-brand-black/50 backdrop-blur-xl">
            
            {/* Top: Navigation Links */}
            <div className="flex-1 overflow-y-auto scrollbar-none">
              <Sidebar isAdmin={true} />
            </div>
            
            {/* Bottom: Control Footer */}
            <div className="mt-auto bg-black/20">
              {/* EJECT BUTTON */}
              <AdminLogout />

              {/* SYSTEM VITALS */}
              <div className="p-4 border-t border-white/5 space-y-2">
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-gray-500">
                  <span>Node_Latency</span>
                  <span className="text-signal-cyan">12ms</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-gray-500">
                  <span>Encryption</span>
                  <span className="text-brand-gold">AES-256</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN VIEWPORT */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-brand-black via-[#050505] to-brand-black">
            
            {/* HUD HEADER */}
            <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-brand-black/50 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-4">
                <div className="h-2 w-2 bg-signal-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-400">
                  System_Secure // Connected
                </span>
              </div>
              <div className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                {new Date().toISOString().split('T')[0]} <span className="text-gray-800">|</span> OVERSIGHT_MODE
              </div>
            </header>

            {/* CONTENT INJECTOR */}
            <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {children}
            </div>
          </main>

        </div>

        {/* 4. NOTIFICATION TOASTER */}
        <Toaster 
          theme="dark" 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#0a0a0a',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }
          }}
        />

      </body>
    </html>
  );
}