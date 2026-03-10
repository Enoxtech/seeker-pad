import React from 'react';

const stats = [
  { label: 'Total Users', value: '12,458', change: '+12%', icon: '👥' },
  { label: 'Active Launches', value: '8', change: '+2', icon: '🚀' },
  { label: 'Total Raised', value: '$2.4M', change: '+24%', icon: '💰' },
  { label: 'KYC Pending', value: '45', change: '-8', icon: '⏳' },
];

const recentActivity = [
  { user: '0x1234...5678', action: 'Participated', launch: 'Project Alpha', time: '2 min ago', amount: '$500' },
  { user: '0xabcd...efgh', action: 'KYC Submitted', launch: '-', time: '5 min ago', amount: '-' },
  { user: '0x9876...5432', action: 'Claimed Tokens', launch: 'Project Beta', time: '10 min ago', amount: '$1,200' },
  { user: '0xdef0...1234', action: 'Participated', launch: 'Project Gamma', time: '15 min ago', amount: '$250' },
  { user: '0x5678...90ab', action: 'Withdrew', launch: 'Project Alpha', time: '20 min ago', amount: '$100' },
];

const launches = [
  { name: 'Project Alpha', status: 'Active', participants: 458, raised: '$850,000', ends: '2 days' },
  { name: 'Project Beta', status: 'Completed', participants: 892, raised: '$1.2M', ends: 'Ended' },
  { name: 'Project Gamma', status: 'Upcoming', participants: 0, raised: '$0', ends: '5 days' },
  { name: 'Project Delta', status: 'Active', participants: 234, raised: '$350,000', ends: '7 days' },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                <div>
                  <p className="text-white text-sm">{activity.user}</p>
                  <p className="text-slate-400 text-xs">{activity.action} {activity.launch !== '-' && `in ${activity.launch}`}</p>
                </div>
                <div className="text-right">
                  {activity.amount !== '-' && <p className="text-cyan-400 text-sm font-medium">{activity.amount}</p>}
                  <p className="text-slate-500 text-xs">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Launches */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Launches</h2>
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
        </div>
      </div>
    </div>
  );
}
