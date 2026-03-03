'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useWallet } from '@/components/wallet/useWallet';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import ParticipateButton from '@/components/ParticipateButton';

const launchData: Record<string, {
  name: string;
  symbol: string;
  description: string;
  tokenomics: { totalSupply: number; raiseTarget: number; pricePerToken: number; communityPercent: number; liquidityPercent: number; teamPercent: number; marketingPercent: number };
  timeline: { startTime: string; endTime: string; tgeDate: string; vestingDuration: number; vestingCliff: number };
  status: string;
  type: string;
  website: string;
  twitter: string;
  progress: number;
  participants: number;
}> = {
  '1': {
    name: 'Bonkify',
    symbol: 'BKFY',
    description: 'Mobile-first meme coin trading platform built specifically for Seeker and Saga users. Trade meme coins with zero fees on mobile.',
    tokenomics: { totalSupply: 5000000000, raiseTarget: 2000000, pricePerToken: 0.001, communityPercent: 75, liquidityPercent: 12, teamPercent: 5, marketingPercent: 8 },
    timeline: { startTime: '2025-03-25T14:00:00Z', endTime: '2025-03-25T20:00:00Z', tgeDate: '2025-04-05T12:00:00Z', vestingDuration: 6, vestingCliff: 1 },
    status: 'live',
    type: 'elite',
    website: '#',
    twitter: '@bonkify',
    progress: 78,
    participants: 1250,
  },
  '2': {
    name: 'SolanaSaga Phone',
    symbol: 'SAGA',
    description: 'The next generation blockchain phone. Own your keys, own your crypto.',
    tokenomics: { totalSupply: 1000000000, raiseTarget: 5000000, pricePerToken: 0.005, communityPercent: 60, liquidityPercent: 15, teamPercent: 10, marketingPercent: 15 },
    timeline: { startTime: '2025-04-01T14:00:00Z', endTime: '2025-04-07T20:00:00Z', tgeDate: '2025-04-15T12:00:00Z', vestingDuration: 12, vestingCliff: 3 },
    status: 'upcoming',
    type: 'standard',
    website: '#',
    twitter: '@solanamobile',
    progress: 0,
    participants: 0,
  },
  '3': {
    name: 'SeekerX',
    symbol: 'SKRX',
    description: 'DeFi suite built for the Seeker ecosystem. Staking, yield farming, and more.',
    tokenomics: { totalSupply: 100000000, raiseTarget: 1000000, pricePerToken: 0.01, communityPercent: 70, liquidityPercent: 10, teamPercent: 10, marketingPercent: 10 },
    timeline: { startTime: '2025-03-20T14:00:00Z', endTime: '2025-03-22T20:00:00Z', tgeDate: '2025-03-30T12:00:00Z', vestingDuration: 6, vestingCliff: 1 },
    status: 'ended',
    type: 'elite',
    website: '#',
    twitter: '@seekerx',
    progress: 100,
    participants: 3420,
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
  const params = useParams();
  const id = params?.id as string;
  const [solAmount, setSolAmount] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);
  const [participationSuccess, setParticipationSuccess] = useState(false);
  
  const { wallet, connect, openWalletModal } = useWallet();
  const launch = launchData[id] || launchData['1'];
  
  const tokensReceived = solAmount ? (parseFloat(solAmount) / launch.tokenomics.pricePerToken).toLocaleString() : '0';

  const handleParticipate = async () => {
    if (!wallet.connected) {
      openWalletModal();
      return;
    }

    if (!solAmount || parseFloat(solAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(solAmount) > (wallet.balance || 0)) {
      alert('Insufficient balance');
      return;
    }

    setIsParticipating(true);

    // Simulate participation (in production, this would send a real transaction)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setParticipationSuccess(true);
      setSolAmount('');
    } catch (error) {
      console.error('Participation error:', error);
      alert('Failed to participate. Please try again.');
    } finally {
      setIsParticipating(false);
    }
  };

  const isLive = launch.status === 'live';

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
            {launch.status !== 'upcoming' && (
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
                  <span className="text-gray-400">Raised: <span className="text-white font-medium">{formatCurrency(launch.tokenomics.raiseTarget * launch.progress / 100)}</span></span>
                  <span className="text-gray-400">Target: <span className="text-white font-medium">{formatCurrency(launch.tokenomics.raiseTarget)}</span></span>
                </div>
                {launch.participants > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Participants</span>
                      <span className="text-white font-medium">{launch.participants.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tokenomics */}
            <div className="crystal-card rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Tokenomics</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ['Total Supply', formatNumber(launch.tokenomics.totalSupply)],
                  ['Price', `$${launch.tokenomics.pricePerToken}`],
                  ['Raise Target', formatCurrency(launch.tokenomics.raiseTarget)],
                  ['Liquidity', `${launch.tokenomics.liquidityPercent}%`],
                  ['Community', `${launch.tokenomics.communityPercent}%`],
                  ['Marketing', `${launch.tokenomics.marketingPercent}%`],
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
                  <div className="bg-purple-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.tokenomics.communityPercent}%` }}>{launch.tokenomics.communityPercent}%</div>
                  <div className="bg-blue-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.tokenomics.liquidityPercent}%` }}>{launch.tokenomics.liquidityPercent}%</div>
                  <div className="bg-green-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.tokenomics.teamPercent}%` }}>{launch.tokenomics.teamPercent}%</div>
                  <div className="bg-yellow-500 flex items-center justify-center text-xs text-white font-medium" style={{ width: `${launch.tokenomics.marketingPercent}%` }}>{launch.tokenomics.marketingPercent}%</div>
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
                  ['Sale Start', formatDate(launch.timeline.startTime), 'bg-green-500/20 text-green-400'],
                  ['Sale End', formatDate(launch.timeline.endTime), 'bg-red-500/20 text-red-400'],
                  ['TGE (Token Generation)', formatDate(launch.timeline.tgeDate), 'bg-purple-500/20 text-purple-400'],
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
            {launch.status !== 'upcoming' && (
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
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="crystal-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">
                {launch.status === 'upcoming' ? 'Upcoming Sale' : 'Participate'}
              </h2>
              
              {/* Success Message */}
              {participationSuccess && (
                <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                  <div className="text-green-400 font-medium text-sm">✅ Participation Successful!</div>
                  <div className="text-gray-400 text-xs mt-1">Your tokens will be claimable after TGE</div>
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Amount (SOL)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    disabled={launch.status === 'upcoming' || !wallet.connected}
                    className="w-full glass text-white px-4 py-4 rounded-xl focus:outline-none focus:border-purple-500/50 transition-colors placeholder-gray-500 disabled:opacity-50"
                  />
                  <p className="text-gray-400 text-sm mt-2">
                    ≈ <span className="text-white font-medium">{tokensReceived}</span> {launch.symbol}
                  </p>
                </div>

                <button 
                  onClick={handleParticipate}
                  disabled={isParticipating || launch.status === 'upcoming'}
                  className="w-full btn-glossy py-4 rounded-xl font-bold text-white shadow-lg glow-purple disabled:opacity-50"
                >
                  {isParticipating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : launch.status === 'upcoming' ? (
                    'Coming Soon'
                  ) : !wallet.connected ? (
                    'Connect Wallet to Participate'
                  ) : (
                    'Participate Now'
                  )}
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
                    <span className="text-white font-medium">
                      {wallet.connected ? `${wallet.balance?.toFixed(4) || 0} SOL` : '—'}
                    </span>
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
            {launch.status !== 'upcoming' && wallet.connected && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
