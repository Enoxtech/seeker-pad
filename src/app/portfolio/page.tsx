'use client';

import Link from 'next/link';

const participations = [
  { id: '1', name: 'SeedVault Wallet', symbol: 'SVW', amount: 2.5, tokens: 25000, status: 'claimed' },
  { id: '2', name: 'Bonkify', symbol: 'BKFY', amount: 5.0, tokens: 50000, status: 'claiming', claimable: 25000 },
  { id: '3', name: 'Solana Mobile dApp Store', symbol: 'MDA', amount: 3.0, tokens: 60000, status: 'upcoming' },
];

export default function Portfolio() {
  const totalInvested = participations.reduce((acc, p) => acc + p.amount, 0);
  const portfolioValue = totalInvested * 50;

  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Portfolio</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger-children">
          {[
            ['Total Invested', `${totalInvested.toFixed(2)} SOL`, 'text-white'],
            ['Portfolio Value', `$${portfolioValue.toFixed(2)}`, 'text-green-400'],
            ['Participations', String(participations.length), 'text-white'],
            ['Claimable', '25,000', 'text-yellow-400'],
          ].map(([l, v, c], i) => (
            <div key={i} className="crystal-card p-5">
              <div className="text-sm text-gray-400 mb-1">{l}</div>
              <div className={`text-2xl font-bold ${c}`}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['active', 'claimed', 'all'].map((tab) => (
            <button
              key={tab}
              className={`px-5 py-3 rounded-xl font-medium transition-all capitalize ${
                tab === 'active' ? 'btn-glossy text-white' : 'crystal-card text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="space-y-3 stagger-children">
          {participations.map((p) => (
            <div key={p.id} className="crystal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-2xl font-bold gradient-text">
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
                  p.status === 'claiming' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                </span>
                {p.status === 'claiming' && (
                  <button className="btn-glossy px-4 py-2 rounded-xl font-medium text-white text-sm">
                    Claim
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {participations.length === 0 && (
          <div className="text-center py-16 crystal-card">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-white mb-2">No participations yet</h3>
            <p className="text-gray-400 mb-6">Start investing in upcoming launches</p>
            <Link href="/" className="btn-glossy px-6 py-3 rounded-xl font-medium inline-block">
              Browse Launches
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
