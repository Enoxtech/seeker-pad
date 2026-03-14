'use client';

import { ConnectionProvider, WalletProvider, useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useMemo, ReactNode } from 'react';

interface WalletProviderProps {
  children: ReactNode;
  network?: 'mainnet-beta' | 'testnet' | 'devnet';
}

export function WalletProviderComponent({ 
  children, 
  network = 'mainnet-beta' 
}: WalletProviderProps) {
  const endpoint = useMemo(() => {
    if (network === 'mainnet-beta') return 'https://api.mainnet-beta.solana.com';
    if (network === 'testnet') return 'https://api.testnet.solana.com';
    return 'https://api.devnet.solana.com';
  }, [network]);
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
