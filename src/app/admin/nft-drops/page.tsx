'use client';

import { useState, useEffect, Suspense } from 'react';

interface NFTDrop {
  id: string;
  name: string;
  description: string;
  image_url: string;
  contract_address: string;
  candy_machine_id: string;
  start_date: string;
  end_date: string;
  supply_limit: number;
  minted_count: number;
  mint_price: number;
  is_active: boolean;
  require_app_download: boolean;
  require_onchain_trade: boolean;
  require_skr_tokens: boolean;
  min_skr_amount: number;
}

function NFTDropsContent() {
  const [drops, setDrops] = useState<NFTDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDrop, setEditingDrop] = useState<NFTDrop | null>(null);
  const [demoMode, setDemoMode] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

  // Check demo mode on mount
  useEffect(() => {
    const demo = localStorage.getItem('nftAdminDemo');
    if (demo === 'true') {
      setDemoMode(true);
      setWalletConnected(true); // Treat demo as connected for UX
    }
  }, []);

  // Check wallet connection
  useEffect(() => {
    const checkWallet = () => {
      const connected = localStorage.getItem('walletConnected');
      if (connected) {
        try {
          const parsed = JSON.parse(connected);
          if (parsed.connected) setWalletConnected(true);
        } catch (e) {}
      }
    };
    
    checkWallet();
    window.addEventListener('walletStateChange', checkWallet);
    return () => window.removeEventListener('walletStateChange', checkWallet);
  }, []);

  useEffect(() => {
    fetchDrops();
  }, []);

  const fetchDrops = async () => {
    try {
      const res = await fetch('/api/nft-drops/admin/drops');
      if (res.ok) {
        const data = await res.json();
        setDrops(data || []);
      }
    } catch (error) {
      console.error('Error fetching drops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent submission if not in demo mode and wallet not connected
    if (!demoMode && !walletConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Handle form submission...
    setShowModal(false);
    fetchDrops();
  };

  const handleEdit = (drop: NFTDrop) => {
    setEditingDrop(drop);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this NFT drop?')) return;
    // Handle delete
    fetchDrops();
  };

  const enableDemoMode = () => {
    localStorage.setItem('nftAdminDemo', 'true');
    setDemoMode(true);
    setWalletConnected(true);
  };

  const resetForm = () => {
    setEditingDrop(null);
  };

  // Show connection screen if not connected and not in demo mode
  if (!walletConnected && !demoMode) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">NFT Drops Management</h1>
          <p className="text-gray-400 mb-6">Connect your wallet to manage NFT drops</p>
          <p className="text-sm text-gray-500 mb-4">
            Click the wallet button in the header to connect
          </p>
          <button
            onClick={enableDemoMode}
            className="text-sm text-gray-500 hover:text-gray-400 underline"
          >
            Or continue in Demo Mode
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {demoMode && (
        <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-3 mb-4 flex justify-between items-center max-w-4xl mx-auto">
          <span className="text-yellow-300 text-sm">Demo Mode</span>
          <button
            onClick={() => {
              localStorage.removeItem('nftAdminDemo');
              window.location.reload();
            }}
            className="text-xs text-yellow-400 hover:text-yellow-300"
          >
            Exit Demo
          </button>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">NFT Drops Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
          >
            + Create New Drop
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : drops.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No NFT drops yet. Create your first one!
          </div>
        ) : (
          <div className="grid gap-4">
            {drops.map((drop) => (
              <div
                key={drop.id}
                className="bg-gray-800 rounded-xl p-4 flex items-center gap-4"
              >
                {drop.image_url && (
                  <img 
                    src={drop.image_url} 
                    alt={drop.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{drop.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      drop.is_active ? 'bg-green-600' : 'bg-gray-600'
                    }`}>
                      {drop.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm line-clamp-1">
                    {drop.description || 'No description'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(drop)}
                    className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(drop.id)}
                    className="px-3 py-1 bg-red-900 hover:bg-red-800 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Simple Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingDrop ? 'Edit NFT Drop' : 'Create New NFT Drop'}
              </h2>
              <p className="text-gray-400 text-sm">Form would go here</p>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NFTDropsAdmin() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white p-8">Loading...</div>}>
      <NFTDropsContent />
    </Suspense>
  );
}