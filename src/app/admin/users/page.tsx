'use client';
import React, { useState } from 'react';

const mockUsers = [
  { id: 1, wallet: '0x1234...5678', email: 'john@example.com', role: 'User', kyc: 'Verified', joined: '2026-02-15', participation: '$2,500', status: 'Active' },
  { id: 2, wallet: '0xabcd...efgh', email: 'jane@example.com', role: 'User', kyc: 'Pending', joined: '2026-02-20', participation: '$500', status: 'Active' },
  { id: 3, wallet: '0x9876...5432', email: 'bob@example.com', role: 'Admin', kyc: 'Verified', joined: '2026-01-10', participation: '$0', status: 'Active' },
  { id: 4, wallet: '0xdef0...1234', email: 'alice@example.com', role: 'User', kyc: 'Rejected', joined: '2026-02-25', participation: '$0', status: 'Suspended' },
  { id: 5, wallet: '0x5678...90ab', email: 'charlie@example.com', role: 'User', kyc: 'Verified', joined: '2026-03-01', participation: '$1,000', status: 'Active' },
  { id: 6, wallet: '0x2468...1357', email: 'david@example.com', role: 'User', kyc: 'Verified', joined: '2026-03-05', participation: '$750', status: 'Active' },
];

export default function AdminUsers() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredUsers = mockUsers.filter(user => {
    const matchesFilter = filter === 'All' || user.status === filter;
    const matchesSearch = user.wallet.toLowerCase().includes(search.toLowerCase()) || 
                        user.email.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Add User
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by wallet or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400"
        />
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option>All</option>
          <option>Active</option>
          <option>Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Wallet</th>
              <th className="text-left p-4 text-slate-400 font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 font-medium">Role</th>
              <th className="text-left p-4 text-slate-400 font-medium">KYC</th>
              <th className="text-left p-4 text-slate-400 font-medium">Joined</th>
              <th className="text-left p-4 text-slate-400 font-medium">Total Participation</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4">
                  <p className="text-white font-mono text-sm">{user.wallet}</p>
                </td>
                <td className="p-4 text-slate-300">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-600 text-slate-300'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.kyc === 'Verified' ? 'bg-green-500/20 text-green-400' :
                    user.kyc === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {user.kyc}
                  </span>
                </td>
                <td className="p-4 text-slate-300 text-sm">{user.joined}</td>
                <td className="p-4 text-cyan-400 font-medium">{user.participation}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm">View</button>
                    <button className="text-slate-400 hover:text-white text-sm">Edit</button>
                    <button className="text-red-400 hover:text-red-300 text-sm">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-slate-400 text-sm">
        <p>Showing {filteredUsers.length} of {mockUsers.length} users</p>
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700">Previous</button>
          <button className="px-3 py-1 bg-slate-800 rounded hover:bg-slate-700">Next</button>
        </div>
      </div>
    </div>
  );
}
