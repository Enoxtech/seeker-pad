'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // Small delay for exit animation
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsTransitioning(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div 
      className={`
        transition-all duration-300 ease-out
        ${isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'}
      `}
    >
      {displayChildren}
    </div>
  );
}