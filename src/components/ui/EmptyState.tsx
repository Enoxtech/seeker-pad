'use client';

import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  icon?: 'search' | 'data' | 'wallet' | 'general';
}

export default function EmptyState({ 
  title, 
  description, 
  action,
  icon = 'general' 
}: EmptyStateProps) {
  const icons = {
    search: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    data: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    wallet: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    general: (
      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  };

  const content = (
    <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in-up">
      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mb-6 text-purple-400">
        {icons[icon]}
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && (
        <p className="text-white/50 max-w-md mb-6">{description}</p>
      )}
      {action && (
        action.href ? (
          <Link 
            href={action.href}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 active:scale-95"
          >
            {action.label}
          </Link>
        ) : (
          <button 
            onClick={action.onClick}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-500 hover:to-pink-500 transition-all duration-200 active:scale-95"
          >
            {action.label}
          </button>
        )
      )}
    </div>
  );

  return content;
}

// Pre-defined common empty states
export function NoDataState() {
  return (
    <EmptyState 
      icon="data"
      title="No Data Yet"
      description="Data will appear here once available. Check back later!"
    />
  );
}

export function NoResultsState() {
  return (
    <EmptyState 
      icon="search"
      title="No Results Found"
      description="Try adjusting your search or filters to find what you're looking for."
    />
  );
}

export function NoWalletState() {
  return (
    <EmptyState 
      icon="wallet"
      title="No Wallet Connected"
      description="Connect your wallet to view your portfolio and participate in launches."
      action={{ label: 'Connect Wallet', href: '#' }}
    />
  );
}