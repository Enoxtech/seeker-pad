'use client';

import { useState, useEffect } from 'react';

interface WalletAnimationProps {
  isConnecting: boolean;
  onComplete?: () => void;
  children?: React.ReactNode;
}

export function WalletConnectionAnimation({ 
  isConnecting, 
  onComplete,
  children 
}: WalletAnimationProps) {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'connecting' | 'success'>('idle');
  
  useEffect(() => {
    if (isConnecting) {
      setStage('scanning');
      
      // Stage 1: Scanning (1.5s)
      const scanTimer = setTimeout(() => setStage('connecting'), 1500);
      
      // Stage 2: Connecting (1.5s)
      const connectTimer = setTimeout(() => setStage('success'), 3000);
      
      // Stage 3: Complete
      const successTimer = setTimeout(() => {
        onComplete?.();
      }, 4000);
      
      return () => {
        clearTimeout(scanTimer);
        clearTimeout(connectTimer);
        clearTimeout(successTimer);
      };
    } else {
      setStage('idle');
    }
  }, [isConnecting, onComplete]);

  if (!isConnecting && stage === 'idle') {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Icon */}
        <div className={`relative w-24 h-24 mx-auto mb-6 ${
          stage === 'success' ? 'wallet-connecting' : ''
        }`}>
          {/* Background Circle */}
          <div className={`absolute inset-0 rounded-full ${
            stage === 'scanning' ? 'bg-purple-500/20 animate-ping' :
            stage === 'connecting' ? 'bg-pink-500/20' :
            stage === 'success' ? 'bg-green-500/20' : 'bg-gray-700'
          }`} />
          
          {/* Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {stage === 'scanning' && (
              <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
            )}
            {stage === 'connecting' && (
              <div className="relative">
                <svg className="w-10 h-10 text-pink-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {/* Rocket trail */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1 h-4 bg-gradient-to-t from-pink-500 to-transparent animate-pulse" />
              </div>
            )}
            {stage === 'success' && (
              <svg className="w-10 h-10 text-green-400 wallet-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          
          {/* Scanning Ring */}
          {stage === 'scanning' && (
            <div className="absolute inset-0 border-2 border-purple-500/50 rounded-full animate-ping" />
          )}
        </div>
        
        {/* Status Text */}
        <h3 className="text-xl font-semibold text-white mb-2">
          {stage === 'scanning' && 'Scanning for wallets...'}
          {stage === 'connecting' && 'Connecting...'}
          {stage === 'success' && 'Connected!'}
        </h3>
        <p className="text-gray-400 text-sm">
          {stage === 'scanning' && 'Looking for Phantom, Solflare, Backpack...'}
          {stage === 'connecting' && 'Establishing secure connection'}
          {stage === 'success' && 'Wallet connected successfully'}
        </p>
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {['scanning', 'connecting', 'success'].map((s, i) => (
            <div 
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                (stage === 'scanning' && i === 0) ||
                (stage === 'connecting' && i <= 1) ||
                (stage === 'success' && i <= 2)
                  ? 'bg-purple-500' 
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}