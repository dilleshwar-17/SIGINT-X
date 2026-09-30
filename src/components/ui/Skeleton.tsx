export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-lg bg-panel-hover ${className}`} aria-hidden="true" />;
}

export function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="panel-surface space-y-3 p-4">
      <div className="flex items-center gap-2.5">
        <Skeleton className="h-6 w-6 rounded-lg" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="hairline-t h-px opacity-40" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-2.5 w-full" />
          {i % 2 === 0 && <Skeleton className="h-2.5 w-4/5" />}
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="panel-surface space-y-3 p-4">
      <div className="flex items-start justify-between">
        <Skeleton className="h-2.5 w-24" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="h-7 w-20" />
      <div className="flex h-8 items-end gap-[3px]">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="flex-1 rounded-sm" />
        ))}
      </div>
    </div>
  );
}
