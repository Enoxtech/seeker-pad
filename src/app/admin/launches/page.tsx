'use client';
import React, { useState } from 'react';

const mockLaunches = [
  { id: 1, name: 'Project Alpha', symbol: 'ALPHA', status: 'Active', hardCap: '$1M', softCap: '$200K', price: '$0.05', participants: 458, raised: '$850,000', startDate: '2026-03-01', endDate: '2026-03-15' },
  { id: 2, name: 'Project Beta', symbol: 'BETA', status: 'Completed', hardCap: '$2M', softCap: '$500K', price: '$0.10', participants: 892, raised: '$1.2M', startDate: '2026-02-01', endDate: '2026-02-20' },
  { id: 3, name: 'Project Gamma', symbol: 'GAMMA', status: 'Upcoming', hardCap: '$500K', softCap: '$100K', price: '$0.02', participants: 0, raised: '$0', startDate: '2026-03-20', endDate: '2026-03-30' },
  { id: 4, name: 'Project Delta', symbol: 'DELTA', status: 'Active', hardCap: '$800K', softCap: '$150K', price: '$0.08', participants: 234, raised: '$350,000', startDate: '2026-03-05', endDate: '2026-03-20' },
  { id: 5, name: 'Project Epsilon', symbol: 'EPS', status: 'Draft', hardCap: '$600K', softCap: '$100K', price: '$0.06', participants: 0, raised: '$0', startDate: 'TBD', endDate: 'TBD' },
];

export default function AdminLaunches() {
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const filteredLaunches = filter === 'All' 
    ? mockLaunches 
    : mockLaunches.filter(l => l.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Launch Management</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Create Launch
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['All', 'Active', 'Completed', 'Upcoming', 'Draft'].map(status => (
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

      {/* Launches Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Name</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Participants</th>
              <th className="text-left p-4 text-slate-400 font-medium">Raised</th>
              <th className="text-left p-4 text-slate-400 font-medium">Hard Cap</th>
              <th className="text-left p-4 text-slate-400 font-medium">End Date</th>
              <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLaunches.map((launch) => (
              <tr key={launch.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4">
                  <p className="text-white font-medium">{launch.name}</p>
                  <p className="text-slate-400 text-sm">${launch.symbol}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    launch.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                    launch.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                    launch.status === 'Upcoming' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {launch.status}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{launch.participants}</td>
                <td className="p-4 text-cyan-400 font-medium">{launch.raised}</td>
                <td className="p-4 text-slate-300">{launch.hardCap}</td>
                <td className="p-4 text-slate-300">{launch.endDate}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm">Edit</button>
                    <button className="text-slate-400 hover:text-white text-sm">View</button>
                    {launch.status === 'Draft' && (
                      <button className="text-green-400 hover:text-green-300 text-sm">Launch</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Create New Launch</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Project Name</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" placeholder="Project Alpha" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Token Symbol</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" placeholder="ALPHA" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Hard Cap (USD)</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" placeholder="$1,000,000" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Soft Cap (USD)</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" placeholder="$200,000" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Token Price (USD)</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" placeholder="$0.05" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Start Date</label>
                <input type="date" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">End Date</label>
                <input type="date" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Status</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
                  <option>Draft</option>
                  <option>Upcoming</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg transition-colors">
                Create Launch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
