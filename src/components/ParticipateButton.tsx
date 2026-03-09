'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, SystemProgram, LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';

interface ParticipateButtonProps {
  launchId: string;
  pricePerToken: number;
  minAllocation: number;
  maxAllocation: number;
  status: string;
  launchName: string;
}

export default function ParticipateButton({ 
  launchId, 
  pricePerToken, 
  minAllocation, 
  maxAllocation, 
  status,
  launchName 
}: ParticipateButtonProps) {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [solAmount, setSolAmount] = useState('');
  const [isParticipating, setIsParticipating] = useState(false);
  const [TxHash, setTxHash] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState<number | null>(null);

  const network = 'https://api.devnet.solana.com';

  // Fetch balance
  useEffect(() => {
    const getBalance = async () => {
      if (connected && publicKey) {
        try {
          const connection = new Connection(network);
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (err) {
          console.error('Error fetching balance:', err);
        }
      } else {
        setBalance(null);
      }
    };

    if (connected) {
      getBalance();
      const interval = setInterval(getBalance, 10000);
      return () => clearInterval(interval);
    }
  }, [connected, publicKey]);

  const tokensReceived = solAmount ? (parseFloat(solAmount) / pricePerToken).toLocaleString() : '0';

  const handleParticipate = async () => {
    if (!connected || !publicKey) {
      setError('Please connect your wallet first');
      return;
    }

    const amount = parseFloat(solAmount);
    if (isNaN(amount) || amount < minAllocation || amount > maxAllocation) {
      setError(`Please enter an amount between ${minAllocation} and ${maxAllocation} SOL`);
      return;
    }

    if (balance !== null && amount > balance) {
      setError('Insufficient balance');
      return;
    }

    setIsParticipating(true);
    setError('');

    try {
      const connection = new Connection(network);
      
      // For demo: send SOL to a burn address or treasury
      // In production, this would interact with the launchpad smart contract
      const treasuryAddress = 'GDbhZgN5wTJPJ2JHM5bZG9HPocM9q4vK2v2f5q6x7qw'; // Demo treasury
      
      const instruction = SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: new (await import('@solana/web3.js')).PublicKey(treasuryAddress),
        lamports: Math.floor(amount * LAMPORTS_PER_SOL),
      });

      const transaction = new Transaction().add(instruction);
      const signature = await sendTransaction(transaction, connection);
      setTxHash(signature);
      setSolAmount('');
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed');
    } finally {
      setIsParticipating(false);
    }
  };

  if (!connected) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4 text-gray-400">
          Connect your wallet to participate
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {TxHash && (
        <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
          <div className="text-green-400 font-medium mb-2">✓ Participation Successful!</div>
          <div className="text-xs text-gray-400 break-all">
            Tx: {TxHash.slice(0, 20)}...
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-400 text-sm mb-2">
          Amount (SOL)
          {balance !== null && (
            <span className="float-right text-purple-400">
              Balance: {balance.toFixed(3)} SOL
            </span>
          )}
        </label>
        <input
          type="number"
          placeholder="0.00"
          value={solAmount}
          onChange={(e) => {
            setSolAmount(e.target.value);
            setTxHash('');
            setError('');
          }}
          disabled={status === 'upcoming' || isParticipating}
          className="w-full glass text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500/50 transition-colors placeholder-gray-500 disabled:opacity-50"
        />
        <p className="text-gray-400 text-sm mt-2">
          ≈ <span className="text-white font-medium">{tokensReceived}</span> tokens
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setSolAmount(String(minAllocation))}
          disabled={status === 'upcoming'}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 disabled:opacity-50"
        >
          Min
        </button>
        <button
          onClick={() => setSolAmount(String(Math.min(maxAllocation, balance || 0)))}
          disabled={status === 'upcoming'}
          className="px-3 py-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg hover:border-white/20 disabled:opacity-50"
        >
          Max
        </button>
      </div>

      <button 
        onClick={handleParticipate}
        disabled={status === 'upcoming' || isParticipating || !solAmount}
        className="w-full btn-glossy py-3.5 rounded-xl font-bold text-white shadow-lg glow-purple disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isParticipating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : status === 'upcoming' ? (
          'Coming Soon'
        ) : (
          'Participate Now'
        )}
      </button>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <span>🔒</span>
        <span>Secure transaction via Solana</span>
      </div>
    </div>
  );
}
