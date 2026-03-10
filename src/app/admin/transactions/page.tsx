'use client';
import React, { useState } from 'react';

const mockTransactions = [
  { id: 'TXN001', user: '0x1234...5678', type: 'Purchase', launch: 'Project Alpha', amount: '$500', tokenAmount: '10,000 ALPHA', status: 'Completed', time: '2026-03-10 10:30' },
  { id: 'TXN002', user: '0xabcd...efgh', type: 'Claim', launch: 'Project Beta', amount: '$1,200', tokenAmount: '12,000 BETA', status: 'Completed', time: '2026-03-10 09:15' },
  { id: 'TXN003', user: '0x9876...5432', type: 'Purchase', launch: 'Project Alpha', amount: '$250', tokenAmount: '5,000 ALPHA', status: 'Pending', time: '2026-03-10 08:45' },
  { id: 'TXN004', user: '0xdef0...1234', type: 'Withdraw', launch: 'Project Alpha', amount: '$100', tokenAmount: '2,000 ALPHA', status: 'Completed', time: '2026-03-09 16:20' },
  { id: 'TXN005', user: '0x5678...90ab', type: 'Purchase', launch: 'Project Delta', amount: '$1,000', tokenAmount: '12,500 DELTA', status: 'Completed', time: '2026-03-09 14:10' },
  { id: 'TXN006', user: '0x2468...1357', type: 'Refund', launch: 'Project Beta', amount: '$500', tokenAmount: '5,000 BETA', status: 'Completed', time: '2026-03-09 11:30' },
  { id: 'TXN007', user: '0x1357...2468', type: 'Purchase', launch: 'Project Alpha', amount: '$750', tokenAmount: '15,000 ALPHA', status: 'Failed', time: '2026-03-08 15:45' },
  { id: 'TXN008', user: '0xaceg...ikmo', type: 'Claim', launch: 'Project Beta', amount: '$2,000', tokenAmount: '20,000 BETA', status: 'Completed', time: '2026-03-08 10:00' },
];

export default function AdminTransactions() {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTxns = mockTransactions.filter(txn => {
    const matchesStatus = filter === 'All' || txn.status === filter;
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    const matchesSearch = txn.user.toLowerCase().includes(search.toLowerCase()) || 
                        txn.id.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    total: mockTransactions.length,
    completed: mockTransactions.filter(t => t.status === 'Completed').length,
    pending: mockTransactions.filter(t => t.status === 'Pending').length,
    volume: '$6,800',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Transactions</h1>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Transactions</p>
          <p className="text-2xl font-bold text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Volume</p>
          <p className="text-2xl font-bold text-cyan-400">{stats.volume}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by wallet or TXN ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400"
        />
        <select 
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option>All Types</option>
          <option>Purchase</option>
          <option>Claim</option>
          <option>Withdraw</option>
          <option>Refund</option>
        </select>
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option>All Status</option>
          <option>Completed</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">TXN ID</th>
              <th className="text-left p-4 text-slate-400 font-medium">User</th>
              <th className="text-left p-4 text-slate-400 font-medium">Type</th>
              <th className="text-left p-4 text-slate-400 font-medium">Launch</th>
              <th className="text-left p-4 text-slate-400 font-medium">Amount</th>
              <th className="text-left p-4 text-slate-400 font-medium">Tokens</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {filteredTxns.map((txn) => (
              <tr key={txn.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4">
                  <span className="text-cyan-400 font-mono text-sm">{txn.id}</span>
                </td>
                <td className="p-4 text-slate-300 font-mono text-sm">{txn.user}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    txn.type === 'Purchase' ? 'bg-blue-500/20 text-blue-400' :
                    txn.type === 'Claim' ? 'bg-green-500/20 text-green-400' :
                    txn.type === 'Withdraw' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {txn.type}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{txn.launch}</td>
                <td className="p-4 text-white font-medium">{txn.amount}</td>
                <td className="p-4 text-slate-300 text-sm">{txn.tokenAmount}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    txn.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    txn.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {txn.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{txn.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
