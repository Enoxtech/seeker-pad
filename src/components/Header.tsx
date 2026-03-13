'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useWallet, formatAddress } from './wallet/useWallet';
import WalletButton from './wallet/WalletButton';
import AuthButton from './auth/AuthButton';

function HeaderContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { wallet, disconnect, isConnecting } = useWallet();
  const notifRef = useRef<HTMLDivElement>(null);

  const notifications = [
    { id: 1, type: 'launch', title: 'New Launch!', message: 'Bonkify is now live', time: '2h ago', unread: true },
    { id: 2, type: 'claim', title: 'Tokens Ready', message: 'Claim your SVW tokens', time: '1d ago', unread: true },
    { id: 3, type: 'update', title: 'TGE Announced', message: 'SeedVault TGE on March 5', time: '2d ago', unread: false },
  ];

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    }
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const unreadCount = notifications.filter(n => n.unread).length;
  const isLoggedIn = wallet.connected;

  const navItems = [
    { href: '/', label: 'Launches', icon: '🚀' },
    { href: '/whales', label: 'Whales', icon: '🐋' },
    { href: '/portfolio', label: 'Portfolio', icon: '💼' },
    { href: '/nft', label: 'NFT', icon: '🎫' },
    { href: '/elite', label: 'Elite', icon: '⭐' },
    { href: '/apply', label: 'Apply', icon: '🚀' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 overflow-visible ${scrolled ? 'glass border-b border-white/5 py-2 sm:py-3' : 'bg-transparent py-4 sm:py-5'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30 float">
              <span className="text-base sm:text-xl">🚀</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-white group-hover:gradient-text transition-transform duration-300 hover:scale-105 hidden xs:block">SeekerPad</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="px-3 lg:px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-medium whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-3">
            {/* Notifications - Only show for logged in users */}
            {isLoggedIn && (
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)} 
                  className="crystal-card p-2 sm:p-2.5 group flex-shrink-0" 
                  style={{transform: 'none'}}
                  aria-label="Notifications"
                >
                  <div className="relative">
                    <svg className="w-4 sm:w-5 h-4 sm:h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              </div>
            )}

            <button onClick={toggleTheme} className="crystal-card p-2 sm:p-2.5 group relative overflow-hidden" aria-label="Toggle theme">
              <div className="relative z-10 w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </div>
            </button>

            {/* Custom Wallet Button */}
            {wallet.connected ? (
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white text-sm font-medium">{wallet.balance?.toFixed(2)} SOL</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-purple-400 text-sm">{formatAddress(wallet.publicKey)}</span>
                </div>
                {/* Mobile: just show short address */}
                <div className="sm:hidden flex items-center gap-1 px-2 py-1.5 glass rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-white text-xs font-medium">{wallet.balance?.toFixed(1)}</span>
                </div>
                <button
                  onClick={() => disconnect()}
                  className="px-2 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <>
                <AuthButton />
                <WalletButton />
              </>
            )}

            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 mt-2 mx-2 sm:mx-4">
            <div className="glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <nav className="py-2">
                {navItems.map((item) => (
                  <Link 
                    key={item.href} 
                    href={item.href} 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-all mx-2 rounded-xl"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>

      {/* Notification Portal - renders outside header flow */}
      {notificationsOpen && (
        <div className="fixed right-4 top-16 sm:top-20 w-72 sm:w-80 crystal-card rounded-xl overflow-hidden shadow-2xl z-[9999]" style={{animation: 'dropdownIn 0.15s ease-out'}}>
          <div className="p-3 sm:p-4 border-b border-white/10 bg-purple-900/20">
            <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
              <span>🔔</span> Notifications
            </h3>
          </div>
          <div className="max-h-64 sm:max-h-80 overflow-y-auto">
            {notifications.map((notif) => (
              <div key={notif.id} className={`p-3 sm:p-4 border-b border-white/5 hover:bg-white/10 transition-colors cursor-pointer ${notif.unread ? 'bg-purple-500/10 border-l-4 border-l-purple-500' : ''}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${notif.unread ? 'bg-purple-500' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium text-sm truncate">{notif.title}</div>
                    <div className="text-gray-400 text-xs line-clamp-2">{notif.message}</div>
                    <div className="text-gray-500 text-xs mt-1">{notif.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-white/10 bg-purple-900/10">
            <button className="w-full text-center text-purple-400 text-sm hover:text-purple-300 font-medium">View All Notifications</button>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Header() {
  return <HeaderContent />;
}
