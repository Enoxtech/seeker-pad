'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLaunches } from '@/data/launches';
import { Launch } from '@/types';
import { Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export default function Launchpad() {
  const [launches, setLaunches] = useState<Launch[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'standard' | 'elite'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'raise' | 'price'>('date');

  useEffect(() => {
    getLaunches().then((data) => {
      setLaunches(data);
      setLoading(false);
    });
  }, []);

  const filteredLaunches = launches
    .filter((l) => statusFilter === 'all' || l.status === statusFilter)
    .filter((l) => typeFilter === 'all' || l.type === typeFilter)
    .sort((a, b) => {
      const aTimeline = a.timeline || { startTime: a.startTime || new Date() };
      const bTimeline = b.timeline || { startTime: b.startTime || new Date() };
      if (sortBy === 'date') return new Date(bTimeline.startTime).getTime() - new Date(aTimeline.startTime).getTime();
      const aTokenomics = a.tokenomics || { raiseTarget: a.hardCap || 0, pricePerToken: a.launchPrice || 0 };
      const bTokenomics = b.tokenomics || { raiseTarget: b.hardCap || 0, pricePerToken: b.launchPrice || 0 };
      if (sortBy === 'raise') return bTokenomics.raiseTarget - aTokenomics.raiseTarget;
      return aTokenomics.pricePerToken - bTokenomics.pricePerToken;
    });

  return (
    <div className="min-h-screen bg-gray-950 pt-14 md:pt-16">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-900/20 to-transparent py-8 md:py-12 px-3 md:px-4 pt-20">
        <div className="max-w-7xl mx-auto">
          <Badge variant="elite" className="mb-4">🚀 Launchpad</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Token Launches
          </h1>
          <p className="text-gray-400 max-w-xl">
            Discover and participate in the latest Solana Mobile token launches. 
            Filter by status or type to find your next investment.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-14 md:top-16 z-40 bg-gray-950/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Status Pills */}
            <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
              {(['all', 'live', 'upcoming', 'ended'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* Type & Sort */}
            <div className="flex gap-2 ml-auto">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as typeof typeFilter)}
                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Types</option>
                <option value="standard">Standard</option>
                <option value="elite">Elite Only</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">Sort by Date</option>
                <option value="raise">Sort by Raise</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredLaunches.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredLaunches.map((launch) => (
              <Link
                key={launch.id}
                href={`/launch/${launch.id}`}
                className="group block bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden card-hover"
              >
                <div className="p-4 md:p-5 border-b border-gray-800/50">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500/30 to-blue-500/30 rounded-xl flex items-center justify-center text-lg md:text-xl font-bold text-purple-400">
                        {launch.symbol.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-white truncate">{launch.name}</h3>
                        <span className="text-sm text-gray-500">${launch.symbol}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {launch.type === 'elite' && <Badge variant="elite" size="sm">ELITE</Badge>}
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${
                        launch.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        launch.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {launch.status?.toUpperCase() || 'UPCOMING'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 md:p-5">
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">{launch.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Raise</span>
                      <div className="text-white font-semibold">${(((launch.tokenomics?.raiseTarget ?? launch.hardCap) ?? 0) / 1e6).toFixed(1)}M</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Price</span>
                      <div className="text-white font-semibold">${launch.tokenomics?.pricePerToken ?? launch.launchPrice ?? 0}</div>
                    </div>
                  </div>
                </div>

                <div className="px-4 md:px-5 pb-4 md:pb-5">
                  <div className="py-2.5 bg-gray-800/50 group-hover:bg-purple-600/20 text-center text-sm font-medium text-gray-400 group-hover:text-purple-400 rounded-lg transition-colors">
                    View Details →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400">No launches match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
