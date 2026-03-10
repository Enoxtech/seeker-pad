'use client';
import React, { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: string;
  title: string;
  status: string;
  sent_at: string;
  recipients: { type: string; addresses?: string[] };
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'email',
    title: '',
    message: '',
    recipientType: 'all'
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = () => {
    fetch('/api/admin/notifications')
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    
    const res = await fetch('/api/admin/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: formData.type,
        title: formData.title,
        message: formData.message,
        recipients: { type: formData.recipientType }
      })
    });
    
    if (res.ok) {
      setShowModal(false);
      setFormData({ type: 'email', title: '', message: '', recipientType: 'all' });
      fetchNotifications();
    }
    setSending(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
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
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <span>+</span> Send Notification
        </button>
      </div>

      {/* Notifications History */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Type</th>
              <th className="text-left p-4 text-slate-400 text-sm font-medium">Title</th>
              <th className="text-center p-4 text-slate-400 text-sm font-medium">Recipients</th>
              <th className="text-center p-4 text-slate-400 text-sm font-medium">Status</th>
              <th className="text-right p-4 text-slate-400 text-sm font-medium">Sent</th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400">No notifications sent</td>
              </tr>
            ) : (
              notifications.map((notif) => (
                <tr key={notif.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      notif.type === 'email' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {notif.type}
                    </span>
                  </td>
                  <td className="p-4 text-white">{notif.title}</td>
                  <td className="p-4 text-center text-slate-300">
                    {notif.recipients?.type === 'all' ? 'All Users' : 'Specific Wallets'}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      notif.status === 'sent' ? 'bg-green-500/20 text-green-400' :
                      notif.status === 'draft' ? 'bg-slate-500/20 text-slate-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {notif.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-400 text-sm">
                    {formatDate(notif.sent_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Send Notification Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-md border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Send Notification</h2>
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Type</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'email'})}
                    className={`flex-1 py-2 rounded-lg ${formData.type === 'email' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    📧 Email
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, type: 'sms'})}
                    className={`flex-1 py-2 rounded-lg ${formData.type === 'sms' ? 'bg-cyan-500 text-white' : 'bg-slate-700 text-slate-400'}`}
                  >
                    📱 SMS
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white h-32"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Recipients</label>
                <select 
                  value={formData.recipientType}
                  onChange={e => setFormData({...formData, recipientType: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="all">All Users</option>
                  <option value="wallets">Specific Wallets</option>
                </select>
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
                  disabled={sending}
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg disabled:opacity-50"
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
