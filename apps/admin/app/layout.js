import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import { Sidebar } from "@primestakecorp/ui";
import { Toaster } from "sonner"; 
import { Shield, LayoutDashboard, Settings, Activity } from "lucide-react"; 
import AdminLogout from "../components/AdminLogout"; 
import "@primestakecorp/ui/styles.css";

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
      <body className="antialiased bg-brand-black text-slate-200 h-screen lg:h-full overflow-hidden selection:bg-signal-cyan selection:text-black flex flex-col lg:block">
        
        {/* TACTICAL GRID OVERLAY */}
        <div className="fixed inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

        {/* GLOBAL INTERFACE CONTAINER */}
        <div className="relative z-10 flex flex-1 h-full overflow-hidden">
          
          {/* A. DESKTOP NAVIGATION NODE */}
          <aside className="hidden lg:flex flex-col w-[280px] border-r border-white/5 bg-brand-black/50 backdrop-blur-xl shrink-0">
            <div className="flex-1 overflow-y-auto scrollbar-none">
              {/* Note: We pass isAdmin={true} to trigger the Admin Navigation in the Sidebar component */}
              <Sidebar isAdmin={true} userStatus="approved" />
            </div>
            
            <div className="mt-auto bg-black/20">
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

          {/* B. MAIN VIEWPORT */}
          <main className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-brand-black via-[#050505] to-brand-black overflow-hidden relative pb-16 lg:pb-0">
            
            {/* HUD HEADER */}
            <header className="h-14 sm:h-16 border-b border-white/5 flex items-center justify-between px-4 sm:px-8 bg-brand-black/90 backdrop-blur-md shrink-0 sticky top-0 z-20">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-signal-green rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)] flex-shrink-0" />
                <span className="font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-400 whitespace-nowrap">
                  System_Secure <span className="hidden sm:inline">// Oversight_LX</span>
                </span>
              </div>
              <div className="font-mono text-[8px] sm:text-[10px] text-gray-600 uppercase tracking-widest text-right">
                <span className="hidden sm:inline">{new Date().toISOString().split('T')[0]} <span className="text-gray-800">|</span> </span>
                INTERNAL_AUDIT
              </div>
            </header>

            {/* CONTENT INJECTOR */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {children}
            </div>
          </main>
        </div>

        {/* C. MOBILE BOTTOM NAVIGATION */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-black/95 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
          <Link href="/" className="flex flex-col items-center justify-center w-16 h-full text-brand-gold">
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Hub</span>
          </Link>
          
          <Link href="/users" className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-white transition-colors">
            <Shield className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Access</span>
          </Link>

          <Link href="/payouts" className="flex flex-col items-center justify-center w-16 h-full text-gray-500 hover:text-white transition-colors">
            <Activity className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Queue</span>
          </Link>

          {/* Minimal Mobile Logout */}
          <div className="w-16 h-full flex items-center justify-center scale-75 origin-center">
             <AdminLogout />
          </div>
        </nav>

        {/* 5. NOTIFICATION TOASTER (Institutional Styled) */}
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
              letterSpacing: '0.1em',
              borderRadius: '0px'
            }
          }}
        />

      </body>
    </html>
  );
}