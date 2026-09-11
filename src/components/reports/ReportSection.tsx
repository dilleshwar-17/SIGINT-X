import type { ReactNode } from "react";

interface ReportSectionProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function ReportSection({ number, title, children }: ReportSectionProps) {
  return (
    <section aria-label={`Section ${number}: ${title}`}>
      <h3 className="mb-2 border-b border-border pb-1 font-mono text-xs font-semibold uppercase tracking-widest text-cyan-accent">
        {number}. {title}
      </h3>
      {children}
    </section>
  );
}