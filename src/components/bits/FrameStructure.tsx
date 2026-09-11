import { useState } from "react";
import type { Frame, FrameRegion } from "@/types";

interface FrameStructureProps {
  frame: Frame;
}

const regionColors = {
  Preamble: "bg-cyan-accent/70 text-bg",
  Header: "bg-violet-accent/70 text-bg",
  Payload: "bg-ok/60 text-bg",
  default: "bg-border-light text-text-primary",
};

function colorFor(name: string, index: number) {
  if (name.toUpperCase().includes("PREAMBLE")) return regionColors.Preamble;
  if (name.toUpperCase().includes("HEADER")) return regionColors.Header;
  if (name.toUpperCase().includes("PAYLOAD")) return regionColors.Payload;
  return index % 2 === 0 ? regionColors.Header : regionColors.default;
}

export function FrameStructure({ frame }: FrameStructureProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected: FrameRegion | undefined = frame.regions[selectedIdx];

  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-text-muted">
          Frame Structure
        </span>
        <span className="font-mono text-[10px] text-text-muted">{frame.totalBits} bits total</span>
      </div>

      <div
        className="flex h-14 w-full overflow-hidden rounded-md border border-border"
        role="img"
        aria-label={`Frame layout: ${frame.regions.map((r) => `${r.name} ${r.bitLength} bits`).join(", ")}`}
      >
        {frame.regions.map((region, i) => {
          const pct = (region.bitLength / frame.totalBits) * 100;
          if (pct <= 0) return null;
          return (
            <button
              key={region.id}
              type="button"
              data-region={i}
              onClick={() => setSelectedIdx(i)}
              title={`${region.name} — ${region.bitLength} bits`}
              className={`relative flex h-full flex-col items-center justify-center gap-0.5 border-r border-bg/40 px-1 text-center transition-colors last:border-r-0 focus-ring ${colorFor(region.name, i)} ${
                selectedIdx === i ? "ring-2 ring-inset ring-cyan-accent brightness-110" : "opacity-90 hover:opacity-100 hover:brightness-110"
              }`}
              style={{ width: `${pct}%` }}
              aria-pressed={selectedIdx === i}
            >
              <span className="truncate text-[10px] font-semibold leading-none">{region.name}</span>
              <span className="font-mono text-[9px] leading-none opacity-80">{region.bitLength}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex justify-between font-mono text-[9px] text-text-muted">
        <span>bit 0</span>
        <span>bit {frame.totalBits}</span>
      </div>

      {selected && (
        <dl className="mt-3 grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-4" aria-live="polite">
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-text-muted">Region</dt>
            <dd className="mt-0.5 text-xs font-medium text-text-primary">{selected.name}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-text-muted">Bit Offset</dt>
            <dd className="mt-0.5 font-mono text-xs text-text-primary">{selected.bitOffset}</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-text-muted">Length</dt>
            <dd className="mt-0.5 font-mono text-xs text-text-primary">{selected.bitLength} bits</dd>
          </div>
          <div>
            <dt className="text-[9px] uppercase tracking-widest text-text-muted">Confidence</dt>
            <dd className={`mt-0.5 font-mono text-xs ${selected.confidence >= 90 ? "text-ok" : selected.confidence >= 70 ? "text-warn" : "text-err"}`}>
              {selected.confidence}% · corr {selected.correlation.toFixed(2)}
            </dd>
          </div>
          {selected.semantic && (
            <div className="col-span-full">
              <dt className="text-[9px] uppercase tracking-widest text-text-muted">Structural Role</dt>
              <dd className="mt-0.5 text-xs text-text-secondary">{selected.semantic}</dd>
            </div>
          )}
        </dl>
      )}

      <p className="mt-3 text-[10px] leading-relaxed text-text-muted">
        Region boundaries are inferred from correlation peaks. Semantic meaning is only claimed where
        the backend has established it explicitly.
      </p>
    </div>
  );
}