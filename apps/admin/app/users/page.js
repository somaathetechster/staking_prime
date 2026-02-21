"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import { Layout } from "@primestakecorp/ui"; 
import VaultManagerModal from "../../components/VaultManagerModal";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function UsersPage() {
  const { data: users, mutate, isValidating } = useSWR('/api/users/roster', fetcher);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search filter: Filters by Email or User ID
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(user => 
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.includes(searchQuery)
    );
  }, [users, searchQuery]);

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-brand-black min-h-screen text-white">
      {/* 1. INSTITUTIONAL HEADER */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-white/10 pb-6 gap-4">
        <div>
          <p className="font-mono text-[10px] text-brand-gold tracking-[0.5em] uppercase">Audit_Terminal</p>
          <h1 className="text-4xl font-light tracking-tighter uppercase">Global_User_Directory</h1>
        </div>
        <div className="flex gap-8 font-mono text-[9px] text-slate-500 uppercase tracking-widest bg-white/[0.02] p-3 border border-white/5">
          <div className="flex flex-col">
            <span>Total_Principals</span>
            <span className="text-white text-lg">{users?.length || 0}</span>
          </div>
          <div className="flex flex-col border-l border-white/10 pl-8">
            <span>Network_Status</span>
            <span className="text-signal-cyan text-lg animate-pulse">Online</span>
          </div>
        </div>
      </header>

      {/* 2. SEARCH INTERFACE */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="font-mono text-brand-gold text-xs opacity-50">{'>'}</span>
        </div>
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH_BY_EMAIL_OR_ID..." 
          className="w-full bg-white/5 border border-white/10 p-4 pl-10 font-mono text-xs uppercase focus:border-brand-gold outline-none transition-all placeholder:text-slate-700"
        />
        {isValidating && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-3 h-3 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* 3. USER DATA GRID */}
      <div className="border border-white/10 bg-[#050505] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-white/5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="p-4 border-b border-white/10">Principal_Identity</th>
              <th className="p-4 border-b border-white/10">Status</th>
              <th className="p-4 border-b border-white/10">Active_Allocations</th>
              <th className="p-4 border-b border-white/10">Total_Equity (USD)</th>
              <th className="p-4 border-b border-white/10 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white uppercase tracking-tight">{user.email}</span>
                    <span className="text-[8px] font-mono text-slate-600 truncate w-32 uppercase">ID: {user.id}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`text-[8px] border px-2 py-0.5 uppercase tracking-tighter ${
                    user.status === 'APPROVED' ? 'border-signal-cyan text-signal-cyan' : 'border-brand-gold text-brand-gold'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {user.stakes?.length > 0 ? (
                      user.stakes.map(stk => (
                        <span key={stk.id} className="text-[8px] font-mono text-brand-gold bg-brand-gold/5 px-1 inline-block border border-brand-gold/10 uppercase">
                          {stk.planId}
                        </span>
                      ))
                    ) : (
                      <span className="text-[8px] font-mono text-slate-700 uppercase italic">No_Active_Positions</span>
                    )}
                  </div>
                </td>
                <td className="p-4 font-mono text-xs tabular-nums text-white">
                  ${user.balances.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => setSelectedUser(user)}
                    className="bg-white text-black text-[9px] font-bold px-4 py-2 uppercase hover:bg-brand-gold transition-all active:scale-95"
                  >
                    Manage_Vault
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && !isValidating && (
          <div className="p-20 text-center space-y-4">
            <p className="font-mono text-xs text-slate-600 uppercase tracking-widest italic">No_Records_Found_Within_The_Buffer</p>
          </div>
        )}
      </div>

      {/* 4. FOOTER SYSTEM LOGS */}
      <footer className="flex justify-between font-mono text-[7px] text-slate-800 uppercase tracking-[0.4em]">
        <span>Institutional_Audit_Mode</span>
        <span>Node: {typeof window !== 'undefined' ? window.location.hostname : 'Local'}</span>
      </footer>

      {/* THE INTEGRATED VAULT MANAGER MODAL */}
      {selectedUser && (
        <VaultManagerModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onRefresh={mutate}
        />
      )}
    </div>
  );
}