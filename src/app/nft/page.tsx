'use client';

import Link from 'next/link';

const nftCategories = [
  { id: 'saga', name: 'Saga Genesis', desc: 'Original Saga device owners', supply: '10,000', color: 'from-purple-500 to-pink-500', benefits: ['1.5x multiplier', '1 hour early access', 'Elite access'] },
  { id: 'seeker', name: 'Seeker Pioneer', desc: 'Seeker device owners', supply: '50,000', color: 'from-blue-500 to-cyan-500', benefits: ['1.3x multiplier', '45 min early access', 'Elite access'] },
  { id: 'jupiter', name: 'Jupiter Aligned', desc: 'JUP token stakers', supply: '25,000', color: 'from-orange-500 to-red-500', benefits: ['1.2x multiplier', '30 min early access', 'Elite access'] },
  { id: 'bonk', name: 'Bonk Community', desc: 'BONK token stakers', supply: '25,000', color: 'from-yellow-500 to-orange-500', benefits: ['1.1x multiplier', '30 min early access', 'Elite access'] },
  { id: 'meteora', name: 'Meteora LP', desc: 'Meteora liquidity providers', supply: '15,000', color: 'from-green-500 to-emerald-500', benefits: ['1.2x multiplier', '30 min early access', 'Elite access'] },
];

export default function NFTHub() {
  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="inline-block px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-sm mb-6">
            EXCLUSIVE ACCESS
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">SeekerPad NFT</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Unlock exclusive access to the Elite Launchpad. Hold an NFT to get guaranteed allocations, 
            priority participation, and boosted multipliers.
          </p>
          <button 
            className="btn-glossy px-8 py-4 rounded-2xl font-bold text-white"
            onClick={() => window.dispatchEvent(new CustomEvent('open-wallet-modal'))}
          >
            Check Eligibility
          </button>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="crystal-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[['30K+', 'NFTs Minted'], ['20K+', 'Elite Holders'], ['10', 'Elite Launches'], ['85%', 'Participation']].map(([v, l], i) => (
                <div key={i}>
                  <div className="text-3xl font-bold gradient-text mb-1">{v}</div>
                  <div className="text-sm text-gray-500">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">NFT Categories</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {nftCategories.map((cat) => (
              <div key={cat.id} className="crystal-card overflow-hidden card-hover">
                <div className={`h-28 bg-gradient-to-r ${cat.color} flex items-center justify-center relative`}>
                  <span className="text-5xl">🏆</span>
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{cat.desc}</p>
                  <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-500">Supply</span>
                    <span className="text-white font-medium">{cat.supply}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {cat.benefits.map((b, i) => (
                      <li key={i} className="text-sm text-green-400 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> {b}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 bg-white/5 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all">
                    Mint NFT
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 stagger-children">
            {[['1', 'Check Eligibility', 'Connect your wallet and verify eligibility'], ['2', 'Mint Your NFT', 'Mint based on your category'], ['3', 'Access Elite', 'Enjoy exclusive benefits']].map(([n, t, d], i) => (
              <div key={i} className="crystal-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-2xl font-bold text-white">{n}</div>
                <h3 className="text-lg font-bold text-white mb-2">{t}</h3>
                <p className="text-sm text-gray-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
