import { motion } from 'framer-motion';

export function Skeleton({ className = '', style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-white/5 relative overflow-hidden ${className}`}
      style={style}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-crimson-500/10 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass rounded-3xl p-4 flex flex-col gap-4">
      <Skeleton className="w-full aspect-[4/5] rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-6 w-1/4 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-white/5 w-full">
      <Skeleton className="h-10 w-10 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3 rounded-md" />
        <Skeleton className="h-3 w-1/4 rounded-md" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
  );
}

export function ChartSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`glass rounded-2xl p-6 h-[300px] flex flex-col justify-end gap-2 relative ${className}`}>
      <div className="absolute top-6 left-6 space-y-2">
        <Skeleton className="h-6 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
      <div className="flex items-end justify-between gap-2 h-3/4 opacity-50">
        {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
          <Skeleton key={i} className="w-full rounded-t-sm" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}
