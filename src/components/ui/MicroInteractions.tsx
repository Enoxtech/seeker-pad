'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';

interface MicroButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
}

export default function MicroButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  glow = false,
  className = '',
  ...props 
}: MicroButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500',
    secondary: 'glass border border-white/10 text-white hover:bg-white/10',
    ghost: 'text-white/70 hover:text-white hover:bg-white/5',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-medium
        transition-all duration-200
        active:scale-95 active:brightness-90
        hover:shadow-lg hover:shadow-purple-500/20
        ${glow ? 'animate-pulse-glow' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// Animated Icon Button
export function IconButton({ 
  children, 
  className = '',
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  [key: string]: any;
}) {
  return (
    <button
      className={`
        p-2 rounded-lg
        text-white/70 hover:text-white
        bg-white/5 hover:bg-white/10
        transition-all duration-200
        active:scale-90
        hover:rotate-12
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

// Success Feedback
export function SuccessPulse({ show }: { show: boolean }) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-green-400 animate-bounce-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Loading Spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };
  
  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>
  );
}

// Pull to refresh indicator
export function PullToRefresh({ refreshing }: { refreshing: boolean }) {
  return (
    <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-transform duration-300 ${refreshing ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
        <LoadingSpinner size="sm" />
        Refreshing...
      </div>
    </div>
  );
}