'use client';
import React, { useState, useEffect } from 'react';

interface Transaction {
  id: number;
  txHash: string;
  type: string;
  token: string;
  amount: string;
  usdValue: string;
  wallet: string;
  status: string;
  timestamp: string;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/transactions');
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium">Transaction</th>
                <th className="text-left p-4 text-slate-400 font-medium">Type</th>
                <th className="text-left p-4 text-slate-400 font-medium">Token</th>
                <th className="text-left p-4 text-slate-400 font-medium">Amount</th>
                <th className="text-left p-4 text-slate-400 font-medium">USD Value</th>
                <th className="text-left p-4 text-slate-400 font-medium">Wallet</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4 text-white font-mono text-sm">{tx.txHash}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.type === 'Buy' ? 'bg-green-500/20 text-green-400' :
                      tx.type === 'Claim' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="p-4 text-cyan-400 font-medium">{tx.token}</td>
                  <td className="p-4 text-white">{tx.amount}</td>
                  <td className="p-4 text-slate-300">${tx.usdValue}</td>
                  <td className="p-4 text-slate-300 font-mono text-sm">{tx.wallet}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.status === 'Success' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{tx.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
