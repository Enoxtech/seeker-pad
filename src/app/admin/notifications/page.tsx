'use client';
import React, { useState } from 'react';

const mockNotifications = [
  { id: 1, type: 'Email', title: 'New Launch Alert', recipients: 'All Users', sent: '2,450', opened: '1,840', status: 'Sent', date: '2026-03-10' },
  { id: 2, type: 'SMS', title: 'Launch Ending Soon', recipients: 'Participants', sent: '458', delivered: '445', status: 'Sent', date: '2026-03-09' },
  { id: 3, type: 'Email', title: 'KYC Verification', recipients: 'Pending KYC', sent: '45', opened: '38', status: 'Sent', date: '2026-03-08' },
  { id: 4, type: 'Email', title: 'Token Claim Ready', recipients: 'Eligible Users', sent: '892', opened: '756', status: 'Scheduled', date: '2026-03-15' },
];

export default function AdminNotifications() {
  const [showModal, setShowModal] = useState(false);
  const [notificationType, setNotificationType] = useState('Email');

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Send Notification
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Total Sent</p>
          <p className="text-2xl font-bold text-white">3,845</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Email Open Rate</p>
          <p className="text-2xl font-bold text-green-400">74%</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">SMS Delivery Rate</p>
          <p className="text-2xl font-bold text-green-400">97%</p>
        </div>
        <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
          <p className="text-slate-400 text-sm">Scheduled</p>
          <p className="text-2xl font-bold text-yellow-400">2</p>
        </div>
      </div>

      {/* Notification History */}
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-700/50">
            <tr>
              <th className="text-left p-4 text-slate-400 font-medium">Type</th>
              <th className="text-left p-4 text-slate-400 font-medium">Title</th>
              <th className="text-left p-4 text-slate-400 font-medium">Recipients</th>
              <th className="text-left p-4 text-slate-400 font-medium">Sent</th>
              <th className="text-left p-4 text-slate-400 font-medium">Delivery Rate</th>
              <th className="text-left p-4 text-slate-400 font-medium">Status</th>
              <th className="text-left p-4 text-slate-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {mockNotifications.map((notif) => (
              <tr key={notif.id} className="border-t border-slate-700 hover:bg-slate-700/30">
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    notif.type === 'Email' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                  }`}>
                    {notif.type}
                  </span>
                </td>
                <td className="p-4 text-white">{notif.title}</td>
                <td className="p-4 text-slate-300">{notif.recipients}</td>
                <td className="p-4 text-slate-300">{notif.sent}</td>
                <td className="p-4 text-cyan-400">
                  {notif.opened ? `${Math.round((parseInt(notif.opened.replace(/,/g, ''))/parseInt(notif.sent.replace(/,/g, '')))*100)}%` : `${Math.round((parseInt((notif.delivered || '0').replace(/,/g, ''))/parseInt(notif.sent.replace(/,/g, '')))*100)}%`}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    notif.status === 'Sent' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {notif.status}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm">{notif.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Send Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 w-full max-w-lg border border-slate-700">
            <h2 className="text-xl font-bold text-white mb-4">Send Notification</h2>
            
            {/* Type Selection */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={() => setNotificationType('Email')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  notificationType === 'Email' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                📧 Email
              </button>
              <button
                onClick={() => setNotificationType('SMS')}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  notificationType === 'SMS' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                📱 SMS
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-1">Title</label>
                <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" placeholder="Notification title" />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Recipients</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
                  <option>All Users</option>
                  <option>Active Participants</option>
                  <option>KYC Pending</option>
                  <option>Specific Wallet</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">
                  {notificationType === 'Email' ? 'Message' : 'SMS Content'}
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white" 
                  placeholder={notificationType === 'Email' ? 'Write your email content...' : 'Write your SMS (160 chars max)...'}
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-1">Schedule</label>
                <select className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white">
                  <option>Send Now</option>
                  <option>Schedule for Later</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
              <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
