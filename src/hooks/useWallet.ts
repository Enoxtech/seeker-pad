import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';

/**
 * Hook for wallet connection state and balance
 */
export function useWalletState() {
  const { publicKey, connected, connecting, disconnect, wallet } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!connected || !publicKey) {
      setBalance(null);
      return;
    }

    setLoading(true);
    try {
      // Use a default connection - in production, this would come from config
      const connection = new Connection('https://api.devnet.solana.com');
      const bal = await connection.getBalance(publicKey);
      setBalance(bal / 1e9); // Convert lamports to SOL
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    } finally {
      setLoading(false);
    }
  }, [connected, publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    publicKey,
    connected,
    connecting,
    disconnect,
    wallet,
    balance,
    loading,
    refetch: fetchBalance,
  };
}

/**
 * Hook to check if wallet is eligible for Elite features
 */
export function useEligible() {
  const { connected } = useWallet();
  const [isElite, setIsElite] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkEligibility = useCallback(async () => {
    if (!connected) {
      setIsElite(false);
      return;
    }

    setLoading(true);
    // In production, this would check on-chain NFT holdings
    // For now, return false as mock
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsElite(false);
    setLoading(false);
  }, [connected]);

  useEffect(() => {
    checkEligibility();
  }, [checkEligibility]);

  return { isElite, loading, checkEligibility };
}

/**
 * Hook for handling wallet connection errors
 */
export function useWalletError() {
  // This would be expanded to handle specific wallet errors
  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unknown error occurred';
  };

  return { getErrorMessage };
}
