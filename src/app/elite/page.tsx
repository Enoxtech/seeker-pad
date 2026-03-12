'use client';

import Link from 'next/link';

const eliteLaunches = [
  { id: '2', name: 'Bonkify', symbol: 'BKFY', desc: 'Mobile-first meme coin trading platform', raise: '$2M', price: '$0.001', status: 'live' },
];

const benefits = [
  { icon: '🎯', title: 'Guaranteed Allocation', desc: 'Never miss out' },
  { icon: '⚡', title: 'Priority Access', desc: 'Up to 1 hour early' },
  { icon: '📈', title: 'Boosted Multipliers', desc: 'Up to 1.5x bonus' },
  { icon: '🔐', title: 'Private Launches', desc: 'Exclusive sales' },
];

export default function Elite() {
  return (
    <div className="min-h-screen pt-24 pb-16 page-enter particles">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm mb-6">
            🔒 Exclusive Access
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Elite Launchpad</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Exclusive token launches for NFT holders. Guaranteed allocations, priority access, and boosted multipliers.
          </p>
          <button 
            className="btn-glossy px-8 py-4 rounded-2xl font-bold text-white"
            onClick={() => window.dispatchEvent(new CustomEvent('open-wallet-modal'))}
          >
            Connect Wallet
          </button>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="crystal-card p-6">
            <h2 className="text-xl font-bold text-white mb-6 text-center">Elite Benefits</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {benefits.map((b, i) => (
                <div key={i} className="crystal-card p-5 text-center">
                  <div className="text-3xl mb-3">{b.icon}</div>
                  <h3 className="text-white font-semibold mb-1">{b.title}</h3>
                  <p className="text-gray-500 text-sm">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">Elite Launches</h2>
          
          {eliteLaunches.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {eliteLaunches.map((launch) => (
                <Link key={launch.id} href={`/launch/${launch.id}`} className="crystal-card overflow-hidden card-hover border-purple-500/30">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                          <span className="text-xl font-bold gradient-text">{launch.symbol.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{launch.name}</h3>
                          <span className="text-sm text-gray-500">${launch.symbol}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
                      launch.status === 'live' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {launch.status === 'live' && <span className="live-dot" />}
                      {launch.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="p-6">
                    <p className="text-sm text-gray-400 mb-4">{launch.desc}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-500">Raise</span><div className="text-white font-bold">{launch.raise}</div></div>
                      <div><span className="text-gray-500">Price</span><div className="text-white font-bold">{launch.price}</div></div>
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="w-full py-3 bg-white/5 hover:bg-purple-600 text-center text-white font-medium rounded-xl transition-all">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 crystal-card">
              <p className="text-gray-400 text-lg mb-4">No Elite launches available</p>
              <Link href="/nft" className="btn-glossy px-6 py-3 rounded-xl font-medium inline-block">
                Get NFT Access
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center crystal-card p-10">
          <h2 className="text-2xl font-bold text-white mb-4">Don't Have an NFT?</h2>
          <p className="text-gray-400 mb-6">Get your SeekerPad NFT to unlock exclusive access.</p>
          <Link href="/nft" className="btn-glossy px-8 py-4 rounded-2xl font-bold text-white inline-block">
            Get NFT Access
          </Link>
        </div>
      </section>
    </div>
  );
}
