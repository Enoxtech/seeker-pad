'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({ 
  className = '', 
  variant = 'rounded',
  width,
  height 
}: SkeletonProps) {
  const variantClass = {
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }[variant];

  return (
    <div 
      className={`animate-pulse bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] ${variantClass} ${className}`}
      style={{
        width: width,
        height: height,
      }}
    />
  );
}

// Card Skeleton for data display
export function CardSkeleton() {
  return (
    <div className="glass rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="rounded" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton height={60} />
      <div className="flex gap-2">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="glass rounded-xl p-4 flex items-center gap-4">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={16} className="flex-1" />
      ))}
    </div>
  );
}

// List Skeleton
export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width="70%" height={14} />
            <Skeleton width="50%" height={10} />
          </div>
        </div>
      ))}
    </div>
  );
}