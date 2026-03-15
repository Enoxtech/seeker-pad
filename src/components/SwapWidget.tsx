'use client';

import { useEffect, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

interface SwapWidgetProps {
  // Default input token (e.g., SOL)
  defaultInputMint?: string;
  // Default output token 
  defaultOutputMint?: string;
  // Minimum amount to swap
  amount?: number;
}

export default function SwapWidget({
  defaultInputMint = 'So11111111111111111111111111111111111111112', // SOL
  defaultOutputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGZ1t2WQ6f', // USDC
  amount = 0.1,
}: SwapWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { connected, publicKey, connect, disconnect } = useWallet();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Jupiter widget configuration
  const JUPTER_WIDGET_URL = 'https://jup.ag/swap';

  useEffect(() => {
    // Add Jupiter widget script
    const script = document.createElement('script');
    script.src = 'https://jup.ag/js/iframe.js';
    script.async = true;
    script.onload = () => setIframeLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Cleanup
      document.body.removeChild(script);
    };
  }, []);

  const handleConnectWallet = async () => {
    if (!connected) {
      await connect();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="text-3xl">🔄</span>
        Swap Tokens
      </h2>
      
      <p className="text-slate-400 text-sm mb-4">
        Instantly swap SOL, USDC, and other tokens using Jupiter Aggregator
      </p>

      {/* Wallet Status */}
      <div className="mb-4 p-3 bg-slate-800/50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Wallet:</span>
          <span className={connected ? 'text-green-400' : 'text-yellow-400'}>
            {connected ? 'Connected' : 'Not Connected'}
          </span>
        </div>
        {connected && publicKey && (
          <div className="mt-2 text-xs text-slate-500">
            {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-4)}
          </div>
        )}
      </div>

      {/* Jupiter Swap Widget Embed */}
      <div 
        ref={containerRef}
        className="w-full h-[500px] rounded-xl overflow-hidden bg-slate-900/50"
        dangerouslySetInnerHTML={{
          __html: `
            <iframe
              src="https://jup.ag/swap?inputMint=${defaultInputMint}&outputMint=${defaultOutputMint}&amount=${amount}"
              width="100%"
              height="100%"
              frameborder="0"
              style="border: none; border-radius: 12px;"
              allow="clipboard-write"
            ></iframe>
          `
        }}
      />

      {/* Fallback if iframe doesn't load */}
      {!iframeLoaded && (
        <div className="text-center py-4">
          <a 
            href="https://jup.ag" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <span>🔗</span>
            Open Jupiter Swap ↗
          </a>
        </div>
      )}

      {/* Features */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 bg-slate-800/30 rounded-lg">
          <div className="text-lg">⚡</div>
          <div className="text-xs text-slate-400">Best Prices</div>
        </div>
        <div className="p-2 bg-slate-800/30 rounded-lg">
          <div className="text-lg">🔒</div>
          <div className="text-xs text-slate-400">Secure</div>
        </div>
        <div className="p-2 bg-slate-800/30 rounded-lg">
          <div className="text-lg">🌐</div>
          <div className="text-xs text-slate-400">Multi-DEX</div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-4 text-center">
        Powered by Jupiter Aggregator • Raydium • Orca • Aldrin
      </p>
    </div>
  );
}