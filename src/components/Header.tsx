'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WalletProvider, useWallet, formatAddress } from './wallet/WalletContext';

function HeaderContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const { wallet, connect, disconnect, isConnecting } = useWallet();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/5 py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30 float">
              <span className="text-xl">🚀</span>
            </div>
            <span className="text-xl font-bold text-white group-hover:gradient-text transition-all">SeekerPad</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle - Crystal Style */}
            <button
              onClick={toggleTheme}
              className="crystal-card p-2.5 group relative overflow-hidden"
              aria-label="Toggle theme"
            >
              <div className="relative z-10 w-8 h-8 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Wallet Button - Shows connected state */}
            {wallet.connected ? (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setWalletModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 glass rounded-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white font-medium">{wallet.balance?.toFixed(2)} SOL</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-purple-400">{formatAddress(wallet.publicKey)}</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setWalletModalOpen(true)}
                className="btn-glossy px-5 py-2.5 rounded-xl font-semibold text-white shadow-lg glow-purple"
              >
                Connect
              </button>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-white/10 mt-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Wallet Modal */}
      <WalletModal isOpen={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
    </header>
  );
}

const navItems = [
  { href: '/', label: 'Launches', icon: '🚀' },
  { href: '/portfolio', label: 'Portfolio', icon: '💼' },
  { href: '/nft', label: 'NFT', icon: '🎫' },
  { href: '/elite', label: 'Elite', icon: '⭐' },
  { href: '/profile', label: 'Profile', icon: '👤' },
];

import WalletModal from './wallet/WalletModal';

export default function Header() {
  return (
    <WalletProvider>
      <HeaderContent />
    </WalletProvider>
  );
}
