'use client';
import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string;
  user_address: string;
  type: string;
  amount_sol: number;
  status: string;
  tx_signature: string;
  created_at: string;
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.user_address.toLowerCase().includes(search.toLowerCase()) ||
                          t.tx_signature?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'participation':
        return 'text-cyan-400';
      case 'claim':
        return 'text-green-400';
      case 'purchase':
        return 'text-purple-400';
      case 'withdrawal':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };

  const exportCSV = () => {
    const headers = ['User', 'Type', 'Amount (SOL)', 'Status', 'TX Signature', 'Date'];
    const rows = filteredTransactions.map(t => [
      t.user_address,
      t.type,
      t.amount_sol,
      t.status,
      t.tx_signature || '',
      t.created_at
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <button 
          onClick={exportCSV}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>📥</span> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search by wallet or TX..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500"
          />
        </div>
        <select 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="all">All Status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">User</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Type</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Amount</th>
              <th className="text-center p-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">TX Signature</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No transactions found</td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4 text-slate-300 font-mono text-sm">
                    {tx.user_address.slice(0, 8)}...{tx.user_address.slice(-4)}
                  </td>
                  <td className="p-4">
                    <span className={getTypeColor(tx.type)}>{tx.type}</span>
                  </td>
                  <td className="p-4 text-right text-white font-medium">{tx.amount_sol?.toFixed(4)} SOL</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-sm">
                    {tx.tx_signature ? `${tx.tx_signature.slice(0, 8)}...` : '-'}
                  </td>
                  <td className="p-4 text-right text-slate-400 text-sm">
                    {formatDate(tx.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
