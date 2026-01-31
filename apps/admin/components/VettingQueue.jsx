import React, { useState } from 'react';

export default function VettingQueue({ pendingUsers, onAction }) {
  return (
    <div className="bg-brand-gray border border-white/5 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-semibold text-white">Vetting Queue</h2>
        <p className="text-gray-400 text-sm">Review access requests for the Private Yield Desk.</p>
      </div>
      
      <table className="w-full text-left">
        <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-gray-500">
          <tr>
            <th className="px-6 py-4">User Identity</th>
            <th className="px-6 py-4">Request Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {pendingUsers.map((user) => (
            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-white">{user.email}</div>
                <div className="text-xs text-gray-500">UID: {user.id.slice(0, 8)}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-right space-x-3">
                <button 
                  onClick={() => onAction(user.id, 'rejected')}
                  className="text-xs text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wider"
                >
                  Reject
                </button>
                <button 
                  onClick={() => onAction(user.id, 'approved')}
                  className="bg-brand-gold hover:bg-brand-gold-muted text-black text-xs font-bold px-4 py-2 rounded transition-colors uppercase tracking-wider"
                >
                  Approve Access
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}