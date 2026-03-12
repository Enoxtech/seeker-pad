'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getLaunches } from '@/data/launches';
import { Launch } from '@/types';
import { Badge, RippleButton } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

// Countdown Timer Component
function CountdownTimer({ targetDate, status }: { targetDate: Date; status: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (status === 'ended') return null;

  return (
    <div className="flex gap-1.5 mt-3">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1.5 min-w-[40px]">
            <span className="text-white font-bold text-sm tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase mt-0.5">{unit.slice(0, 3)}</span>
        </div>
      ))}
    </div>
  );
}

// Progress Bar Component
function ProgressBar({ raised, target }: { raised: number; target: number }) {
  const percentage = Math.min((raised / target) * 100, 100);

  return (
    <div className="mt-3">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-400">Progress</span>
        <span className="text-purple-400 font-medium">{percentage.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden progress-bar">
        <div 
          className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gray-950 pt-14 md:pt-16 particles">
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
                <div className="p-4 md:p-5 border-b border-gray-800/50">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 rounded-xl skeleton" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-24 bg-gray-800 rounded skeleton" />
                      <div className="h-3 w-12 bg-gray-800 rounded skeleton" />
                    </div>
                  </div>
                </div>
                <div className="p-4 md:p-5 space-y-3">
                  <div className="h-3 w-full bg-gray-800 rounded skeleton" />
                  <div className="h-3 w-3/4 bg-gray-800 rounded skeleton" />
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="h-4 w-16 bg-gray-800 rounded skeleton" />
                    <div className="h-4 w-20 bg-gray-800 rounded skeleton" />
                  </div>
                </div>
                <div className="px-4 md:px-5 pb-4 md:pb-5">
                  <div className="h-10 bg-gray-800 rounded-lg skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredLaunches.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredLaunches.map((launch) => (
              <Link 
                key={launch.id} 
                href={`/launch/${launch.id}`}
                className="group block bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden card-hover card-glow"
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
                      <div className={`flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border ${
                        launch.status === 'live' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                        launch.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {launch.status === 'live' && <span className="live-dot" />}
                        {launch.status?.toUpperCase() || 'UPCOMING'}
                      </div>
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

                  {/* Progress & Countdown */}
                  {launch.status !== 'ended' && (
                    <div className="mt-4 pt-4 border-t border-gray-800/50">
                      {launch.totalRaised && launch.hardCap && (
                        <ProgressBar raised={launch.totalRaised} target={launch.hardCap} />
                      )}
                      {launch.startTime && launch.status === 'upcoming' && (
                        <CountdownTimer targetDate={new Date(launch.startTime)} status={launch.status} />
                      )}
                      {launch.endTime && launch.status === 'live' && (
                        <CountdownTimer targetDate={new Date(launch.endTime)} status={launch.status} />
                      )}
                    </div>
                  )}
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
