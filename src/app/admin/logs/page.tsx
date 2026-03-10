'use client';
import React, { useState } from 'react';

const mockLogs = [
  { id: 1, admin: '0x9876...5432', action: 'Launch Created', details: 'Created "Project Alpha" launch', ip: '192.168.1.1', time: '2026-03-10 10:30:45' },
  { id: 2, admin: '0x9876...5432', action: 'User Suspended', details: 'Suspended user 0xdef0...1234', ip: '192.168.1.1', time: '2026-03-10 09:15:22' },
  { id: 3, admin: '0x9876...5432', action: 'KYC Approved', details: 'Approved KYC for 0xabcd...efgh', ip: '192.168.1.1', time: '2026-03-09 16:45:10' },
  { id: 4, admin: '0x9876...5432', action: 'Settings Changed', details: 'Updated platform fee from 2% to 2.5%', ip: '192.168.1.1', time: '2026-03-09 14:20:33' },
  { id: 5, admin: '0x9876...5432', action: 'Notification Sent', details: 'Sent "New Launch" email to all users', ip: '192.168.1.1', time: '2026-03-08 11:00:00' },
  { id: 6, admin: '0x9876...5432', action: 'KYC Rejected', details: 'Rejected KYC for 0xdef0...1234', ip: '192.168.1.1', time: '2026-03-08 09:30:15' },
  { id: 7, admin: '0x9876...5432', action: 'Launch Updated', details: 'Changed "Project Beta" status to Completed', ip: '192.168.1.1', time: '2026-03-07 15:45:00' },
  { id: 8, admin: '0x9876...5432', action: 'Login', details: 'Admin logged in successfully', ip: '192.168.1.1', time: '2026-03-07 08:00:00' },
];

export default function AdminLogs() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredLogs = mockLogs.filter(log => {
    const matchesFilter = filter === 'All' || log.action.includes(filter);
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) || 
                        log.admin.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const actionTypes = ['All', 'Launch Created', 'Launch Updated', 'User Suspended', 'KYC Approved', 'KYC Rejected', 'Settings Changed', 'Notification Sent', 'Login'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          Export Logs
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Actions</p>
          <p className="text-2xl font-bold text-white">{mockLogs.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Today</p>
          <p className="text-2xl font-bold text-white">2</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">This Week</p>
          <p className="text-2xl font-bold text-white">6</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">This Month</p>
          <p className="text-2xl font-bold text-white">8</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400"
        />
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          {actionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Timestamp</th>
              <th className="text-left p-4 text-slate-400 font-medium">Admin</th>
              <th className="text-left p-4 text-slate-400 font-medium">Action</th>
              <th className="text-left p-4 text-slate-400 font-medium">Details</th>
              <th className="text-left p-4 text-slate-400 font-medium">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4 text-slate-400 text-sm">{log.time}</td>
                <td className="p-4 text-white font-mono text-sm">{log.admin}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    log.action.includes('Created') || log.action.includes('Approved') ? 'bg-green-500/20 text-green-400' :
                    log.action.includes('Suspended') || log.action.includes('Rejected') ? 'bg-red-500/20 text-red-400' :
                    log.action.includes('Changed') || log.action.includes('Updated') ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {log.action}
                  </span>
                </td>
                <td className="p-4 text-slate-300 text-sm">{log.details}</td>
                <td className="p-4 text-slate-500 font-mono text-sm">{log.ip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
