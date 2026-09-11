export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-panel-hover ${className}`} aria-hidden="true" />;
}

export function PanelSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-md border border-border bg-panel p-4">
      <Skeleton className="h-3 w-32" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-3 w-full" />
      ))}
    </div>
  );
}