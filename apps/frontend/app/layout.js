import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import { LayoutDashboard, ArrowUpRight, History, Settings } from "lucide-react";
import "@primestakecorp/ui/styles.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["300", "400", "600"],
});

export const metadata = {
  title: "PRIMESTAKE | SECURE CLIENT TERMINAL",
  description: "Institutional Asset Management & Private Wealth Interface.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false,
  themeColor: "#020202",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased font-sans bg-[#020202] text-white selection:bg-brand-gold selection:text-black min-h-screen flex flex-col relative overflow-x-hidden">
        
        {/* TACTICAL GRID OVERLAY */}
        <div className="fixed inset-0 z-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* 1. DESKTOP NAVIGATION HUD */}
        <nav className="hidden lg:flex relative z-50 h-20 border-b border-white/5 bg-black/50 backdrop-blur-xl items-center justify-between px-12">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-xl tracking-tighter font-bold text-white">
              PRIME<span className="text-brand-gold">STAKE</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
              <Link href="/" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/withdraw" className="hover:text-white transition-colors text-brand-gold">Withdraw</Link>
              <Link href="/transactions" className="hover:text-white transition-colors">Ledger</Link>
            </div>
          </div>
          <div className="flex items-center gap-4 font-mono text-[9px] text-slate-500 uppercase">
            <span className="flex items-center gap-2">
              <div className="h-1 w-1 bg-signal-green rounded-full animate-pulse" />
              Secure_Connection
            </span>
          </div>
        </nav>

        {/* 2. MAIN CONTENT AREA */}
        <main className="relative z-10 flex-1 flex flex-col min-w-0 pb-24 lg:pb-0">
          {children}
        </main>

        {/* 3. MOBILE TACTICAL DOCK (Bottom Navigation) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/90 backdrop-blur-2xl border-t border-white/10 z-50 flex items-center justify-around px-4 pb-safe">
          <Link href="/" className="flex flex-col items-center justify-center w-16 h-full text-white/40 hover:text-brand-gold transition-all active:scale-90">
            <LayoutDashboard className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Home</span>
          </Link>

          <Link href="/withdraw" className="flex flex-col items-center justify-center w-16 h-full text-brand-gold active:scale-90">
            <ArrowUpRight className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Exit</span>
          </Link>

          <Link href="/transactions" className="flex flex-col items-center justify-center w-16 h-full text-white/40 hover:text-white transition-all active:scale-90">
            <History className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Logs</span>
          </Link>

          <Link href="/settings" className="flex flex-col items-center justify-center w-16 h-full text-white/40 hover:text-white transition-all active:scale-90">
            <Settings className="w-5 h-5 mb-1" />
            <span className="font-mono text-[7px] uppercase tracking-widest">Auth</span>
          </Link>
        </nav>

        {/* GLOBAL NOTIFICATIONS */}
        <Toaster 
          theme="dark" 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#050505',
              border: '1px solid rgba(212,175,55,0.3)',
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