'use client';

import { useState } from 'react';

interface SMSNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SMSNotificationModal({ isOpen, onClose }: SMSNotificationModalProps) {
  const [formData, setFormData] = useState({
    message: '',
    recipientType: 'all',
    scheduled: false,
    scheduleDate: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setSending(false);
    setSent(true);
    
    setTimeout(() => {
      onClose();
      setSent(false);
      setFormData({ message: '', recipientType: 'all', scheduled: false, scheduleDate: '' });
    }, 2000);
  };

  const charCount = formData.message.length;
  const segments = Math.ceil(charCount / 160);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-xl mx-4 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Send SMS Notification</h2>
            <p className="text-slate-400 text-sm">Bulk SMS to user phone numbers</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {sent ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">SMS Sent!</h3>
            <p className="text-slate-400">Messages delivered to recipients.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Recipient Group</label>
              <select
                value={formData.recipientType}
                onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="all">All Users with Phone (2,340)</option>
                <option value="verified">Verified Users (1,892)</option>
                <option value="kyc_pending">KYC Pending (23)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                maxLength={480}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                placeholder="Type your SMS message..."
              />
              <div className="flex justify-between text-xs mt-1">
                <span className={charCount > 160 ? 'text-red-400' : 'text-slate-500'}>
                  {charCount}/480 characters
                </span>
                <span className="text-slate-500">{segments} SMS segment{segments > 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="scheduleSMS"
                checked={formData.scheduled}
                onChange={(e) => setFormData({ ...formData, scheduled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="scheduleSMS" className="text-sm text-slate-300">Schedule for later</label>
            </div>

            {formData.scheduled && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Schedule Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.scheduleDate}
                  onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50"
              >
                {sending ? 'Sending...' : formData.scheduled ? 'Schedule' : 'Send Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
