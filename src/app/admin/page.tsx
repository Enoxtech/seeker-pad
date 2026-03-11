'use client';
import React, { useState, useEffect } from 'react';

interface Stats {
  totalUsers: number;
  activeLaunches: number;
  totalRaised: number;
  pendingKYC: number;
  changes: { users: number; launches: number; raised: number; kyc: number };
}

interface Activity {
  user: string;
  action: string;
  launch: string;
  time: string;
  amount: string;
}

interface Launch {
  name: string;
  status: string;
  participants: number;
  raised: string;
  ends: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeLaunches: 0,
    totalRaised: 0,
    pendingKYC: 0,
    changes: { users: 0, launches: 0, raised: 0, kyc: 0 }
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(res => res.json())
      .then(data => {
        // Handle error response from API
        if (data && typeof data === 'object' && 'error' in data) {
          console.error('API error:', data.error);
        } else {
          setStats(data.stats || data);
          setRecentActivity(data.recentActivity || []);
          setLaunches(data.launches || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `$${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatChange = (val: number) => {
    return val >= 0 ? `+${val}%` : `${val}%`;
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
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">👥</span>
            <span className={`text-sm ${stats.changes.users >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatChange(stats.changes.users)}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-slate-400 text-sm">Total Users</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">🚀</span>
            <span className="text-green-400 text-sm">+{stats.changes.launches}</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.activeLaunches}</p>
          <p className="text-slate-400 text-sm">Active Launches</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">💰</span>
            <span className={`text-sm ${stats.changes.raised >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatChange(stats.changes.raised)}
            </span>
          </div>
          <p className="text-2xl font-bold text-white">{formatNumber(stats.totalRaised)}</p>
          <p className="text-slate-400 text-sm">Total Raised</p>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">⏳</span>
            <span className="text-red-400 text-sm">{stats.changes.kyc}</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.pendingKYC}</p>
          <p className="text-slate-400 text-sm">KYC Pending</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-slate-400 text-sm">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white text-sm">{activity.user.slice(0, 8)}...{activity.user.slice(-4)}</p>
                    <p className="text-slate-400 text-xs">{activity.action} {activity.launch !== '-' && `in ${activity.launch}`}</p>
                  </div>
                  <div className="text-right">
                    {activity.amount !== '-' && <p className="text-cyan-400 text-sm font-medium">{activity.amount}</p>}
                    <p className="text-slate-500 text-xs">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Launches */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Launches</h2>
          {launches.length === 0 ? (
            <p className="text-slate-400 text-sm">No launches</p>
          ) : (
            <div className="space-y-3">
              {launches.map((launch, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <div>
                    <p className="text-white text-sm font-medium">{launch.name}</p>
                    <p className="text-slate-400 text-xs">{launch.participants} participants</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      launch.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                      launch.status === 'Completed' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {launch.status}
                    </span>
                    <p className="text-cyan-400 text-sm mt-1">{launch.raised}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
