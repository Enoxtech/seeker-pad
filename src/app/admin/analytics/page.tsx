'use client';
import React from 'react';

const chartData = {
  revenue: [
    { month: 'Jan', value: '$120K' },
    { month: 'Feb', value: '$180K' },
    { month: 'Mar', value: '$250K' },
    { month: 'Apr', value: '$320K' },
    { month: 'May', value: '$280K' },
    { month: 'Jun', value: '$400K' },
  ],
  users: [
    { month: 'Jan', value: '1,200' },
    { month: 'Feb', value: '2,400' },
    { month: 'Mar', value: '4,100' },
    { month: 'Apr', value: '6,800' },
    { month: 'May', value: '9,200' },
    { month: 'Jun', value: '12,458' },
  ],
};

const topLaunches = [
  { name: 'Project Alpha', raised: '$850,000', participants: 458, roi: '+45%' },
  { name: 'Project Beta', raised: '$1.2M', participants: 892, roi: '+120%' },
  { name: 'Project Delta', raised: '$350,000', participants: 234, roi: '+30%' },
];

export default function AdminAnalytics() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <select className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white">
          <option>Last 30 Days</option>
          <option>Last 7 Days</option>
          <option>Last 90 Days</option>
          <option>All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-white">$2.4M</p>
          <p className="text-green-400 text-sm">+24% vs last month</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-white">12,458</p>
          <p className="text-green-400 text-sm">+12% vs last month</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Avg. Participation</p>
          <p className="text-2xl font-bold text-white">$890</p>
          <p className="text-green-400 text-sm">+8% vs last month</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Conversion Rate</p>
          <p className="text-2xl font-bold text-white">34%</p>
          <p className="text-red-400 text-sm">-2% vs last month</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Revenue Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {chartData.revenue.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t"
                  style={{ height: `${(i + 1) * 40}px` }}
                ></div>
                <span className="text-slate-400 text-xs mt-2">{item.month}</span>
                <span className="text-white text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Users Chart */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
          <h2 className="text-lg font-semibold text-white mb-4">User Growth</h2>
          <div className="h-48 flex items-end justify-between gap-2">
            {chartData.users.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                  style={{ height: `${(i + 1) * 35}px` }}
                ></div>
                <span className="text-slate-400 text-xs mt-2">{item.month}</span>
                <span className="text-white text-xs">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Launches */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">Top Performing Launches</h2>
        <div className="space-y-3">
          {topLaunches.map((launch, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
              <div>
                <p className="text-white font-medium">{launch.name}</p>
                <p className="text-slate-400 text-sm">{launch.participants} participants</p>
              </div>
              <div className="text-right">
                <p className="text-cyan-400 font-medium">{launch.raised}</p>
                <p className="text-green-400 text-sm">{launch.roi} ROI</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
