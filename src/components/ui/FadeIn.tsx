'use client';

import { ReactNode } from 'react';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: number;
  className?: string;
}

export default function FadeIn({ 
  children, 
  delay = 0, 
  direction = 'up',
  duration = 500,
  className = '' 
}: FadeInProps) {
  const directions = {
    up: 'translate-y-4',
    down: '-translate-y-4',
    left: 'translate-x-4',
    right: '-translate-x-4',
    none: '',
  };

  return (
    <div 
      className={`transition-all ease-out ${directions[direction]} ${className}`}
      style={{
        animation: `fadeIn${direction.charAt(0).toUpperCase() + direction.slice(1)} ${duration}ms ease-out forwards`,
        opacity: 0,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Stagger wrapper for multiple items
export function StaggerContainer({ 
  children, 
  delay = 100,
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.isArray(children) 
        ? children.map((child, index) => (
            <div 
              key={index}
              style={{ animationDelay: `${index * delay}ms` }}
              className="animate-fade-in-up"
            >
              {child}
            </div>
          ))
        : children
      }
    </div>
  );
}

// Scale in animation
export function ScaleIn({ 
  children, 
  delay = 0,
  className = '' 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <div 
      className={className}
      style={{
        animation: `scaleIn 400ms ease-out forwards`,
        opacity: 0,
        animationDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}