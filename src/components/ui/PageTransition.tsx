'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Trigger bounce animation on route change
    setIsAnimating(true);
    setDisplayChildren(children);
    
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <div className={isAnimating ? 'animate-bounce-in' : ''}>
      {displayChildren}
    </div>
  );
}