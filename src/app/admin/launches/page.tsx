'use client';

import React, { useState, useEffect } from 'react';

interface Launch {
  id: number;
  name: string;
  symbol: string;
  status: string;
  raised: string;
  target: string;
  participants: string;
  startDate: string;
  endDate: string;
}

export default function AdminLaunches() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLaunches();
  }, []);

  const fetchLaunches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/launches');
      const data = await res.json();
      setLaunches(data.launches || []);
    } catch (error) {
      console.error('Failed to fetch launches:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Launch Management</h1>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          + Create Launch
        </button>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {launches.map((launch) => {
            const progress = (parseInt(launch.raised) / parseInt(launch.target)) * 100;
            return (
              <div key={launch.id} className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{launch.name}</h3>
                    <p className="text-slate-400 text-sm">${launch.symbol}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    launch.status === 'Live' ? 'bg-green-500/20 text-green-400' :
                    launch.status === 'Upcoming' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-slate-600 text-slate-300'
                  }`}>
                    {launch.status}
                  </span>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-cyan-400">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-slate-400">${parseInt(launch.raised).toLocaleString()} raised</span>
                    <span className="text-slate-400">${parseInt(launch.target).toLocaleString()} target</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex gap-4 text-slate-400">
                    <span>👥 {launch.participants} participants</span>
                    <span>📅 {launch.startDate} - {launch.endDate}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-cyan-400 hover:text-cyan-300">Edit</button>
                    <button className="text-slate-400 hover:text-white">View</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
