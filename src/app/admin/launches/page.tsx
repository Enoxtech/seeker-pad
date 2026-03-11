'use client';
import React, { useState, useEffect } from 'react';

interface Launch {
  id: string;
  name: string;
  symbol: string;
  type?: string;
  status: 'upcoming' | 'active' | 'ended' | 'live';
  total_raised: number;
  participants_count: number;
  start_time: string;
  end_time: string;
}

export default function AdminLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    type: 'standard',
    totalSupply: '',
    launchPrice: '',
    raiseTarget: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    fetchLaunches();
  }, []);

  const fetchLaunches = () => {
    fetch('/api/admin/launches')
      .then(res => res.json())
      .then(data => {
        // Handle error response from API
        if (data && typeof data === 'object' && 'error' in data) {
          console.error('API error:', data.error);
          setLaunches([]);
        } else if (Array.isArray(data)) {
          setLaunches(data);
        } else {
          setLaunches([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLaunches([]);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/launches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      let data: any = {};
      try {
        data = await res.json();
      } catch (e) {}
      if (res.ok) {
        setShowModal(false);
        setFormData({ name: '', symbol: '', description: '', type: 'standard', totalSupply: '', launchPrice: '', raiseTarget: '', startTime: '', endTime: '' });
        fetchLaunches();
      } else {
        alert('Error: ' + (data.error || `Failed (${res.status})`));
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'live':
        return 'bg-green-500/20 text-green-400';
      case 'ended':
        return 'bg-blue-500/20 text-blue-400';
      case 'upcoming':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-slate-500/20 text-slate-400';
    }
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
        <h1 className="text-2xl font-bold text-white">Launches</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> Create Launch
        </button>
      </div>

      {/* Launches Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Project</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Symbol</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Raised</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Participants</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Timeline</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {launches.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">No launches found</td>
              </tr>
            ) : (
              launches.map((launch) => (
                <tr key={launch.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4">
                    <p className="text-white font-medium">{launch.name}</p>
                    <p className="text-slate-400 text-sm">{launch.type || 'standard'}</p>
                  </td>
                  <td className="p-4 text-cyan-400 font-mono">{launch.symbol}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(launch.status)}`}>
                      {launch.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-white">${(launch.total_raised || 0).toLocaleString()}</td>
                  <td className="p-4 text-right text-slate-300">{launch.participants_count || 0}</td>
                  <td className="p-4 text-right text-slate-400 text-sm">
                    {formatDate(launch.start_time)} - {formatDate(launch.end_time)}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-cyan-400 hover:text-cyan-300 text-sm mr-3">Edit</button>
                    <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Launch Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Create New Launch</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Project Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Symbol</label>
                  <input 
                    type="text" 
                    required
                    value={formData.symbol}
                    onChange={e => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-24"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Launch Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="standard">Standard</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Total Supply</label>
                  <input 
                    type="number" 
                    value={formData.totalSupply}
                    onChange={e => setFormData({...formData, totalSupply: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Launch Price (SOL)</label>
                  <input 
                    type="number" 
                    step="0.0001"
                    value={formData.launchPrice}
                    onChange={e => setFormData({...formData, launchPrice: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Raise Target (SOL)</label>
                  <input 
                    type="number" 
                    value={formData.raiseTarget}
                    onChange={e => setFormData({...formData, raiseTarget: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Start Date</label>
                  <input 
                    type="datetime-local" 
                    value={formData.startTime}
                    onChange={e => setFormData({...formData, startTime: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">End Date</label>
                  <input 
                    type="datetime-local" 
                    value={formData.endTime}
                    onChange={e => setFormData({...formData, endTime: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg"
                >
                  Create Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
