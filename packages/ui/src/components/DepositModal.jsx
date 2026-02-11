"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react"; // Assuming you have this or similar installed

// Simulated Wallet Addresses (In prod, fetch these via API)
const WALLETS = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  USDT: "T9yD14Nj9j7xAB4dbGeiX9h8veHsn9sdfs"
};

export default function DepositModal({ isOpen, onClose }) {
  const [network, setNetwork] = useState("BTC");
  const [copied, setCopied] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Decryption effect when network changes
  useEffect(() => {
    setIsDecrypting(true);
    const timer = setTimeout(() => setIsDecrypting(false), 800);
    return () => clearTimeout(timer);
  }, [network]);

  const handleCopy = () => {
    navigator.clipboard.writeText(WALLETS[network]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 1. BACKDROP BLUR & DIM */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-sm cursor-pointer"
      />

      {/* 2. THE VAULT CONTAINER */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="relative w-full max-w-2xl bg-[#050505] border border-white/10 p-1 lg:p-1 overflow-hidden shadow-[0_0_100px_rgba(212,175,55,0.1)]"
      >
        {/* Decorative Construction Lines */}
        <div className="absolute top-0 left-10 w-[1px] h-full bg-white/5" />
        <div className="absolute top-10 right-0 w-full h-[1px] bg-white/5" />
        
        <div className="relative bg-[#080808] p-10 lg:p-12 border border-white/5">
           
           {/* HEADER */}
           <div className="flex justify-between items-start mb-12 relative z-10">
              <div className="space-y-2">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-brand-gold animate-pulse" />
                    <p className="font-mono text-[9px] uppercase tracking-[0.4em] text-brand-gold font-bold">Inbound_Allocation</p>
                 </div>
                 <h2 className="text-4xl font-light text-white tracking-tighter uppercase">
                    Secure <span className="text-white/20">Vault</span>
                 </h2>
              </div>
              
              <button 
                onClick={onClose}
                className="group flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors"
              >
                [ Close_Vault ]
                <span className="w-6 h-[1px] bg-slate-700 group-hover:bg-white transition-colors" />
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
              
              {/* LEFT COLUMN: NETWORK SELECTOR & ADDRESS */}
              <div className="space-y-10">
                 
                 {/* Network "Frequency" Tuner */}
                 <div className="space-y-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600">Select_Network_Protocol</p>
                    <div className="flex gap-2">
                       {Object.keys(WALLETS).map((net) => (
                          <button
                            key={net}
                            onClick={() => setNetwork(net)}
                            className={`flex-1 py-4 border text-[10px] font-bold uppercase tracking-widest transition-all ${
                               network === net 
                               ? "bg-brand-gold text-black border-brand-gold shadow-[0_0_20px_rgba(212,175,55,0.3)]" 
                               : "bg-transparent text-slate-500 border-white/10 hover:border-white/30 hover:text-white"
                            }`}
                          >
                             {net}
                          </button>
                       ))}
                    </div>
                 </div>

                 {/* The Address Display */}
                 <div className="space-y-4">
                    <div className="flex justify-between">
                       <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-slate-600">Public_Key_Address</p>
                       {copied && <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#00E5FF]">Copied_To_Clipboard</span>}
                    </div>
                    
                    <div 
                       onClick={handleCopy}
                       className="group relative cursor-pointer"
                    >
                       <div className="absolute -inset-4 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-md" />
                       <p className={`relative font-mono text-sm md:text-base break-all leading-relaxed transition-all duration-300 ${
                          isDecrypting ? "text-brand-gold blur-[2px]" : "text-white blur-0"
                       }`}>
                          {WALLETS[network]}
                       </p>
                       <div className="absolute -bottom-2 left-0 h-[1px] w-0 bg-brand-gold group-hover:w-full transition-all duration-700" />
                    </div>
                 </div>

                 {/* Warning Block */}
                 <div className="p-4 border-l-2 border-brand-gold bg-brand-gold/5">
                    <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-brand-gold/80 leading-relaxed">
                       Warning: Ensure the network protocol matches exactly. <br/>
                       Irreversible asset loss may occur on mismatch.
                    </p>
                 </div>
              </div>

              {/* RIGHT COLUMN: QR CONTAINMENT FIELD */}
              <div className="flex flex-col items-center justify-center">
                 <div className="relative p-6 border border-white/10 bg-black/50 backdrop-blur-md">
                    {/* Corner Brackets */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t border-l border-brand-gold" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t border-r border-brand-gold" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b border-l border-brand-gold" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b border-r border-brand-gold" />
                    
                    {/* Scanline Animation over QR */}
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-20 bg-[linear-gradient(to_bottom,transparent_0%,#00E5FF_50%,transparent_100%)] bg-[length:100%_4px] animate-[loading-scan_2s_linear_infinite]" />
                    
                    <div className="relative z-10 bg-white p-4">
                       <QRCodeSVG 
                          value={WALLETS[network]} 
                          size={180}
                          level="H"
                       />
                    </div>
                 </div>
                 <p className="mt-6 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-600">
                    Scan_For_Direct_Link
                 </p>
              </div>

           </div>
           
           {/* Decorative Footer */}
           <div className="mt-12 pt-6 border-t border-white/5 flex justify-between font-mono text-[7px] uppercase tracking-[0.3em] text-slate-700">
              <span>Encryption: AES-256</span>
              <span>Session_ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
           </div>

        </div>
      </motion.div>
    </div>
  );
}