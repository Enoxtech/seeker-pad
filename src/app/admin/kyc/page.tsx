'use client';
import React, { useState, useEffect } from 'react';

interface KYCRequest {
  id: number;
  wallet: string;
  email: string;
  status: string;
  submittedAt: string;
  documents: string;
}

export default function AdminKYC() {
  const [requests, setRequests] = useState<KYCRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKYC();
  }, []);

  const fetchKYC = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/kyc');
      const data = await res.json();
      setRequests(data.kycRequests || []);
    } catch (error) {
      console.error('Failed to fetch KYC:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">KYC Verification</h1>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-8">Loading...</div>
      ) : (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="text-left p-4 text-slate-400 font-medium">Wallet</th>
                <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                <th className="text-left p-4 text-slate-400 font-medium">Documents</th>
                <th className="text-left p-4 text-slate-400 font-medium">Submitted</th>
                <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4 text-white font-mono text-sm">{req.wallet}</td>
                  <td className="p-4 text-slate-300">{req.email}</td>
                  <td className="p-4 text-slate-300">{req.documents}</td>
                  <td className="p-4 text-slate-300">{req.submittedAt}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      req.status === 'Verified' ? 'bg-green-500/20 text-green-400' :
                      req.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-cyan-400 hover:text-cyan-300 text-sm">Review</button>
                      <button className="text-green-400 hover:text-green-300 text-sm">Approve</button>
                      <button className="text-red-400 hover:text-red-300 text-sm">Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
