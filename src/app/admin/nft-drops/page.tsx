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
          
          {/* Wallet Connect Button */}
          <div className="bg-gray-800 rounded-lg p-4 mb-6">
            <button
              onClick={() => {
                // Try to trigger wallet modal
                const btn = document.querySelector('.wallet-adapter-button') as HTMLButtonElement;
                if (btn) btn.click();
                else alert('Please click the wallet button in the header to connect');
              }}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-medium"
            >
              Connect Wallet
            </button>
          </div>
          
          <div className="text-gray-500 text-sm mb-4">or</div>
          
          {/* Demo Mode */}
          <button
            onClick={enableDemoMode}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium"
          >
            Continue in Demo Mode
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

      {/* Full Form Modal */}
      {showModal && (
        <FormModal
          editingDrop={editingDrop}
          onClose={() => {
            setShowModal(false);
            setEditingDrop(null);
          }}
          onSuccess={fetchDrops}
        />
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

// Full Form Modal Component
function FormModal({ 
  editingDrop, 
  onClose, 
  onSuccess 
}: { 
  editingDrop: NFTDrop | null; 
  onClose: () => void; 
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: editingDrop?.name || '',
    description: editingDrop?.description || '',
    image_url: editingDrop?.image_url || '',
    contract_address: editingDrop?.contract_address || '',
    candy_machine_id: editingDrop?.candy_machine_id || '',
    start_date: editingDrop?.start_date ? editingDrop.start_date.slice(0, 16) : '',
    end_date: editingDrop?.end_date ? editingDrop.end_date.slice(0, 16) : '',
    supply_limit: editingDrop?.supply_limit || 1000,
    mint_price: editingDrop?.mint_price || 0,
    is_active: editingDrop?.is_active ?? true,
    require_app_download: editingDrop?.require_app_download ?? true,
    require_onchain_trade: editingDrop?.require_onchain_trade ?? true,
    require_skr_tokens: editingDrop?.require_skr_tokens ?? true,
    min_skr_amount: editingDrop?.min_skr_amount || 1
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingDrop 
        ? `/api/nft-drops/admin/drops/${editingDrop.id}`
        : '/api/nft-drops/admin/drops';
      
      const method = editingDrop ? 'PUT' : 'POST';

      const dropRes = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          image_url: formData.image_url,
          contract_address: formData.contract_address,
          candy_machine_id: formData.candy_machine_id,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          supply_limit: formData.supply_limit,
          mint_price: formData.mint_price,
          is_active: formData.is_active
        })
      });

      if (!dropRes.ok) throw new Error('Failed to save drop');

      const savedDrop = await dropRes.json();

      // Update eligibility criteria
      await fetch(`/api/nft-drops/admin/drops/${savedDrop.id}/eligibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          require_app_download: formData.require_app_download,
          require_onchain_trade: formData.require_onchain_trade,
          require_skr_tokens: formData.require_skr_tokens,
          min_skr_amount: formData.min_skr_amount
        })
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving drop:', error);
      alert('Failed to save drop');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingDrop ? 'Edit NFT Drop' : 'Create New NFT Drop'}
            </h2>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              {/* Contract Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Contract Address</label>
                  <input
                    type="text"
                    value={formData.contract_address}
                    onChange={(e) => setFormData({ ...formData, contract_address: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Candy Machine ID</label>
                  <input
                    type="text"
                    value={formData.candy_machine_id}
                    onChange={(e) => setFormData({ ...formData, candy_machine_id: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Supply & Price */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Supply Limit</label>
                  <input
                    type="number"
                    value={formData.supply_limit}
                    onChange={(e) => setFormData({ ...formData, supply_limit: parseInt(e.target.value) })}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Mint Price (SOL)</label>
                  <input
                    type="number"
                    value={formData.mint_price}
                    onChange={(e) => setFormData({ ...formData, mint_price: parseFloat(e.target.value) })}
                    className="w-full bg-gray-700 rounded-lg px-3 py-2"
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Active</span>
                  </label>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="border-t border-gray-700 pt-4 mt-4">
                <h3 className="font-semibold mb-3">Eligibility Criteria</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.require_app_download}
                      onChange={(e) => setFormData({ ...formData, require_app_download: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Must have downloaded SeekerPad App</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.require_onchain_trade}
                      onChange={(e) => setFormData({ ...formData, require_onchain_trade: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Must have traded on Solana onchain</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.require_skr_tokens}
                      onChange={(e) => setFormData({ ...formData, require_skr_tokens: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span>Must hold SKR tokens</span>
                  </label>
                  {formData.require_skr_tokens && (
                    <div className="ml-6">
                      <label className="block text-sm text-gray-400 mb-1">Minimum SKR Amount</label>
                      <input
                        type="number"
                        value={formData.min_skr_amount}
                        onChange={(e) => setFormData({ ...formData, min_skr_amount: parseFloat(e.target.value) })}
                        className="w-32 bg-gray-700 rounded-lg px-3 py-1"
                        min={0}
                        step={0.1}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 mt-4 border-t border-gray-700">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-lg font-medium"
              >
                {saving ? 'Saving...' : (editingDrop ? 'Update Drop' : 'Create Drop')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}