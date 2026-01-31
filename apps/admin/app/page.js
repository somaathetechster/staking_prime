"use client";
import { useState, useEffect } from 'react';
import VettingQueue from '../components/VettingQueue';
import CurrencyManager from '../components/CurrencyManager';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [exchangeData, setExchangeData] = useState({
    BTC: { adminRate: null, marketRate: 0, useManual: false },
    ETH: { adminRate: null, marketRate: 0, useManual: false },
  });

  // Fetch initial data from PostgreSQL on mount
  useEffect(() => {
    const loadData = async () => {
      const [userRes, rateRes] = await Promise.all([
        fetch('/api/admin/pending-users'),
        fetch('/api/admin/rates')
      ]);
      if (userRes.ok) setUsers(await userRes.json());
      if (rateRes.ok) setExchangeData(await rateRes.json());
    };
    loadData();
  }, []);

  const handleRateUpdate = async (symbol, field, value) => {
    // field can be 'adminRate' or 'useManual'
    const updated = { ...exchangeData[symbol], [field]: value };
    
    setExchangeData(prev => ({ ...prev, [symbol]: updated }));

    // Persist to Database: Admin rates set here become the main rates
    await fetch('/api/admin/rates/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, ...updated }),
    });
  };

  const handleUserAction = async (id, action) => {
    const res = await fetch('/api/admin/vetting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, action }),
    });

    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10 px-6">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] mb-2 font-bold">Terminal</p>
          <h1 className="text-4xl font-light text-white italic">Operations Center</h1>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-[10px] uppercase">System Status</p>
          <p className="text-green-500 text-xs font-mono tracking-tighter shadow-green-500/20 shadow-2xl">● Live / Secure</p>
        </div>
      </header>

      <CurrencyManager 
        rates={exchangeData} 
        onUpdate={handleRateUpdate} 
      />

      <VettingQueue 
        pendingUsers={users} 
        onAction={handleUserAction} 
      />
    </div>
  );
}