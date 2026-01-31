"use client";
import { useState } from "react";

export default function Auth({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    if (isLoginMode) {
      // 1. TERMINAL LOGIN LOGIC
      // Here you would call your API to check: 
      // a) Credentials match b) User.status === 'APPROVED'
      console.log("Attempting terminal access for:", email);
      
      // Example failure state for unapproved users:
      // setStatusMessage("Access Denied: Your account is currently in the vetting queue.");
    } else {
      // 2. REQUEST ACCESS LOGIC
      // Send data to Admin Vetting Queue
      console.log("Sending request to admin for:", email);
      setStatusMessage("Request Received. Our vetting team is reviewing your credentials and will be in touch shortly.");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-950 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
        <header className="mb-8">
          <p className="text-brand-gold font-bold tracking-[0.3em] text-[10px] uppercase mb-4">
            Institutional Access
          </p>
          <h1 className="text-3xl font-light text-white mb-2">
            {isLoginMode ? "Terminal Login" : "Request Access"}
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            {isLoginMode 
              ? "Access the Private Yield Desk with your registered credentials." 
              : "Register your interest for institutional-grade staking."}
          </p>
        </header>

        {statusMessage ? (
          <div className="bg-brand-gold/10 border border-brand-gold/20 p-6 rounded-2xl text-center">
            <p className="text-brand-gold text-sm leading-relaxed">{statusMessage}</p>
            <button 
              onClick={() => setStatusMessage("")}
              className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 hover:text-white"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1">Work Email Address</label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="principal@familyoffice.com"
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold/50 outline-none transition-all placeholder:text-slate-800"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-slate-500 ml-1">Password</label>
              <input 
                name="password"
                type="password" 
                required
                placeholder="••••••••"
                className="w-full bg-black border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-brand-gold/50 outline-none transition-all placeholder:text-slate-800"
              />
            </div>

            <button className="w-full bg-brand-gold hover:bg-brand-gold-muted text-black font-bold py-4 rounded-2xl transition-all uppercase tracking-widest text-xs shadow-lg shadow-brand-gold/10">
              {isLoginMode ? "Access Terminal" : "Request Access"}
            </button>

            <div className="text-center pt-4">
              <button 
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-[11px] text-slate-500 hover:text-brand-gold transition-colors underline underline-offset-4"
              >
                {isLoginMode ? "Need to request a new account?" : "Already have an approved account?"}
              </button>
            </div>
          </form>
        )}

        <footer className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-slate-700">
            © 2026 Primestakecorp · Secured Terminal
          </p>
        </footer>
      </div>
    </div>
  );
}