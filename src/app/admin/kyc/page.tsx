'use client';
import React, { useState } from 'react';

const mockKYC = [
  { id: 1, wallet: '0x1234...5678', name: 'John Doe', email: 'john@example.com', status: 'Pending', submitted: '2026-03-10 10:30', type: 'Individual' },
  { id: 2, wallet: '0xabcd...efgh', name: 'Jane Smith', email: 'jane@example.com', status: 'Verified', submitted: '2026-03-09 14:20', type: 'Individual' },
  { id: 3, wallet: '0x9876...5432', name: 'Bob Wilson', email: 'bob@example.com', status: 'Pending', submitted: '2026-03-10 09:15', type: 'Corporate' },
  { id: 4, wallet: '0xdef0...1234', name: 'Alice Brown', email: 'alice@example.com', status: 'Rejected', submitted: '2026-03-08 16:45', type: 'Individual' },
  { id: 5, wallet: '0x5678...90ab', name: 'Charlie Davis', email: 'charlie@example.com', status: 'Pending', submitted: '2026-03-10 11:00', type: 'Individual' },
  { id: 6, wallet: '0x2468...1357', name: 'David Lee', email: 'david@example.com', status: 'Verified', submitted: '2026-03-07 12:30', type: 'Corporate' },
];

export default function AdminKYC() {
  const [filter, setFilter] = useState('Pending');
  const [selected, setSelected] = useState<number | null>(null);

  const filteredKYC = filter === 'All' 
    ? mockKYC 
    : mockKYC.filter(k => k.status === filter);

  const stats = {
    pending: mockKYC.filter(k => k.status === 'Pending').length,
    verified: mockKYC.filter(k => k.status === 'Verified').length,
    rejected: mockKYC.filter(k => k.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">KYC Management</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Verified</p>
          <p className="text-2xl font-bold text-green-400">{stats.verified}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Rejected</p>
          <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['Pending', 'Verified', 'Rejected', 'All'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status 
                ? 'bg-cyan-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* KYC Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Applicant</th>
              <th className="text-left p-4 text-slate-400 font-medium">Wallet</th>
              <th className="text-left p-4 text-slate-400 font-medium">Type</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Submitted</th>
              <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredKYC.map((kyc) => (
              <tr key={kyc.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4">
                  <p className="text-white font-medium">{kyc.name}</p>
                  <p className="text-slate-400 text-sm">{kyc.email}</p>
                </td>
                <td className="p-4 text-slate-300 font-mono text-sm">{kyc.wallet}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded text-xs bg-slate-600 text-slate-300">
                    {kyc.type}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    kyc.status === 'Verified' ? 'bg-green-500/20 text-green-400' :
                    kyc.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {kyc.status}
                  </span>
                </td>
                <td className="p-4 text-slate-300 text-sm">{kyc.submitted}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelected(kyc.id)}
                      className="text-cyan-400 hover:text-cyan-300 text-sm"
                    >
                      Review
                    </button>
                    {kyc.status === 'Pending' && (
                      <>
                        <button className="text-green-400 hover:text-green-300 text-sm">Approve</button>
                        <button className="text-red-400 hover:text-red-300 text-sm">Reject</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Review Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">KYC Review</h2>
            {mockKYC.filter(k => k.id === selected).map(kyc => (
              <div key={kyc.id}>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Name:</span>
                    <span className="text-white">{kyc.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Email:</span>
                    <span className="text-white">{kyc.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Wallet:</span>
                    <span className="text-white font-mono">{kyc.wallet}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white">{kyc.type}</span>
                  </div>
                </div>
                <div className="border-t border-slate-700 pt-4 mb-4">
                  <p className="text-slate-400 text-sm mb-2">Documents:</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">
                      📄 ID Document
                    </button>
                    <button className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm">
                      🏠 Proof of Address
                    </button>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelected(null)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
                  >
                    Close
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg">
                    Reject
                  </button>
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
