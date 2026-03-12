'use client';

import { ReactNode } from 'react';

interface MobileMockupProps {
  children: ReactNode;
  className?: string;
}

export function MobileMockup({ children, className = '' }: MobileMockupProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Phone Frame */}
      <div className="relative mx-auto border-[6px] border-gray-800 rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl bg-gray-900 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-800 rounded-b-xl z-20" />
        
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden bg-gray-950">
          {children}
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-gray-600 rounded-full z-20" />
      </div>
      
      {/* Phone Stand (optional decorative) */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-2 bg-gray-700 rounded-b-lg" />
    </div>
  );
}

interface TabletMockupProps {
  children: ReactNode;
  className?: string;
}

export function TabletMockup({ children, className = '' }: TabletMockupProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      {/* Tablet Frame */}
      <div className="relative mx-auto border-[8px] border-gray-800 rounded-[1.5rem] h-[450px] w-[340px] shadow-2xl bg-gray-900 overflow-hidden">
        {/* Camera */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-700 rounded-full z-20" />
        
        {/* Screen */}
        <div className="relative h-full w-full overflow-hidden bg-gray-950">
          {children}
        </div>
      </div>
    </div>
  );
}