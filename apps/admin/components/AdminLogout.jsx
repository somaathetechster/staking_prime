"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    // 1. Call API to clear cookies
    await fetch("/api/auth/logout", { method: "POST" });
    
    toast.info("Session Terminated.");
    
    // 2. Redirect to Login
    router.push("/login");
  };

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-500 hover:bg-red-900/10 hover:text-red-400 transition-colors border-t border-white/5"
    >
      <LogOut className="w-4 h-4" />
      <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-bold">
        Terminate_Session
      </span>
    </button>
  );
}