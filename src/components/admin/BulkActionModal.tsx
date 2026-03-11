'use client';

import { useState } from 'react';

interface BulkActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: 'kyc' | 'user' | 'launch';
}

export default function BulkActionModal({ isOpen, onClose, actionType }: BulkActionModalProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [action, setAction] = useState('');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  if (!isOpen) return null;

  const handleExecute = async () => {
    if (!action || selectedIds.length === 0) return;
    
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessing(false);
    setCompleted(true);
    
    setTimeout(() => {
      onClose();
      setCompleted(false);
      setSelectedIds([]);
      setAction('');
    }, 2000);
  };

  const getTitle = () => {
    switch (actionType) {
      case 'kyc': return 'Bulk KYC Action';
      case 'user': return 'Bulk User Action';
      case 'launch': return 'Bulk Launch Action';
      default: return 'Bulk Action';
    }
  };

  const getActions = () => {
    switch (actionType) {
      case 'kyc':
        return [
          { value: 'approve', label: 'Approve Selected', color: 'green' },
          { value: 'reject', label: 'Reject Selected', color: 'red' },
          { value: 'request_info', label: 'Request More Info', color: 'yellow' },
        ];
      case 'user':
        return [
          { value: 'enable', label: 'Enable Accounts', color: 'green' },
          { value: 'disable', label: 'Disable Accounts', color: 'red' },
          { value: 'email', label: 'Send Email', color: 'blue' },
        ];
      case 'launch':
        return [
          { value: 'activate', label: 'Activate Launches', color: 'green' },
          { value: 'pause', label: 'Pause Launches', color: 'yellow' },
          { value: 'cancel', label: 'Cancel Launches', color: 'red' },
        ];
      default:
        return [];
    }
  };

  const actions = getActions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-lg mx-4 bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
          <p className="text-slate-400 text-sm">Select action to perform on {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}</p>
        </div>

        {completed ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Action Completed!</h3>
            <p className="text-slate-400">Bulk action executed successfully.</p>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-medium mb-3">Select Action</h3>
              <div className="space-y-2">
                {actions.map((a) => (
                  <button
                    key={a.value}
                    onClick={() => setAction(a.value)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      action === a.value 
                        ? 'border-cyan-500 bg-cyan-500/10' 
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <span className={`text-${a.color}-400 font-medium`}>{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-yellow-200 text-sm">This action will affect {selectedIds.length} items. This cannot be undone.</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleExecute}
                disabled={!action || selectedIds.length === 0 || processing}
                className="flex-1 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Processing...' : 'Execute'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
