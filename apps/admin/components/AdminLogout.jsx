"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLogout() {
  const router = useRouter();
  const [isTerminating, setIsTerminating] = useState(false);

  const handleLogout = async () => {
    // Prevent double-taps on mobile
    if (isTerminating) return; 
    
    setIsTerminating(true);

    try {
      // 1. Call API to clear cookies
      await fetch("/api/auth/logout", { method: "POST" });
      
      // Institutional styled toast
      toast.info("Session Terminated.", {
        className: 'font-mono text-[10px] uppercase tracking-widest bg-black text-red-500 border border-red-900/50 rounded-none'
      });
      
      // 2. Redirect to Login
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
      setIsTerminating(false); // Reset if network fails
      toast.error("Termination Failed");
    }
  };

  return (
    <button 
      onClick={handleLogout}
      disabled={isTerminating}
      className="group flex items-center justify-center sm:justify-start gap-3 w-full px-4 py-4 sm:py-3 text-red-500 hover:bg-red-900/10 hover:text-red-400 active:scale-[0.98] transition-all border-t border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isTerminating ? (
        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
      ) : (
        <LogOut className="w-4 h-4 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
      )}
      
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold whitespace-nowrap">
        {isTerminating ? "Terminating..." : "Terminate_Session"}
      </span>
    </button>
  );
}