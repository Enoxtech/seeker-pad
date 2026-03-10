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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-slate-800 border-b border-slate-700 z-50 flex items-center justify-between px-4">
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
        <div className="w-10" />
      </header>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-56 bg-slate-800 border-r border-slate-700 z-40
        transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header with Toggle */}
        <div className="h-14 flex items-center justify-between px-3 border-b border-slate-700 shrink-0">
          <h1 className="text-lg font-bold text-white">SeekerPad</h1>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
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
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-56 pt-14 lg:pt-0">
        {/* Desktop Toggle Button */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="hidden lg:flex fixed top-4 left-4 z-30 p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Page Content */}
        <main className="p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
