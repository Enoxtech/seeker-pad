'use client';

import { useState } from 'react';
import Link from 'next/link';

const userNFTs = [
  { id: '1', name: 'Seeker Pioneer', tier: 'Pioneer', mintDate: '2025-01-15', benefits: ['1.3x multiplier', '45min early access'] },
  { id: '2', name: 'Jupiter Aligned', tier: 'Aligned', mintDate: '2025-02-20', benefits: ['1.2x multiplier', '30min early access'] },
];

const stakingPositions = [
  { id: '1', token: 'JUP', amount: 5000, apy: 12.5, earned: 125.5, lockPeriod: 'Unlocked' },
  { id: '2', token: 'BONK', amount: 1000000, apy: 8.2, earned: 420.3, lockPeriod: '30 days left' },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Header */}
        <div className="crystal-card p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-5xl shadow-lg shadow-purple-600/30 float">
              👤
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl font-bold text-white">DeFi User</h1>
                <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg self-start">
                  PIONEER
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400 mb-4">
                <span className="font-mono bg-white/5 px-3 py-1 rounded-lg">7x9...3K2p</span>
                <span>•</span>
                <span>Member since Jan 2025</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="crystal-card px-4 py-2">
                  <div className="text-xs text-gray-400">Tier</div>
                  <div className="text-white font-semibold">Pioneer</div>
                </div>
                <div className="crystal-card px-4 py-2">
                  <div className="text-xs text-gray-400">Multiplier</div>
                  <div className="text-purple-400 font-semibold">1.5x</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="crystal-card p-4 text-center">
                <div className="text-2xl font-bold text-white">$2,450</div>
                <div className="text-xs text-gray-400">Portfolio</div>
              </div>
              <div className="crystal-card p-4 text-center">
                <div className="text-2xl font-bold text-white">5</div>
                <div className="text-xs text-gray-400">Participations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'participations', label: 'Participations', icon: '🎯' },
            { id: 'staking', label: 'Staking', icon: '🔒' },
            { id: 'nfts', label: 'NFTs', icon: '🎫' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'btn-glossy text-white'
                  : 'crystal-card text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-2 gap-6 stagger-children">
            <div className="crystal-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
              <div className="space-y-3">
                {[
                  ['Total Invested', '12.5 SOL'],
                  ['Portfolio Value', '$2,450'],
                  ['NFTs Owned', '2'],
                  ['Allocation Tier', 'Pioneer (1.5x)'],
                  ['Staked Value', '$1,250'],
                  ['Total Earned', '$545.80'],
                ].map(([l, v], i) => (
                  <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400">{l}</span>
                    <span className="text-white font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="crystal-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {[
                  { name: 'Bonkify', action: 'Participated', date: '2 hours ago', icon: '🎯' },
                  { name: 'SeedVault Wallet', action: 'Claimed', date: '1 day ago', icon: '✅' },
                  { name: 'Solana Mobile dApp Store', action: 'Whitelisted', date: '3 days ago', icon: '⭐' },
                  { name: 'JUP Staking', action: 'Rewards Claimed', date: '5 days ago', icon: '🔒' },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">{a.icon}</div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{a.name}</div>
                      <div className="text-xs text-gray-500">{a.action}</div>
                    </div>
                    <div className="text-xs text-gray-500">{a.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Participations Tab */}
        {activeTab === 'participations' && (
          <div className="space-y-4 stagger-children">
            {[
              { name: 'Bonkify', symbol: 'BKFY', amount: 5, tokens: 50000, status: 'active', date: '2 hours ago' },
              { name: 'SeedVault Wallet', symbol: 'SVW', amount: 2.5, tokens: 25000, status: 'claimed', date: '1 day ago' },
              { name: 'Solana Mobile dApp Store', symbol: 'MDA', amount: 3, tokens: 60000, status: 'upcoming', date: '3 days ago' },
            ].map((p, i) => (
              <div key={i} className="crystal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-xl font-bold gradient-text">
                    {p.symbol.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{p.name}</h3>
                    <p className="text-sm text-gray-400">{p.amount} SOL → {p.tokens.toLocaleString()} {p.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === 'claimed' ? 'bg-green-500/20 text-green-400' :
                    p.status === 'active' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                  </span>
                  {p.status === 'active' && (
                    <button className="btn-glossy px-4 py-2 rounded-xl font-medium text-white text-sm">
                      Claim
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Staking Tab */}
        {activeTab === 'staking' && (
          <div className="space-y-6">
            <div className="crystal-card p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Your Staking Positions</h2>
                <button className="btn-glossy px-4 py-2 rounded-xl font-medium text-white text-sm">
                  + New Stake
                </button>
              </div>
              <div className="space-y-4">
                {stakingPositions.map((s) => (
                  <div key={s.id} className="glass rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-xl font-bold gradient-text">
                          {s.token.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{s.token}</h3>
                          <p className="text-sm text-gray-400">{s.amount.toLocaleString()} tokens</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-xs text-gray-400">APY</div>
                          <div className="text-green-400 font-bold">{s.apy}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Earned</div>
                          <div className="text-white font-bold">{s.earned}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-gray-400">Lock</div>
                          <div className="text-white font-medium text-sm">{s.lockPeriod}</div>
                        </div>
                        <button className="px-4 py-2 rounded-xl font-medium text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 text-sm">
                          Manage
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Staking Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                ['Total Staked', '$1,250', 'text-white'],
                ['Total Earned', '$545.80', 'text-green-400'],
                ['Avg APY', '10.35%', 'text-purple-400'],
                ['Active Positions', '2', 'text-white'],
              ].map(([l, v, c], i) => (
                <div key={i} className="crystal-card p-4 text-center">
                  <div className="text-xs text-gray-400 mb-1">{l}</div>
                  <div className={`text-xl font-bold ${c}`}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFTs Tab */}
        {activeTab === 'nfts' && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
              {userNFTs.map((nft) => (
                <div key={nft.id} className="crystal-card overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 text-center">
                    <div className="text-5xl mb-2">🏆</div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold">{nft.name}</h3>
                      <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded">
                        {nft.tier}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Minted: {nft.mintDate}</p>
                    <div className="space-y-1">
                      {nft.benefits.map((b, i) => (
                        <p key={i} className="text-xs text-green-400">✓ {b}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/nft" className="text-purple-400 hover:text-purple-300 text-sm">+ Get More NFTs</Link>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6 stagger-children">
            <div className="crystal-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-white font-medium">Email Notifications</div>
                    <div className="text-xs text-gray-400">Receive updates about launches</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-purple-600 relative">
                    <span className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div>
                    <div className="text-white font-medium">Marketing Emails</div>
                    <div className="text-xs text-gray-400">Receive promotional content</div>
                  </div>
                  <button className="w-12 h-6 rounded-full bg-gray-600 relative">
                    <span className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="text-white font-medium">Two-Factor Authentication</div>
                    <div className="text-xs text-gray-400">Add extra security</div>
                  </div>
                  <button className="px-4 py-2 rounded-xl text-purple-400 border border-purple-500/30 hover:bg-purple-500/10 text-sm">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            <div className="crystal-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="text-white font-medium">Default Currency</div>
                  <select className="glass text-white px-3 py-2 rounded-xl">
                    <option>USD</option>
                    <option>SOL</option>
                    <option>EUR</option>
                  </select>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <div className="text-white font-medium">Theme</div>
                  <select className="glass text-white px-3 py-2 rounded-xl">
                    <option>Dark</option>
                    <option>Light</option>
                    <option>System</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="crystal-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Connected Wallets</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 glass rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👻</span>
                    <div>
                      <div className="text-white font-medium">Phantom</div>
                      <div className="text-xs text-gray-400">7x9K...3K2p</div>
                    </div>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">Connected</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
