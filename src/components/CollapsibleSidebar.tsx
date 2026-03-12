'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Launches', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )},
  { href: '/whales', label: 'Whales', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  )},
  { href: '/portfolio', label: 'Portfolio', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )},
  { href: '/nft', label: 'NFT', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )},
  { href: '/elite', label: 'Elite', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )},
  { href: '/apply', label: 'Apply', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  )},
  { href: '/profile', label: 'Profile', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
];

export default function CollapsibleSidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <div 
      className="fixed left-0 top-0 h-full z-40 hidden lg:block"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div 
        className={`h-full glass border-r border-white/10 transition-all duration-300 ease-out flex flex-col ${
          isExpanded ? 'w-56' : 'w-16'
        }`}
      >
        {/* Logo at top */}
        <div className={`p-3 border-b border-white/10 flex items-center gap-3 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0">
            <span className="text-xl">🚀</span>
          </div>
          <span className={`font-bold text-white whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
            SeekerPad
          </span>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 py-4 overflow-hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 mx-2 mb-1 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                } ${isExpanded ? 'justify-start' : 'justify-center'}`}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`}>
                  {item.icon}
                </div>
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section - can add settings or other items */}
        <div className={`p-3 border-t border-white/10 ${isExpanded ? 'justify-start' : 'justify-center'} flex`}>
          <div className={`flex items-center gap-3 text-gray-400 ${isExpanded ? '' : 'justify-center w-full'}`}>
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-200 ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
              Settings
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}