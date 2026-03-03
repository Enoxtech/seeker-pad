'use client';

import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { ReactNode } from 'react';

// Default to devnet, can be changed to 'mainnet-beta'
const network = 'https://api.devnet.solana.com';

function useWallets() {
  return useMemo(() => [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter(),
  ], []);
}

interface WalletAdapterProviderProps {
  children: ReactNode;
}

export default function WalletAdapterProvider({ children }: WalletAdapterProviderProps) {
  const wallets = useWallets();
  
  return (
    <ConnectionProvider endpoint={network}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
