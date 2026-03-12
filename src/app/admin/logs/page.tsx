'use client';
import React, { useState, useEffect } from 'react';

interface LogEntry {
  id: string;
  admin_email: string;
  action: string;
  details: Record<string, unknown>;
  ip_address: string;
  created_at: string;
}

export default function AdminLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    fetch('/api/admin/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleExport = async () => {
    // Log the export action
    await fetch('/api/admin/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'Audit Log Exported',
        details: { filter, search, count: filteredLogs.length }
      })
    });
    
    // Export to CSV
    const headers = ['Date', 'Admin', 'Action', 'Details', 'IP'];
    const rows = filteredLogs.map(log => [
      log.created_at,
      log.admin_email,
      log.action,
      JSON.stringify(log.details),
      log.ip_address
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.action.toLowerCase().includes(filter.toLowerCase());
    const matchesSearch = log.admin_email.toLowerCase().includes(search.toLowerCase()) ||
                          log.action.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const getActionIcon = (action: string) => {
    if (action.includes('Created')) return '🆕';
    if (action.includes('Deleted') || action.includes('Removed')) return '🗑️';
    if (action.includes('Updated') || action.includes('Changed')) return '✏️';
    if (action.includes('Approved')) return '✅';
    if (action.includes('Rejected') || action.includes('Suspended')) return '❌';
    if (action.includes('Login')) return '🔐';
    if (action.includes('Sent')) return '📤';
    return '📝';
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
        <h1 className="text-2xl font-bold text-white">Audit Logs</h1>
        <button 
          onClick={handleExport}
          className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>📥</span> Export
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Search logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500"
          />
        </div>
        <select 
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          <option value="all">All Actions</option>
          <option value="created">Created</option>
          <option value="updated">Updated</option>
          <option value="deleted">Deleted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="login">Login</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Action</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Admin</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Details</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">IP Address</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">No logs found</td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4">
                    <span className="flex items-center gap-2">
                      <span>{getActionIcon(log.action)}</span>
                      <span className="text-white">{log.action}</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.admin_email}</td>
                  <td className="p-4 text-slate-400 text-sm">
                    {log.details ? JSON.stringify(log.details) : '-'}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{log.ip_address}</td>
                  <td className="p-4 text-right text-slate-400 text-sm">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
