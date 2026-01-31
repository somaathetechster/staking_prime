"use client";

import { useState } from "react";

export default function AuthFlow({ onCompleteVerify }) {
  // Modes: 'login' for approved users, 'request' for new users
  const [mode, setMode] = useState("login"); 
  const [step, setStep] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      // We send the mode to the API so it knows whether to check for an 
      // existing approved user or start a new vetting request.
      const res = await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, mode }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep("verify");
      } else {
        // Handle specific "Not Approved" error
        setError(data.message || "Unable to process request. Please contact the desk.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, mode }),
      });

      const data = await res.json();

      if (data.success) {
        // If mode was 'request', data.status will be 'pending_review'
        onCompleteVerify(data.status);
      } else {
        setError("Invalid verification code.");
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 lg:px-12 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-white/5 bg-brand-black shadow-[0_30px_120px_rgba(0,0,0,0.9)] p-6 lg:p-10">
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-brand-gold font-bold mb-3">
            Institutional Access
          </p>
          <h2 className="text-2xl font-light text-white mb-2">
            {step === "signIn"
              ? (mode === "login" ? "Terminal Login" : "Request Access")
              : "Security Verification"}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {step === "signIn" 
              ? (mode === "login" 
                  ? "Access the Private Yield Desk. Please enter your registered professional credentials." 
                  : "Submit your credentials for institutional vetting.")
              : `A one-time security code has been sent to ${email}.`}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {step === "signIn" && (
          <form onSubmit={handleRequestOTP} className="space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-all"
                placeholder="principal@familyoffice.com"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-brand-gold text-black font-bold py-3 text-sm hover:bg-brand-gold-muted disabled:opacity-50 transition-colors"
            >
              {submitting ? "Processing..." : (mode === "login" ? "Access Terminal" : "Request Access")}
            </button>

            <div className="text-center pt-2">
               <button 
                type="button"
                onClick={() => setMode(mode === "login" ? "request" : "login")}
                className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-brand-gold transition-colors underline underline-offset-4"
              >
                {mode === "login" ? "Need to request access?" : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-xl bg-black border border-white/10 px-4 py-3 text-center text-xl tracking-[0.5em] text-white focus:outline-none focus:border-brand-gold transition-all"
                placeholder="000000"
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-white text-black font-bold py-3 text-sm hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Verifying..." : "Validate & Enter Desk"}
            </button>
            
            <button 
              type="button"
              onClick={() => setStep("signIn")}
              className="w-full text-[10px] uppercase tracking-widest text-gray-600 hover:text-gray-400 transition-colors"
            >
              Back to sign in
            </button>
          </form>
        )}

        <footer className="mt-10 pt-6 border-t border-white/5">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest text-center">
            &copy; 2026 Primestakecorp &middot; SECURED TERMINAL
          </p>
        </footer>
      </div>
    </div>
  );
}