'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { 
    href: '/admin', 
    label: 'Dashboard', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    )
  },
  { 
    href: '/admin/launches', 
    label: 'Launches', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    href: '/admin/users', 
    label: 'Users', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    )
  },
  { 
    href: '/admin/transactions', 
    label: 'Transactions', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
];

const moreItems = [
  { href: '/admin/analytics', label: 'Analytics', icon: '📊' },
  { href: '/admin/kyc', label: 'KYC', icon: '✓' },
  { href: '/admin/notifications', label: 'Notifications', icon: '🔔' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  { href: '/admin/logs', label: 'Audit Logs', icon: '📋' },
];

export default function MobileAdminNav() {
  const pathname = usePathname();
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200
                  min-w-[56px] min-h-[44px]
                  ${isActive 
                    ? 'text-cyan-400' 
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium ${isActive ? 'text-cyan-400' : ''}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-0 w-8 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </Link>
            );
          })}
          
          {/* More Dropdown Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className={`
              flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200
              min-w-[56px] min-h-[44px]
              ${showMore 
                ? 'text-cyan-400' 
                : 'text-slate-400 hover:text-slate-200'
              }
            `}
          >
            <div className={`transition-transform duration-200 ${showMore ? 'scale-110' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* More Dropdown Menu */}
      {showMore && (
        <div className="fixed bottom-16 left-0 right-0 z-40 lg:hidden bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 py-2 px-4">
          <div className="grid grid-cols-5 gap-1">
            {moreItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMore(false)}
                  className={`
                    flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'text-cyan-400 bg-cyan-400/10' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                    }
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}