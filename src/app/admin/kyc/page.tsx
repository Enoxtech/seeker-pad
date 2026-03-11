'use client';
import React, { useState, useEffect } from 'react';

interface KYCRecord {
  id: string;
  wallet_address: string;
  email: string;
  status: string;
  document_type: string;
  submitted_at: string;
}

export default function AdminKYC() {
  const [kycRecords, setKycRecords] = useState<KYCRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = () => {
    fetch('/api/admin/kyc')
      .then(res => res.json())
      .then(data => {
        // Handle error response from API
        if (data && typeof data === 'object' && 'error' in data) {
          console.error('API error:', data.error);
          setKycRecords([]);
        } else if (Array.isArray(data)) {
          setKycRecords(data);
        } else {
          setKycRecords([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setKycRecords([]);
        setLoading(false);
      });
  };

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    const res = await fetch(`/api/admin/kyc/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      fetchKYC();
    }
  };

  const filteredRecords = kycRecords.filter(r => 
    filter === 'all' || r.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
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
        <h1 className="text-2xl font-bold text-white">KYC Verification</h1>
        <div className="flex gap-2">
          {['all', 'pending', 'approved', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg text-sm ${
                filter === f ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* KYC Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Wallet</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Document</th>
              <th className="text-center p-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Submitted</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No KYC records found</td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4 text-slate-300 font-mono text-sm">
                    {record.wallet_address.slice(0, 8)}...{record.wallet_address.slice(-4)}
                  </td>
                  <td className="p-4 text-slate-300">{record.email || '-'}</td>
                  <td className="p-4 text-slate-300">{record.document_type || '-'}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-400 text-sm">
                    {record.submitted_at ? new Date(record.submitted_at).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4 text-right">
                    {record.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleReview(record.id, 'approved')}
                          className="text-green-400 hover:text-green-300 text-sm mr-3"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleReview(record.id, 'rejected')}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {record.status !== 'pending' && (
                      <span className="text-slate-500 text-sm">Completed</span>
                    )}
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
