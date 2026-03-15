'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the SwapWidget to avoid SSR issues with wallet
const SwapWidget = dynamic(() => import('@/components/SwapWidget'), {
  ssr: false,
  loading: () => (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10">
      <div className="animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-1/2 mb-4"></div>
        <div className="h-64 bg-slate-700 rounded-xl"></div>
      </div>
    </div>
  ),
});

export default function SwapPage() {
  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            🔄 Token Swap
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Instantly swap between SOL, USDC, and thousands of other tokens. 
            Best rates powered by Jupiter Aggregator.
          </p>
        </div>

        {/* Supported Tokens Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>💰</span> Supported Input Tokens
            </h3>
            <div className="space-y-3">
              {[
                { name: 'SOL', symbol: 'SOL', icon: 'SOL' },
                { name: 'USDC', symbol: 'USDC', icon: '💵' },
                { name: 'USDT', symbol: 'USDT', icon: '💴' },
                { name: 'mSOL', symbol: 'MSOL', icon: '☀️' },
                { name: 'jitoSOL', symbol: 'JSOL', icon: '🎯' },
              ].map((token) => (
                <div key={token.symbol} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-sm">
                    {token.icon}
                  </div>
                  <span className="text-white font-medium">{token.name}</span>
                  <span className="text-slate-500 text-sm">({token.symbol})</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>✨</span> Supported Output Tokens
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Any SPL Token', symbol: 'SPL', icon: '🪙' },
                { name: 'Tokens on SeekerPad', symbol: 'IDOs', icon: '🚀' },
                { name: 'NFTs', symbol: 'NFT', icon: '🎨' },
                { name: 'Governance', symbol: 'DAO', icon: '🏛️' },
                { name: 'Wrapped Tokens', symbol: 'WSOL', icon: '🔗' },
              ].map((token) => (
                <div key={token.symbol} className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl">
                  <div className="w-8 h-8 rounded-full bg-pink-600/30 flex items-center justify-center text-sm">
                    {token.icon}
                  </div>
                  <span className="text-white font-medium">{token.name}</span>
                  <span className="text-slate-500 text-sm">({token.symbol})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Jupiter Swap Widget */}
        <Suspense fallback={<div className="text-white">Loading swap widget...</div>}>
          <SwapWidget />
        </Suspense>

        {/* Additional Info */}
        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-2xl">
          <h3 className="text-lg font-bold text-blue-400 mb-2">💡 How to Swap</h3>
          <ol className="space-y-2 text-slate-300">
            <li>1. Connect your wallet (Phantom, Solflare, or other Solana wallets)</li>
            <li>2. Select the token you want to sell (e.g., SOL)</li>
            <li>3. Select the token you want to buy</li>
            <li>4. Enter the amount and click &quot;Swap&quot;</li>
            <li>5. Confirm the transaction in your wallet</li>
          </ol>
        </div>

        {/*DEX Aggregators Used */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm mb-3">Powered by the best DEX aggregators:</p>
          <div className="flex justify-center gap-6 opacity-60">
            <span className="text-white font-medium">Jupiter</span>
            <span className="text-white font-medium">Raydium</span>
            <span className="text-white font-medium">Orca</span>
            <span className="text-white font-medium">Serum</span>
          </div>
        </div>
      </div>
    </div>
  );
}