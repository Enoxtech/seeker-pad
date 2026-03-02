'use client';

import Link from 'next/link';

const userNFTs = [
  { id: '1', name: 'Seeker Pioneer', tier: 'Pioneer', mintDate: '2025-01-15', benefits: ['1.3x multiplier', '45min early access'] },
  { id: '2', name: 'Jupiter Aligned', tier: 'Aligned', mintDate: '2025-02-20', benefits: ['1.2x multiplier', '30min early access'] },
];

export default function Profile() {
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
            { id: 'nfts', label: 'NFTs', icon: '🎫' },
            { id: 'settings', label: 'Settings', icon: '⚙️' },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                tab.id === 'overview'
                  ? 'btn-glossy text-white'
                  : 'crystal-card text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6 stagger-children">
          <div className="crystal-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Statistics</h2>
            <div className="space-y-3">
              {[
                ['Total Invested', '12.5 SOL'],
                ['Portfolio Value', '$2,450'],
                ['NFTs Owned', '2'],
                ['Allocation Tier', 'Pioneer (1.5x)'],
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
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg">{a.icon}</div>
                  <div className="flex-1">
                    <div className="text-white font-medium">{a.name}</div>
                    <div className="text-xs text-gray-400">{a.action}</div>
                  </div>
                  <div className="text-xs text-gray-500">{a.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NFTs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Your NFTs</h2>
            <Link href="/nft" className="text-purple-400 hover:text-purple-300 text-sm">+ Get More</Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 stagger-children">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="crystal-card overflow-hidden">
                <div className="h-20 bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-4xl">
                  🏆
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
        </div>
      </div>
    </div>
  );
}
