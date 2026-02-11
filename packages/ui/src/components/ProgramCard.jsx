"use client";

import { motion } from "framer-motion";

export default function ProgramCard({ program, onStakeClick }) {
  const isDecade = program.id === "decade";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group relative bg-tech-900 p-[1px] transition-all duration-500"
    >
      {/* Background Glow Effect - Cyber Cyan for High Stakes */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex h-full flex-col justify-between bg-brand-obsidian p-8 lg:p-10 border border-tech-800 group-hover:border-tech-700 transition-colors">
        
        {/* Top Section: Identification */}
        <div className="relative z-10">
          <header className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="font-mono-data text-[9px] text-tech-600">
                {program.label || "Institutional_Line"}
              </p>
              <h3 className="text-3xl font-bold uppercase tracking-tighter text-white leading-[1.1]">
                {program.name}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="glow-cyan h-2 w-2 rounded-full bg-signal-cyan" />
              <span className="font-mono-data text-[8px] text-tech-700">PRM-SYS-v4</span>
            </div>
          </header>

          {/* Yield Data: The Core Metric */}
          <div className="mt-12 space-y-1">
            <p className="font-mono-data text-[9px] text-brand-gold">Target_Yield</p>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-bold tracking-tighter text-white tabular-nums">
                {program.headlineRate}
              </span>
            </div>
          </div>

          {/* Institutional Specs Table */}
          <div className="mt-12 space-y-4">
            {[
              { label: "Min_Allocation", value: `$${program.min.toLocaleString()}` },
              { label: "Lock_Term", value: program.lock },
              { label: "Finality", value: "Settled_Principal" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between border-b border-tech-900 pb-2">
                <span className="font-mono-data text-[8px] text-tech-700">{item.label}</span>
                <span className="font-mono-data text-[9px] text-white tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action: The Execution Trigger */}
        <div className="mt-12">
          <button
            onClick={() => onStakeClick(program)}
            className={`group/btn relative flex w-full items-center justify-center overflow-hidden py-5 transition-all active:scale-[0.98] ${
              isDecade 
                ? "bg-white text-black hover:bg-signal-cyan" 
                : "border border-tech-700 bg-transparent text-white hover:bg-white hover:text-black"
            }`}
          >
            {/* Hover Glint Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover/btn:animate-[loading-scan_1.5s_infinite]" />
            
            <span className="font-mono-data relative z-10 text-[10px] font-bold">
              {isDecade ? "Request_Decade_Entry" : "Execute_Stake_Sequence"}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}