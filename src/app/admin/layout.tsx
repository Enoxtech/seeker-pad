"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Launches', href: '/admin/launches', icon: '🚀' },
  { name: 'Users', href: '/admin/users', icon: '👥' },
  { name: 'KYC', href: '/admin/kyc', icon: '✅' },
  { name: 'Transactions', href: '/admin/transactions', icon: '💳' },
  { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  { name: 'Notifications', href: '/admin/notifications', icon: '🔔' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { name: 'Audit Logs', href: '/admin/logs', icon: '📝' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold text-white">SeekerPad Admin</h1>
        </div>
        <nav className="p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
