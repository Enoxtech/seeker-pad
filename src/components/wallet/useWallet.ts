'use client';

import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface WalletInfo {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  walletName: string | null;
}

const network = 'https://api.devnet.solana.com';

export function useWallet() {
  const { 
    connected, 
    publicKey, 
    wallet, 
    connect, 
    disconnect, 
    wallet: currentWallet 
  } = useSolanaWallet();
  
  const { setVisible } = useWalletModal();
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Get balance when connected
  useEffect(() => {
    const getBalance = async () => {
      if (connected && publicKey) {
        try {
          const connection = new Connection(network);
          const bal = await connection.getBalance(publicKey);
          setBalance(bal / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(null);
        }
      } else {
        setBalance(null);
      }
    };

    if (connected) {
      getBalance();
      // Refresh balance every 30 seconds
      const interval = setInterval(getBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [connected, publicKey]);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [connect]);

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }, [disconnect]);

  const openModal = useCallback(() => {
    setVisible(true);
  }, [setVisible]);

  const walletInfo: WalletInfo = {
    connected,
    publicKey: publicKey?.toBase58() || null,
    balance,
    walletName: (wallet as { name?: string })?.name || null,
  };

  return {
    wallet: walletInfo,
    connect: handleConnect,
    disconnect: handleDisconnect,
    openWalletModal: openModal,
    isConnecting,
  };
}

export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
