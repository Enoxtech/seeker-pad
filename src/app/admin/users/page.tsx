'use client';
import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  wallet_address: string;
  email: string;
  role: string;
  kyc_status: string;
  created_at: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    wallet_address: '',
    email: '',
    role: 'user',
    kyc_status: 'none'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(data => {
        // Handle error response from API
        if (data && typeof data === 'object' && 'error' in data) {
          console.error('API error:', data.error);
          setUsers([]);
        } else if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setShowModal(false);
      setFormData({ wallet_address: '', email: '', role: 'user', kyc_status: 'none' });
      fetchUsers();
    }
  };

  const filteredUsers = users.filter(u => 
    u.wallet_address.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'verified':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-slate-400';
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
        <h1 className="text-2xl font-bold text-white">Users</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> Add User
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by wallet or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500"
        />
      </div>

      {/* Users Table */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Wallet</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Email</th>
              <th className="text-center p-4 text-slate-400 text-sm font-medium">Role</th>
              <th className="text-center p-4 text-slate-400 text-sm font-medium">KYC Status</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Joined</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">No users found</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4 text-slate-300 font-mono text-sm">
                    {user.wallet_address.slice(0, 8)}...{user.wallet_address.slice(-4)}
                  </td>
                  <td className="p-4 text-slate-300">{user.email || '-'}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-600/50 text-slate-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={getStatusColor(user.kyc_status)}>{user.kyc_status}</span>
                  </td>
                  <td className="p-4 text-right text-slate-400 text-sm">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}
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

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Wallet Address *</label>
                <input 
                  type="text" 
                  required
                  value={formData.wallet_address}
                  onChange={e => setFormData({...formData, wallet_address: e.target.value})}
                  placeholder="7x..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-1">Role</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-1">KYC Status</label>
                  <select 
                    value={formData.kyc_status}
                    onChange={e => setFormData({...formData, kyc_status: e.target.value})}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="none">None</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
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
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
