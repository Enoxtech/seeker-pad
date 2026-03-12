'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useWallet as useSolanaWallet, useConnection } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  wallet: string | null;
}

interface WalletContextType {
  wallet: WalletState;
  connect: () => void;
  disconnect: () => void;
  isConnecting: boolean;
  openWalletModal: () => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { connection } = useConnection();
  const { publicKey, connected, connecting, connect, disconnect: disconnectAdapter, select } = useSolanaWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const fetchBalance = useCallback(async (pubKey: PublicKey) => {
    try {
      const bal = await connection.getBalance(pubKey);
      setBalance(bal / LAMPORTS_PER_SOL);
    } catch (e) {
      console.error('Failed to fetch balance:', e);
      setBalance(null);
    }
  }, [connection]);

  // Update wallet state when real wallet changes
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance(publicKey);
      setIsConnecting(false);
    } else if (!connected && !connecting) {
      setBalance(null);
    }
    setIsConnecting(connecting);
  }, [connected, publicKey, connecting, fetchBalance]);

  const wallet: WalletState = {
    connected,
    publicKey: publicKey?.toBase58() || null,
    balance,
    wallet: connected ? 'Phantom' : null,
  };

  const openWalletModal = () => {
    // Trigger the wallet adapter's built-in modal by calling connect
    select('Phantom');
    connect();
  };

  const disconnect = async () => {
    disconnectAdapter();
  };

  return (
    <WalletContext.Provider value={{ wallet, connect: openWalletModal, disconnect, isConnecting, openWalletModal }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}

export function formatAddress(address: string | null): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}