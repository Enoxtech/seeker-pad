'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface AnalyticsChartsProps {
  data: {
    revenue?: ChartData[];
    users?: ChartData[];
    launches?: ChartData[];
  };
}

export default function AnalyticsCharts({ data }: AnalyticsChartsProps) {
  const [timeRange, setTimeRange] = useState('6m');
  const [activeChart, setActiveChart] = useState<'revenue' | 'users' | 'launches'>('revenue');
  
  const chartData = data[activeChart === 'revenue' ? 'revenue' : activeChart === 'users' ? 'users' : 'launches'] || [];
  
  const maxValue = Math.max(...chartData.map(d => d.value), 1);
  
  const formatValue = (val: number) => {
    if (activeChart === 'revenue') {
      return '$' + val.toLocaleString();
    }
    if (activeChart === 'users') {
      return val.toLocaleString();
    }
    return val.toString();
  };

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {['7d', '30d', '3m', '6m', '1y'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                timeRange === range 
                  ? 'bg-cyan-500 text-white' 
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Type Tabs */}
      <div className="flex gap-4 border-b border-slate-700">
        <button
          onClick={() => setActiveChart('revenue')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeChart === 'revenue' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💰 Revenue
        </button>
        <button
          onClick={() => setActiveChart('users')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeChart === 'users' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👥 Users
        </button>
        <button
          onClick={() => setActiveChart('launches')}
          className={`pb-2 px-1 text-sm font-medium transition-colors ${
            activeChart === 'launches' 
              ? 'text-cyan-400 border-b-2 border-cyan-400' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🚀 Launches
        </button>
      </div>

      {/* Bar Chart */}
      <div className="bg-slate-800/50 rounded-xl p-4">
        <div className="flex items-end justify-between h-48 gap-2">
          {chartData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-gradient-to-t from-cyan-500 to-blue-600 rounded-t-lg transition-all hover:from-cyan-400 hover:to-blue-500"
                style={{ 
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: '4px'
                }}
                title={`${item.label}: ${formatValue(item.value)}`}
              />
              <span className="text-xs text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        {chartData.slice(-3).map((item, index) => (
          <div key={index} className="bg-slate-800/50 rounded-xl p-3 text-center">
            <p className="text-slate-500 text-xs">{item.label}</p>
            <p className="text-white font-bold">{formatValue(item.value)}</p>
            {index > 0 && (
              <p className={`text-xs ${item.value >= chartData[index-1].value ? 'text-green-400' : 'text-red-400'}`}>
                {item.value >= chartData[index-1].value ? '↑' : '↓'} {Math.abs(Math.round((item.value - chartData[index-1].value) / chartData[index-1].value * 100))}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
