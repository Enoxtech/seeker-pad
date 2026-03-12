'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Mock data
const launches = [
  {
    id: '1',
    name: 'Solana Mobile dApp Store',
    symbol: 'MDA',
    description: 'The official dApp store for Solana Mobile devices. Discover and install native mobile dApps directly on your Seeker or Saga device.',
    raiseTarget: 5000000,
    pricePerToken: 0.05,
    totalSupply: 1000000000,
    communityPercent: 70,
    status: 'upcoming',
    type: 'standard',
  },
  {
    id: '2',
    name: 'Bonkify',
    symbol: 'BKFY',
    description: 'Mobile-first meme coin trading platform built specifically for Seeker and Saga users. Trade meme coins with zero fees.',
    raiseTarget: 2000000,
    pricePerToken: 0.001,
    totalSupply: 5000000000,
    communityPercent: 75,
    status: 'live',
    type: 'elite',
  },
  {
    id: '3',
    name: 'SeedVault Wallet',
    symbol: 'SVW',
    description: 'Hardware-grade mobile wallet with Seed Vault integration. The most secure way to manage your Solana assets.',
    raiseTarget: 8000000,
    pricePerToken: 0.10,
    totalSupply: 500000000,
    communityPercent: 60,
    status: 'ended',
    type: 'standard',
  },
];

const stats = [
  { label: 'Total Raised', value: '$5M+' },
  { label: 'Launches', value: '25+' },
  { label: 'Active Users', value: '15K+' },
  { label: 'NFTs Minted', value: '30K+' },
];

const features = [
  { icon: '🔐', title: 'Seed Vault Security', description: 'Hardware-level security for your assets with Seeker/Saga integration' },
  { icon: '⚡', title: 'Mobile-First', description: 'Designed specifically for the best mobile crypto experience' },
  { icon: '🎯', title: 'Exclusive Access', description: 'NFT-gated launches with guaranteed allocations' },
  { icon: '🚀', title: 'Early Access', description: 'Get priority access to the hottest Solana Mobile projects' },
];

function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(num);
}

function formatNumber(num: number): string {
  if (num >= 1000000000) return (num / 1000000000).toFixed(0) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(0) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num.toString();
}

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLaunches = launches.filter(launch => {
    const matchesFilter = filter === 'all' || launch.status === filter;
    const matchesSearch = launch.name.toLowerCase().includes(searchQuery.toLowerCase()) || launch.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ended': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen pt-24 page-enter particles">
      {/* Hero */}
      <section className="relative py-20 lg:py-32 px-4 overflow-hidden">
        {/* Floating Orbs */}
        <div className="absolute top-40 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] float" />
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-600/15 rounded-full blur-[120px] float-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full crystal-card mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">Solana Mobile Exclusive</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Discover & Invest</span>
            <br />
            <span className="text-white">in Solana Projects</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The premier launchpad for Seeker & Saga users. 
            Access early-stage tokens with NFT-gated exclusive benefits.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="#launches" 
              className="btn-glossy px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-lg glow-purple"
              style={{ transition: 'all 1s ease-in-out' }}
            >
              View Launches
            </Link>
            <Link href="/nft" className="px-8 py-4 rounded-2xl font-bold text-gray-400 border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all text-lg">
              Get NFT Access
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="crystal-card p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold gradient-text mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {features.map((feature, i) => (
              <div key={i} className="crystal-card p-6 text-center card-hover">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Price Chart */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="crystal-card p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">SOL Price</h2>
                <p className="text-gray-400 text-sm">Live price from Jupiter Aggregator</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">$142.85</div>
                  <div className="text-sm text-green-400">+2.4% (24h)</div>
                </div>
              </div>
            </div>
            {/* Chart Placeholder */}
            <div className="h-48 flex items-end justify-between gap-2 px-4">
              {[35, 45, 38, 52, 48, 60, 55, 68, 62, 75, 70, 85, 78, 90, 82, 95, 88, 100].map((height, i) => (
                <div key={i} className="flex-1 bg-gradient-to-t from-purple-600/50 to-pink-600/50 rounded-t" style={{ height: `${height}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>1H</span>
              <span>24H</span>
              <span>7D</span>
              <span>30D</span>
              <span>1Y</span>
            </div>
          </div>
        </div>
      </section>

      {/* Launches */}
      <section id="launches" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Token Launches</h2>
              <p className="text-gray-400">Discover and participate in exclusive token sales</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="crystal-card w-full sm:w-48 px-4 py-3 pl-10 rounded-xl text-white placeholder-gray-500 focus:outline-none"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              </div>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="crystal-card px-4 py-3 rounded-xl text-white focus:outline-none cursor-pointer"
              >
                <option value="all">All</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {filteredLaunches.map((launch) => (
              <Link 
                key={launch.id}
                href={`/launch/${launch.id}`}
                className="crystal-card overflow-hidden card-hover group"
              >
                <div className="p-6 border-b border-white/5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center">
                        <span className="text-xl font-bold gradient-text">{launch.symbol.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-purple-400 transition-colors">{launch.name}</h3>
                        <span className="text-sm text-gray-500">${launch.symbol}</span>
                      </div>
                    </div>
                    {launch.type === 'elite' && (
                      <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">ELITE</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(launch.status)}`}>
                      {launch.status.toUpperCase()}
                    </span>
                    {launch.status === 'live' && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm text-gray-400 mb-5 line-clamp-2">{launch.description}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="text-xs text-gray-500">Raise</span><div className="text-white font-bold">{formatCurrency(launch.raiseTarget)}</div></div>
                    <div><span className="text-xs text-gray-500">Price</span><div className="text-white font-bold">${launch.pricePerToken}</div></div>
                    <div><span className="text-xs text-gray-500">Supply</span><div className="text-white font-bold">{formatNumber(launch.totalSupply)}</div></div>
                    <div><span className="text-xs text-gray-500">Community</span><div className="text-green-400 font-bold">{launch.communityPercent}%</div></div>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  <div className="w-full py-3 bg-white/5 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 text-center text-white font-semibold rounded-xl transition-all">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredLaunches.length === 0 && (
            <div className="text-center py-16 crystal-card">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-white mb-2">No launches found</h3>
              <p className="text-gray-400">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="crystal-card p-12 glow-multi">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to get started?</h2>
            <p className="text-gray-400 mb-8 text-lg">Connect your wallet and start discovering exclusive Solana Mobile projects today.</p>
            <Link href="/profile" className="btn-glossy px-10 py-4 rounded-2xl font-bold text-white text-lg glow-purple">
              Launch App 🚀
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
