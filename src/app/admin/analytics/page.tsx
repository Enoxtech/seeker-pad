'use client';
import React, { useState, useEffect } from 'react';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    raised: [45000, 52000, 48000, 61000, 55000, 72000, 68000],
    users: [120, 145, 132, 178, 165, 210, 195]
  });

  useEffect(() => {
    // Simulate loading different data based on time range
    setLoading(true);
    setTimeout(() => {
      const dataMap: Record<string, typeof chartData> = {
        '7d': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], raised: [45000, 52000, 48000, 61000, 55000, 72000, 68000], users: [120, 145, 132, 178, 165, 210, 195] },
        '30d': { labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'], raised: [180000, 220000, 195000, 280000], users: [520, 610, 580, 720] },
        '90d': { labels: ['Jan', 'Feb', 'Mar'], raised: [450000, 520000, 680000], users: [1200, 1450, 1680] },
      };
      setChartData(dataMap[timeRange] || dataMap['7d']);
      setLoading(false);
    }, 300);
  }, [timeRange]);

  const maxRaised = Math.max(...chartData.raised);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <select 
          value={timeRange}
          onChange={e => setTimeRange(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Funds Raised Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">Funds Raised</h2>
              <div className="h-48 flex items-end justify-between gap-2">
                {chartData.raised.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-cyan-500/80 rounded-t hover:bg-cyan-500 transition-colors"
                      style={{ height: `${(value / maxRaised) * 100}%` }}
                      title={`$${value.toLocaleString()}`}
                    ></div>
                    <span className="text-slate-500 text-xs mt-2">{chartData.labels[i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-2xl font-bold text-white mt-4">
                ${chartData.raised.reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
              <p className="text-slate-400 text-sm">Total Raised</p>
            </div>

            {/* New Users Chart */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">New Users</h2>
              <div className="h-48 flex items-end justify-between gap-2">
                {chartData.users.map((value, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-purple-500/80 rounded-t hover:bg-purple-500 transition-colors"
                      style={{ height: `${(value / Math.max(...chartData.users)) * 100}%` }}
                      title={value.toString()}
                    ></div>
                    <span className="text-slate-500 text-xs mt-2">{chartData.labels[i]}</span>
                  </div>
                ))}
              </div>
              <p className="text-2xl font-bold text-white mt-4">
                {chartData.users.reduce((a, b) => a + b, 0).toLocaleString()}
              </p>
              <p className="text-slate-400 text-sm">Total New Users</p>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm">Avg. Transaction</p>
              <p className="text-2xl font-bold text-white mt-1">$450</p>
              <p className="text-green-400 text-sm mt-1">+12% vs last period</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold text-white mt-1">3.2%</p>
              <p className="text-green-400 text-sm mt-1">+0.5% vs last period</p>
            </div>
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
              <p className="text-slate-400 text-sm">Avg. Participation</p>
              <p className="text-2xl font-bold text-white mt-1">2.8 SOL</p>
              <p className="text-red-400 text-sm mt-1">-5% vs last period</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
