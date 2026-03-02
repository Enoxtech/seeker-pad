'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface WalletState {
  connected: boolean;
  publicKey: string | null;
  balance: number | null;
  wallet: string | null;
}

interface WalletContextType {
  wallet: WalletState;
  connect: (walletName?: string) => Promise<void>;
  disconnect: () => Promise<void>;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    publicKey: null,
    balance: null,
    wallet: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);

  // Load wallet state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('walletState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setWallet(parsed);
      } catch (e) {
        console.error('Failed to parse wallet state');
      }
    }
  }, []);

  // Save wallet state to localStorage
  useEffect(() => {
    if (wallet.connected) {
      localStorage.setItem('walletState', JSON.stringify(wallet));
    } else {
      localStorage.removeItem('walletState');
    }
  }, [wallet]);

  const connect = async (walletName: string = 'Phantom') => {
    setIsConnecting(true);
    
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock wallet data
    const mockPublicKey = '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU';
    const mockBalance = 12.5 + Math.random() * 10;
    
    setWallet({
      connected: true,
      publicKey: mockPublicKey,
      balance: mockBalance,
      wallet: walletName,
    });
    setIsConnecting(false);
  };

  const disconnect = async () => {
    setIsConnecting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setWallet({
      connected: false,
      publicKey: null,
      balance: null,
      wallet: null,
    });
    setIsConnecting(false);
  };

  return (
    <WalletContext.Provider value={{ wallet, connect, disconnect, isConnecting }}>
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
