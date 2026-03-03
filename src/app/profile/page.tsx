'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWallet } from '@/components/wallet/useWallet';
import { getUserNFTs, checkEligibility } from '@/data/launches';

export default function Profile() {
  const [activeTab, setActiveTab] = useState('overview');
  const [nfts, setNfts] = useState<any[]>([]);
  const [eligibility, setEligibility] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const { wallet } = useWallet();

  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [wallet.connected, wallet.publicKey]);

  const loadData = async () => {
    if (!wallet.publicKey) return;
    
    setLoading(true);
    try {
      const [nftsData, eligibilityData] = await Promise.all([
        getUserNFTs(wallet.publicKey),
        checkEligibility(wallet.publicKey),
      ]);
      setNfts(nftsData);
      setEligibility(eligibilityData);
    } catch (error) {
      console.error('Failed to load profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!wallet.connected) {
    return (
      <div className="min-h-screen pt-24 pb-16 page-enter">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Profile</h1>
          
          <div className="text-center py-16 crystal-card">
            <div className="text-5xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-white mb-2">Connect Your Wallet</h3>
            <p className="text-gray-400 mb-6">Connect your wallet to view your profile</p>
          </div>
        </div>
      </div>
    );
  }

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

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
                <h1 className="text-2xl font-bold text-white">SeekerPad User</h1>
                {eligibility?.isEligible && (
                  <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg self-start">
                    ELITE
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-400 mb-4">
                <span className="font-mono bg-white/5 px-3 py-1 rounded-lg">{formatAddress(wallet.publicKey || '')}</span>
                <span>•</span>
                <span>Member since {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex flex-wrap gap-3">
                <div className="crystal-card px-4 py-2">
                  <div className="text-xs text-gray-400">Tier</div>
                  <div className="text-white font-semibold">{eligibility?.categories?.find(c => c.isEligible)?.category || 'Explorer'}</div>
                </div>
                <div className="crystal-card px-4 py-2">
                  <div className="text-xs text-gray-400">NFTs</div>
                  <div className="text-purple-400 font-semibold">{nfts.length}</div>
                </div>
                <div className="crystal-card px-4 py-2">
                  <div className="text-xs text-gray-400">Wallet</div>
                  <div className="text-white font-semibold">{wallet.balance?.toFixed(2) || '0'} SOL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['overview', 'nfts', 'eligibility'].map((tab) => (
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

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin h-8 w-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6 stagger-children">
                <div className="crystal-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Your NFTs</h2>
                  {nfts.length > 0 ? (
                    <div className="space-y-3">
                      {nfts.map((nft) => (
                        <div key={nft.id} className="flex items-center gap-3 p-3 glass rounded-xl">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center text-2xl">🏆</div>
                          <div>
                            <div className="text-white font-medium">{nft.category}</div>
                            <div className="text-gray-400 text-sm">Elite Access</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-3xl mb-2">🎫</div>
                      <p>No NFTs yet</p>
                    </div>
                  )}
                  <Link href="/nft" className="block mt-4 text-center text-purple-400 hover:text-purple-300 text-sm">
                    View NFT Page →
                  </Link>
                </div>

                <div className="crystal-card p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Eligibility Status</h2>
                  {eligibility && eligibility.categories?.length > 0 ? (
                    <div className="space-y-3">
                      {eligibility.categories.map((cat: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 glass rounded-xl">
                          <span className="text-white font-medium capitalize">{cat.category?.replace('-', ' ')}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cat.isEligible ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                          }`}>
                            {cat.isEligible ? '✓ Eligible' : 'Not Eligible'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-3xl mb-2">📋</div>
                      <p>No eligibility data</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* NFTs Tab */}
            {activeTab === 'nfts' && (
              <div className="stagger-children">
                {nfts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nfts.map((nft) => (
                      <div key={nft.id} className="crystal-card p-4 card-hover">
                        <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 mb-4 flex items-center justify-center text-5xl">🏆</div>
                        <h3 className="text-white font-semibold mb-1 capitalize">{nft.category?.replace('-', ' ')}</h3>
                        <p className="text-gray-400 text-sm">Elite Access Enabled</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 crystal-card">
                    <div className="text-5xl mb-4">🎫</div>
                    <h3 className="text-xl font-bold text-white mb-2">No NFTs Yet</h3>
                    <p className="text-gray-400 mb-6">Mint NFTs to get exclusive benefits</p>
                    <Link href="/nft" className="btn-glossy px-6 py-3 rounded-xl font-medium inline-block">
                      View NFT Page
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Eligibility Tab */}
            {activeTab === 'eligibility' && (
              <div className="stagger-children">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Saga Genesis', desc: 'Hold Saga Genesis NFT', status: 'Eligible' },
                    { name: 'Seeker Pioneer', desc: 'Seeker device owners', status: 'Eligible' },
                    { name: 'Jupiter Aligned', desc: 'Stake minimum 10,000 JUP', status: 'Not Eligible' },
                    { name: 'Bonk Community', desc: 'Stake minimum 1M BONK', status: 'Not Eligible' },
                    { name: 'Meteora LP', desc: 'Provide liquidity', status: 'Not Eligible' },
                  ].map((item, i) => (
                    <div key={i} className="crystal-card p-5">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white font-semibold">{item.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Eligible' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
