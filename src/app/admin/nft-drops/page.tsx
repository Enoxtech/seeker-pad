'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export default function NFTDropsAdmin() {
  const { publicKey } = useWallet();
  const [drops, setDrops] = useState<NFTDrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDrop, setEditingDrop] = useState<NFTDrop | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    contract_address: '',
    candy_machine_id: '',
    start_date: '',
    end_date: '',
    supply_limit: 1000,
    mint_price: 0,
    is_active: true,
    require_app_download: true,
    require_onchain_trade: true,
    require_skr_tokens: true,
    min_skr_amount: 1
  });

  useEffect(() => {
    fetchDrops();
  }, []);

  const fetchDrops = async () => {
    try {
      const res = await fetch(`${API_URL}/api/nft-drops/admin/drops`);
      const data = await res.json();
      setDrops(data);
    } catch (error) {
      console.error('Error fetching drops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingDrop 
        ? `${API_URL}/api/nft-drops/admin/drops/${editingDrop.id}`
        : `${API_URL}/api/nft-drops/admin/drops`;
      
      const method = editingDrop ? 'PUT' : 'POST';

      // First, create/update the drop
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

      // Then update eligibility criteria
      await fetch(`${API_URL}/api/nft-drops/admin/drops/${savedDrop.id}/eligibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          require_app_download: formData.require_app_download,
          require_onchain_trade: formData.require_onchain_trade,
          require_skr_tokens: formData.require_skr_tokens,
          min_skr_amount: formData.min_skr_amount
        })
      });

      setShowModal(false);
      setEditingDrop(null);
      resetForm();
      fetchDrops();
    } catch (error) {
      console.error('Error saving drop:', error);
      alert('Failed to save drop');
    }
  };

  const handleEdit = (drop: NFTDrop) => {
    setEditingDrop(drop);
    setFormData({
      name: drop.name || '',
      description: drop.description || '',
      image_url: drop.image_url || '',
      contract_address: drop.contract_address || '',
      candy_machine_id: drop.candy_machine_id || '',
      start_date: drop.start_date ? drop.start_date.slice(0, 16) : '',
      end_date: drop.end_date ? drop.end_date.slice(0, 16) : '',
      supply_limit: drop.supply_limit || 1000,
      mint_price: drop.mint_price || 0,
      is_active: drop.is_active ?? true,
      require_app_download: drop.require_app_download ?? true,
      require_onchain_trade: drop.require_onchain_trade ?? true,
      require_skr_tokens: drop.require_skr_tokens ?? true,
      min_skr_amount: drop.min_skr_amount || 1
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this NFT drop?')) return;

    try {
      await fetch(`${API_URL}/api/nft-drops/admin/drops/${id}`, {
        method: 'DELETE'
      });
      fetchDrops();
    } catch (error) {
      console.error('Error deleting drop:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      contract_address: '',
      candy_machine_id: '',
      start_date: '',
      end_date: '',
      supply_limit: 1000,
      mint_price: 0,
      is_active: true,
      require_app_download: true,
      require_onchain_trade: true,
      require_skr_tokens: true,
      min_skr_amount: 1
    });
  };

  if (!publicKey) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">NFT Drops Management</h1>
        <p className="text-gray-400 mb-6">Connect your wallet to manage NFT drops</p>
        <div className="flex justify-center">
          <WalletMultiButton className="!bg-purple-600 hover:!bg-purple-700 !text-white !rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">NFT Drops Management</h1>
        <button
          onClick={() => {
            resetForm();
            setEditingDrop(null);
            setShowModal(true);
          }}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
        >
          + Create New Drop
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {drops.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No NFT drops yet. Create your first one!
            </div>
          ) : (
            drops.map((drop) => (
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
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>Minted: {drop.minted_count || 0}/{drop.supply_limit || '∞'}</span>
                    <span>Price: {drop.mint_price || 0} SOL</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {drop.require_app_download && (
                      <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                        📱 App Download
                      </span>
                    )}
                    {drop.require_onchain_trade && (
                      <span className="text-xs bg-green-900 text-green-300 px-2 py-0.5 rounded">
                        🔄 Onchain Trade
                      </span>
                    )}
                    {drop.require_skr_tokens && (
                      <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded">
                        🪙 {drop.min_skr_amount} SKR
                      </span>
                    )}
                  </div>
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
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {editingDrop ? 'Edit NFT Drop' : 'Create New NFT Drop'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
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

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
                  >
                    {editingDrop ? 'Update Drop' : 'Create Drop'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingDrop(null);
                    }}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}