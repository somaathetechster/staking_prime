"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert, Lock, Fingerprint, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Identity Verified. Initializing Command Link...");
        setTimeout(() => router.push("/"), 800);
      } else {
        toast.error(data.message || "ACCESS_DENIED: Invalid Credentials");
      }
    } catch (err) {
      toast.error("NETWORK_FAILURE: Secure Uplink Unreachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:h-screen bg-brand-black flex items-start sm:items-center justify-center relative overflow-hidden">
      
      {/* 1. Background Texture */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* 2. Red Alert Gradient (Subtle) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-900/50 to-transparent z-20" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full sm:max-w-md min-h-screen sm:min-h-[auto] bg-[#050505] sm:border border-white/5 relative z-10 shadow-none sm:shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col justify-center sm:block"
      >
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col items-center text-center space-y-4 pt-12 sm:pt-8">
          <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-900/10 border border-red-900/30 flex items-center justify-center rounded-full flex-shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-[0.2em] uppercase">Restricted Access</h1>
            <p className="text-[9px] sm:text-[10px] text-gray-500 uppercase tracking-widest mt-1 sm:mt-2">
              Authorized Personnel Only • IP Logged
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-6 flex-1 sm:flex-none flex flex-col justify-center">
          <div className="space-y-4">
            <div className="group relative">
              <Fingerprint className="absolute left-4 top-3.5 sm:top-3.5 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
              <input 
                type="email" 
                required
                placeholder="OPERATOR_ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 py-3 pl-12 pr-4 font-mono text-sm sm:text-sm text-white focus:border-white/30 outline-none transition-all placeholder:text-gray-700 rounded-none appearance-none"
              />
            </div>
            <div className="group relative">
              <Lock className="absolute left-4 top-3.5 sm:top-3.5 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
              <input 
                type="password" 
                required
                placeholder="SECURE_KEY"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 py-3 pl-12 pr-4 font-mono text-sm sm:text-sm text-white focus:border-white/30 outline-none transition-all placeholder:text-gray-700 rounded-none appearance-none"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-4 sm:mt-0"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating...</span>
            ) : (
              <>
                <span>Initialize Session</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="p-4 bg-white/[0.01] border-t border-white/5 text-center mt-auto sm:mt-0 pb-safe">
          <p className="text-[8px] sm:text-[9px] text-red-900/60 uppercase tracking-widest font-mono leading-relaxed">
            Unauthorized access attempts will be prosecuted.
          </p>
        </div>
      </motion.div>
    </div>
  );
}