"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthFlow({ onCompleteVerify }) {
  const [mode, setMode] = useState("login");
  const [step, setStep] = useState("protocol_select"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { setError(""); }, [mode, step]);

  const selectProtocol = (selectedMode) => {
    setMode(selectedMode);
    setStep("signIn");
  };

  const handleActionInitiated = (e) => {
    e.preventDefault();
    if (mode === "request") {
      setStep("compliance"); 
    } else {
      handleRequestOTP();
    }
  };

  const handleRequestOTP = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mode }),
      });
      if (res.ok) setStep("verify");
      else {
        const data = await res.json();
        setError(data.message || "PROTOCOL_RESTRICTION: ACCESS_DENIED");
        if (mode === "request" && step === "compliance") setStep("signIn");
      }
    } catch (err) {
      setError("NODE_ERROR: UPLINK_FAILED");
    } finally { setSubmitting(false); }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, mode }),
      });
      const data = await res.json();
      if (data.success) {
        onCompleteVerify(data.status);
      } else {
        setError("CRYPTOGRAPHIC_MISMATCH: INVALID_TOKEN");
      }
    } catch (err) {
      setError("VERIFICATION_NODE_OFFLINE");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Ensured container allows for scrolling if keyboard pops up
    <div className="flex-1 flex flex-col items-center justify-center bg-[#020202] font-sans selection:bg-brand-gold/30 px-4 py-8 sm:p-6 w-full">
      <motion.div 
        layout
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="w-full max-w-xl bg-[#050505] border border-white/10 px-6 py-10 sm:p-10 lg:p-16 relative shadow-none sm:shadow-[0_0_100px_rgba(0,0,0,1)]"
      >
        {/* Technical Vector Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <AnimatePresence mode="wait">
          
          {/* STATE 0: PROTOCOL SELECTION (The Fork) */}
          {step === "protocol_select" && (
            <motion.div
              key="protocol_select"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
              className="relative z-10 space-y-8 sm:space-y-10"
            >
              <div className="space-y-3 sm:space-y-4">
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-brand-gold font-bold">
                  Identify_Intent // 0x0
                </p>
                <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tighter uppercase leading-none">
                  Select <br className="hidden sm:block"/> <span className="text-white/40">Uplink Protocol</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => selectProtocol("login")}
                  className="group relative flex items-center justify-between w-full p-6 sm:p-8 border-[0.5px] border-white/10 bg-white/5 hover:bg-brand-gold hover:border-brand-gold transition-all duration-500 active:scale-[0.98]"
                >
                  <div className="text-left space-y-1.5 sm:space-y-2">
                    <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50 group-hover:text-black/60 transition-colors">Existing Principal</span>
                    <span className="block text-base sm:text-xl font-bold tracking-widest text-white group-hover:text-black transition-colors">ACCESS_TERMINAL</span>
                  </div>
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-brand-gold group-hover:bg-black transition-colors shrink-0 ml-4" />
                </button>

                <button 
                  onClick={() => selectProtocol("request")}
                  className="group relative flex items-center justify-between w-full p-6 sm:p-8 border-[0.5px] border-white/10 bg-transparent hover:border-white/40 transition-all duration-500 active:scale-[0.98]"
                >
                  <div className="text-left space-y-1.5 sm:space-y-2">
                    <span className="block font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/50">New Institution</span>
                    <span className="block text-base sm:text-xl font-light tracking-widest text-white">REQUEST_VETTING</span>
                  </div>
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 border border-white/20 group-hover:border-white transition-colors shrink-0 ml-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 1: CREDENTIAL INPUT */}
          {step === "signIn" && (
            <motion.div
              key="signIn"
              initial={{ opacity: 0, x: 20, filter: "blur(5px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(5px)" }}
              className="relative z-10"
            >
              <header className="mb-8 sm:mb-12">
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-brand-gold font-bold mb-4 sm:mb-6">
                  {mode === "login" ? "Identity_Auth" : "New_Application"} // Step_01
                </p>
                <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tighter leading-[1.1] sm:leading-none uppercase">
                  {mode === "login" ? "Terminal" : "Submit"} <br />
                  <span className="text-white/30">{mode === "login" ? "Login" : "Credentials"}</span>
                </h2>
              </header>

              {error && (
                <div className="mb-6 sm:mb-8 p-3 sm:p-4 border-l-2 border-red-500 bg-red-500/5 font-mono text-[9px] sm:text-[10px] text-red-400 uppercase tracking-widest leading-relaxed">
                  Error: {error}
                </div>
              )}

              <form onSubmit={handleActionInitiated} className="space-y-8 sm:space-y-10">
                <div className="space-y-6 sm:space-y-8">
                  <div className="group">
                    <label className="block text-[7px] sm:text-[8px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-500 font-bold mb-2 group-focus-within:text-brand-gold transition-colors">
                      Secure_Email_ID
                    </label>
                    <input
                      type="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-2 sm:py-3 font-mono text-sm text-white focus:border-brand-gold outline-none transition-all placeholder:text-gray-800 rounded-none appearance-none"
                      placeholder="PRINCIPAL@DOMAIN"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-[7px] sm:text-[8px] uppercase tracking-[0.3em] sm:tracking-[0.4em] text-gray-500 font-bold mb-2 group-focus-within:text-brand-gold transition-colors">
                      Auth_Passkey
                    </label>
                    <input
                      type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-white/10 py-2 sm:py-3 font-mono text-sm text-white focus:border-brand-gold outline-none transition-all placeholder:text-gray-800 rounded-none appearance-none"
                      placeholder="••••••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-2 sm:pt-4">
                  <button
                    type="submit" disabled={submitting}
                    className="w-full py-4 sm:py-5 bg-white text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-brand-gold transition-all active:scale-[0.98]"
                  >
                    {submitting ? "Handshaking..." : "[ Proceed_Next ]"}
                  </button>
                  <button type="button" onClick={() => setStep("protocol_select")} className="w-full py-2 text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600 hover:text-white transition-colors">
                    &lt; Return_To_Protocol
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STATE 2: COMPLIANCE (Request Only) */}
          {step === "compliance" && (
            <motion.div
              key="compliance"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, filter: "blur(10px)" }}
              className="relative z-10 space-y-8 sm:space-y-10"
            >
              <div className="space-y-4 sm:space-y-6">
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-brand-gold font-bold">
                  Vetting_Protocol // 0x2
                </p>
                <h2 className="text-3xl sm:text-4xl font-light text-white tracking-tight leading-none uppercase">
                  Institutional <span className="text-white/40">Audit</span>
                </h2>
                <div className="space-y-3 sm:space-y-4 font-mono text-[8px] sm:text-[9px] text-gray-500 uppercase tracking-[0.2em] sm:tracking-widest leading-relaxed border-l border-white/10 pl-4 sm:pl-6">
                  <p>Warning: This node is restricted to sovereign capital and family offices.</p>
                  <p>Your credentials will be subject to a 48hr manual audit cycle.</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleRequestOTP}
                  disabled={submitting}
                  className="w-full py-4 sm:py-5 bg-brand-gold text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-white transition-all active:scale-[0.98]"
                >
                  {submitting ? "Transmitting..." : "Accept & Encrypt"}
                </button>
                <button onClick={() => setStep("signIn")} className="w-full py-2 text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600 hover:text-white transition-colors">
                  [ Review_Data ]
                </button>
              </div>
            </motion.div>
          )}

          {/* STATE 3: OTP VERIFICATION */}
          {step === "verify" && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="relative z-10 space-y-8 sm:space-y-12"
            >
              <header>
                <p className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.3em] sm:tracking-[0.5em] text-[#00E5FF] font-bold mb-4 sm:mb-6">
                  Final_Handshake
                </p>
                <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tighter uppercase">
                  Verify <span className="text-white/30">Uplink</span>
                </h2>
              </header>

              <form onSubmit={handleVerifyOTP} className="space-y-8 sm:space-y-10">
                <input
                  type="text" required autoFocus maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-white/10 py-4 sm:py-6 text-center text-4xl sm:text-6xl tracking-[0.3em] sm:tracking-[0.5em] text-white font-mono focus:border-[#00E5FF] outline-none transition-all rounded-none appearance-none"
                  placeholder="000000"
                />
                
                <div className="space-y-4">
                  <button type="submit" disabled={submitting} className="w-full py-4 sm:py-6 bg-white text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] hover:bg-[#00E5FF] transition-all active:scale-[0.98]">
                    {submitting ? "Verifying..." : "[ Establish_Connection ]"}
                  </button>
                  <button onClick={() => setStep("signIn")} className="w-full py-2 text-[7px] sm:text-[8px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-gray-600 hover:text-white transition-colors">
                    Abort_Process
                  </button>
                </div>
              </form>
            </motion.div>
          )}

        </AnimatePresence>

        <footer className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/5 flex justify-between items-center font-mono text-[7px] sm:text-[8px] text-gray-700 uppercase tracking-[0.2em] sm:tracking-[0.4em]">
          <span>Secure_Node_v4</span>
          <span className="text-brand-gold">Encrypted</span>
        </footer>
      </motion.div>
    </div>
  );
}