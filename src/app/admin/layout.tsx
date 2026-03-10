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
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-800 border-b border-slate-700 z-50 flex items-center justify-between px-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        <span className="text-white font-bold">Admin</span>
        <div className="w-10" /> {/* Spacer */}
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 h-full bg-slate-800 border-r border-slate-700 z-50
        w-64 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-lg font-bold text-white truncate">SeekerPad Admin</h1>
        </div>
        <nav className="p-2 overflow-y-auto h-[calc(100%-65px)]">
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
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 lg:p-6 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
