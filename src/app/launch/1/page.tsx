'use client';

import Link from 'next/link';
import { useState } from 'react';

const launch = {
  id: '1',
  name: 'Bonkify',
  symbol: 'BKFY',
  description: 'Mobile-first meme coin trading platform built specifically for Seeker and Saga users. Trade meme coins with zero fees on mobile.',
  raiseTarget: 2000000,
  pricePerToken: 0.001,
  totalSupply: 5000000000,
  communityPercent: 75,
  liquidityPercent: 12,
  teamPercent: 5,
  marketingPercent: 8,
  status: 'live',
  type: 'elite',
  website: '#',
  twitter: '@bonkify',
  progress: 78,
  participants: 1250,
  timeline: {
    start: '2025-03-25',
    end: '2025-03-25',
    tge: '2025-04-05',
    vestingDuration: 6,
    vestingCliff: 1,
  },
};

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(0) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function LaunchDetail() {
  const [solAmount, setSolAmount] = useState('');
  const tokensReceived = solAmount ? (parseFloat(solAmount) / launch.pricePerToken).toLocaleString() : '0';

  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      {/* Header */}
      <div className="glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <span>←</span> Back to Launches
          </Link>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-purple-600/30 float">
              {launch.symbol.charAt(0)}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold text-white">{launch.name}</h1>
                {launch.type === 'elite' && (
                  <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
                    ELITE
                  </span>
                )}
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${
                  launch.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  launch.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {launch.status.toUpperCase()}
                </span>
              </div>
              <p className="text-gray-400 mb-4">${launch.symbol}</p>
              <p className="text-gray-300 max-w-2xl mb-4">{launch.description}</p>
              <div className="flex gap-4">
                <a href={launch.website} className="text-purple-400 hover:text-purple-300 transition-colors">🌐 Website</a>
                <a href={`https://twitter.com/${launch.twitter.replace('@', '')}`} className="text-purple-400 hover:text-purple-300 transition-colors">🐦 Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress */}
            <div className="crystal-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Sale Progress</h2>
                <span className="text-2xl font-bold gradient-text">{launch.progress}%</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 rounded-full transition-all"
                  style={{ width: `${launch.progress}%` }}
                />
              </div>
              <div className="flex justify-between mt-3 text-sm">
                <span className="text-gray-400">Raised: <span className="text-white font-medium">{formatCurrency(launch.raiseTarget * launch.progress / 100)}</span></span>
                <span className="text-gray-400">Target: <span className="text-white font-medium">{formatCurrency(launch.raiseTarget)}</span></span>
              </div>
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Participants</span>
                  <span className="text-white font-medium">{launch.participants.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tokenomics */}
            <div className="crystal-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Tokenomics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ['Total Supply', formatNumber(launch.totalSupply)],
                  ['Price', `$${launch.pricePerToken}`],
                  ['Raise Target', formatCurrency(launch.raiseTarget)],
                  ['Liquidity', `${launch.liquidityPercent}%`],
                  ['Community', `${launch.communityPercent}%`],
                  ['Marketing', `${launch.marketingPercent}%`],
                ].map(([l, v], i) => (
                  <div key={i} className="glass rounded-xl p-4">
                    <div className="text-gray-400 text-sm mb-1">{l}</div>
                    <div className="text-white font-bold">{v}</div>
                  </div>
                ))}
              </div>

              {/* Allocation Bar */}
              <div className="mt-6">
                <div className="text-gray-400 text-sm mb-3">Allocation</div>
                <div className="flex h-6 rounded-xl overflow-hidden">
                  <div className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.communityPercent}%` }}>{launch.communityPercent}%</div>
                  <div className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.liquidityPercent}%` }}>{launch.liquidityPercent}%</div>
                  <div className="bg-green-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.teamPercent}%` }}>{launch.teamPercent}%</div>
                  <div className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.marketingPercent}%` }}>{launch.marketingPercent}%</div>
                </div>
                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span className="text-purple-400">● Community</span>
                  <span className="text-blue-400">● Liquidity</span>
                  <span className="text-green-400">● Team</span>
                  <span className="text-yellow-400">● Marketing</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="crystal-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Timeline</h2>
              <div className="space-y-4">
                {[
                  ['Sale Start', formatDate(launch.timeline.start), 'bg-green-500/20 text-green-400'],
                  ['Sale End', formatDate(launch.timeline.end), 'bg-red-500/20 text-red-400'],
                  ['TGE (Token Generation)', formatDate(launch.timeline.tge), 'bg-purple-500/20 text-purple-400'],
                  ['Vesting Duration', `${launch.timeline.vestingDuration} months (cliff: ${launch.timeline.vestingCliff}mo)`, 'bg-blue-500/20 text-blue-400'],
                ].map(([l, v, c], i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <span className="text-gray-400">{l}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-medium">{v}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${c}`}>Upcoming</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Allocation */}
            <div className="crystal-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Allocation</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">Your Limit</div>
                  <div className="text-white font-bold text-xl">5 SOL</div>
                </div>
                <div className="glass rounded-xl p-4">
                  <div className="text-gray-400 text-sm mb-1">NFT Multiplier</div>
                  <div className="gradient-text font-bold text-xl">1.5x</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="crystal-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Participate</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amount (SOL)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    className="w-full glass text-white px-4 py-4 rounded-xl focus:outline-none focus:border-purple-500/50 transition-colors placeholder-gray-500"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    ≈ <span className="text-white font-medium">{tokensReceived}</span> {launch.symbol}
                  </p>
                </div>

                <button className="w-full btn-glossy py-4 rounded-xl font-bold text-white shadow-lg glow-purple">
                  Participate Now
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <span>🔒</span>
                  <span>Secure transaction via Solana</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Your Balance</span>
                    <span className="text-white font-medium">12.5 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Min Buy</span>
                    <span className="text-white font-medium">0.1 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Max Buy</span>
                    <span className="text-white font-medium">5 SOL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Eligible NFTs */}
            <div className="crystal-card rounded-2xl p-6">
              <h2 className="text-lg font-bold text-white mb-4">Your Eligible NFTs</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 glass rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">🏆</div>
                  <div>
                    <div className="text-white font-medium text-sm">Seeker Pioneer</div>
                    <div className="text-green-400 text-xs">1.5x Multiplier</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 glass rounded-xl">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600/30 to-red-600/30 flex items-center justify-center">🟠</div>
                  <div>
                    <div className="text-white font-medium text-sm">Jupiter Aligned</div>
                    <div className="text-green-400 text-xs">1.2x Multiplier</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
