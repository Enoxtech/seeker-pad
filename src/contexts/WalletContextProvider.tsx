'use client';

import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { clusterApiUrl } from '@solana/web3.js';
import { useMemo, ReactNode } from 'react';

interface WalletProviderProps {
  children: ReactNode;
  network?: 'mainnet-beta' | 'testnet' | 'devnet';
}

export function WalletProviderComponent({ 
  children, 
  network = 'mainnet-beta' 
}: WalletProviderProps) {
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
}

export { useWallet, useConnection };
