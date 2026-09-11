import { useState } from "react";
import { Check, AlertTriangle, X, ChevronRight } from "lucide-react";
import type { EvidenceItem } from "@/types";

interface EvidencePanelProps {
  items: EvidenceItem[];
}

function StatusIcon({ status }: { status: EvidenceItem["status"] }) {
  if (status === "verified") return <Check className="h-3.5 w-3.5 text-ok" aria-hidden="true" />;
  if (status === "partial") return <AlertTriangle className="h-3.5 w-3.5 text-warn" aria-hidden="true" />;
  return <X className="h-3.5 w-3.5 text-err" aria-hidden="true" />;
}

export function EvidencePanel({ items }: EvidencePanelProps) {
  const [open, setOpen] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <ul className="space-y-1.5">
      {items.map((item) => {
        const expanded = open.has(item.id);
        return (
          <li key={item.id} className="overflow-hidden rounded-md border border-border bg-surface">
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={expanded}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-text-primary transition-colors hover:bg-panel-hover focus-ring"
            >
              <StatusIcon status={item.status} />
              <span className="flex-1">{item.label}</span>
              {item.confidence != null && (
                <span className="font-mono text-[10px] text-text-muted">{item.confidence}%</span>
              )}
              <ChevronRight
                className={`h-3.5 w-3.5 text-text-muted transition-transform ${expanded ? "rotate-90" : ""}`}
                aria-hidden="true"
              />
            </button>
            {expanded && item.details && (
              <p className="border-t border-border px-3 py-2 text-[11px] leading-relaxed text-text-secondary">
                {item.details}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}