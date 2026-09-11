import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border-light px-6 py-16 text-center">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
        {title}
      </h3>
      <p className="max-w-md text-sm text-text-muted">{description}</p>
      {action}
    </div>
  );
}