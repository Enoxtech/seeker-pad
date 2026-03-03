'use client';

import { useWallet, formatAddress } from './useWallet';

export default function WalletButton() {
  const { wallet, disconnect, isConnecting, openWalletModal } = useWallet();

  if (wallet.connected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 glass rounded-xl">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-white font-medium">{wallet.balance?.toFixed(2)} SOL</span>
          <span className="text-gray-400">|</span>
          <span className="text-purple-400 font-medium">{formatAddress(wallet.publicKey)}</span>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 rounded-xl font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={openWalletModal}
      disabled={isConnecting}
      className="btn-glossy px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg glow-purple disabled:opacity-50"
    >
      {isConnecting ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Connecting...
        </span>
      ) : (
        'Connect Wallet'
      )}
    </button>
  );
}
