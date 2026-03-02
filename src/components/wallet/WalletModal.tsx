'use client';

import { useState, useEffect } from 'react';
import { useWallet, formatAddress } from './WalletContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const wallets = [
  { name: 'Phantom', icon: '👻', color: 'from-purple-500 to-purple-600' },
  { name: 'Solflare', icon: '☀️', color: 'from-yellow-500 to-yellow-600' },
  { name: 'Backpack', icon: '🎒', color: 'from-blue-500 to-blue-600' },
  { name: 'Exodus', icon: '🚀', color: 'from-orange-500 to-orange-600' },
];

export default function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const { wallet, connect, disconnect, isConnecting } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleWalletSelect = async (walletName: string) => {
    setSelectedWallet(walletName);
    await connect();
    onClose();
  };

  const handleDisconnect = async () => {
    await disconnect();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 crystal-card rounded-2xl p-6 animate-float">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">
          {wallet.connected ? 'Wallet Connected' : 'Connect Wallet'}
        </h2>

        {wallet.connected ? (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  👻
                </div>
                <div>
                  <div className="text-white font-medium">{wallet.wallet}</div>
                  <div className="text-gray-400 text-sm">{formatAddress(wallet.publicKey)}</div>
                </div>
              </div>
              <div className="flex justify-between items-center py-2 border-t border-white/10">
                <span className="text-gray-400">Balance</span>
                <span className="text-white font-bold">{wallet.balance?.toFixed(4)} SOL</span>
              </div>
            </div>
            
            <button
              onClick={handleDisconnect}
              className="w-full py-3 rounded-xl font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all"
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {wallets.map((w) => (
              <button
                key={w.name}
                onClick={() => handleWalletSelect(w.name)}
                disabled={isConnecting}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all ${
                  selectedWallet === w.name ? 'bg-purple-500/20 border-purple-500/50' : 'glass'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${w.color} flex items-center justify-center text-2xl`}>
                  {w.icon}
                </div>
                <span className="text-white font-medium">{w.name}</span>
                {isConnecting && selectedWallet === w.name && (
                  <svg className="animate-spin h-5 w-5 ml-auto text-purple-400" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
              </button>
            ))}
            
            <p className="text-gray-500 text-xs text-center mt-4">
              By connecting, you agree to the Terms of Service
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
