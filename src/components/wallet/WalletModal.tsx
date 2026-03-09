'use client';

import { useState, useEffect } from 'react';
import { useWallet, formatAddress } from './WalletContext';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const wallets = [
  { name: 'Phantom', icon: '👻', color: 'from-purple-500 to-purple-600', description: 'Most popular Solana wallet' },
  { name: 'Solflare', icon: '☀️', color: 'from-yellow-500 to-yellow-600', description: 'Best for staking & DeFi' },
  { name: 'Backpack', icon: '🎒', color: 'from-blue-500 to-blue-600', description: 'Cross-chain wallet' },
  { name: 'Exodus', icon: '🚀', color: 'from-orange-500 to-orange-600', description: 'Multi-chain support' },
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md mx-4 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 -z-10" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 pr-8">
            {wallet.connected ? 'Wallet Connected' : 'Connect Wallet'}
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            {wallet.connected ? 'Your wallet is connected' : 'Select a wallet to connect'}
          </p>

          {wallet.connected ? (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-lg">
                    👻
                  </div>
                  <div>
                    <div className="text-white font-semibold text-lg">{wallet.wallet}</div>
                    <div className="text-gray-400 text-sm font-mono">{formatAddress(wallet.publicKey)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center py-3 border-t border-white/10">
                  <span className="text-gray-400">Balance</span>
                  <span className="text-white font-bold text-lg">{wallet.balance?.toFixed(4)} SOL</span>
                </div>
              </div>
              
              <button
                onClick={handleDisconnect}
                className="w-full py-3.5 rounded-xl font-semibold text-red-400 border border-red-500/30 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
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
                  className={`w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all ${
                    selectedWallet === w.name 
                      ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${w.color} flex items-center justify-center text-xl sm:text-2xl shadow-lg flex-shrink-0`}>
                    {w.icon}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm sm:text-base">{w.name}</div>
                    <div className="text-gray-500 text-xs sm:text-sm truncate">{w.description}</div>
                  </div>
                  {isConnecting && selectedWallet === w.name && (
                    <svg className="animate-spin h-5 w-5 text-purple-400 flex-shrink-0" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                </button>
              ))}
              
              <p className="text-gray-500 text-xs text-center mt-5">
                By connecting, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
