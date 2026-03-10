"use client";

import React, { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Toggle Button - floating */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-56 bg-slate-800 border-r border-slate-700 z-40
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-14 flex items-center px-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white">SeekerPad</h1>
        </div>
        
        <nav className="p-2 overflow-y-auto h-[calc(100%-3.5rem)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-colors ${
                  isActive 
                    ? 'bg-cyan-500/20 text-cyan-400' 
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={`
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'ml-56' : 'ml-0'}
        p-4 pt-16 lg:pt-6
      `}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
