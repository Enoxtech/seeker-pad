'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/components/wallet/useWallet';
import { getUserParticipations, claimTokens } from '@/data/launches';

export default function Portfolio() {
  const [participations, setParticipations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'claimed' | 'all'>('active');
  
  const { wallet } = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      loadParticipations();
    } else {
      setParticipations([]);
      setLoading(false);
    }
  }, [wallet.connected, wallet.publicKey]);

  const loadParticipations = async () => {
    if (!wallet.publicKey) return;
    
    setLoading(true);
    try {
      const data = await getUserParticipations(wallet.publicKey);
      setParticipations(data);
    } catch (error) {
      console.error('Failed to load participations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (participationId: string) => {
    setClaimingId(participationId);
    try {
      await claimTokens(participationId, `claim_${Date.now()}`);
      await loadParticipations();
    } catch (error) {
      console.error('Failed to claim:', error);
      alert('Failed to claim tokens. Please try again.');
    } finally {
      setClaimingId(null);
    }
  };

  const filteredParticipations = participations.filter(p => {
    if (activeTab === 'active') return p.status !== 'claimed';
    if (activeTab === 'claimed') return p.status === 'claimed';
    return true;
  });

  const totalInvested = participations.reduce((acc, p) => acc + (p.amount || 0), 0);
  const totalClaimable = participations
    .filter(p => p.status !== 'claimed')
    .reduce((acc, p) => acc + (p.claimableAmount || 0), 0);

  if (!wallet.connected) {
    return (
      <div className="min-h-screen pt-24 pb-16 page-enter">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Portfolio</h1>
          
          <div className="text-center py-16 crystal-card">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect your wallet to view your portfolio</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 page-enter">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Portfolio</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10 stagger-children">
          {[
            ['Total Invested', `${totalInvested.toFixed(2)} SOL`, 'text-white'],
            ['Portfolio Value', `$${(totalInvested * 50).toFixed(2)}`, 'text-green-400'],
            ['Participations', String(participations.length), 'text-white'],
            ['Claimable', totalClaimable > 0 ? totalClaimable.toLocaleString() : '0', 'text-yellow-400'],
          ].map(([l, v, c], i) => (
            <div key={i} className="crystal-card p-5">
              <div className="text-sm text-gray-400 mb-1">{l}</div>
              <div className={`text-2xl font-bold ${c}`}>{v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {(['active', 'claimed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-xl font-medium transition-all capitalize ${
                activeTab === tab ? 'btn-glossy text-white' : 'crystal-card text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : filteredParticipations.length > 0 ? (
          <div className="space-y-3 stagger-children">
            {filteredParticipations.map((p) => (
              <div key={p.id} className="crystal-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 card-hover">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-2xl font-bold gradient-text">
                    {(p.launchId || 'L').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Launch #{p.launchId}</h3>
                    <p className="text-sm text-gray-400">{p.amount} SOL → {(p.tokenAmount || p.claimableAmount || 0).toLocaleString()} tokens</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    p.status === 'claimed' ? 'bg-green-500/20 text-green-400' :
                    p.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {p.status?.charAt(0).toUpperCase() + (p.status || 'pending').slice(1)}
                  </span>
                  {p.status === 'pending' && (
                    <button 
                      onClick={() => handleClaim(p.id)}
                      disabled={claimingId === p.id}
                      className="btn-glossy px-4 py-2 rounded-xl font-medium text-white text-sm disabled:opacity-50"
                    >
                      {claimingId === p.id ? 'Claiming...' : 'Claim'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
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
