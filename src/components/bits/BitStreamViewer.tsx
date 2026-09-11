import { useMemo, useRef, useState } from "react";
import { Check, Copy, Search } from "lucide-react";
import type { BitStream } from "@/types";

interface BitStreamViewerProps {
  stream: BitStream;
}

type View = "binary" | "hex" | "ascii";

const BYTES_PER_ROW = 8;

function formatOffset(byteIndex: number) {
  const bits = byteIndex * 8;
  return String(bits).padStart(8, "0");
}

export function BitStreamViewer({ stream }: BitStreamViewerProps) {
  const [view, setView] = useState<View>("binary");
  const [grouping, setGrouping] = useState<4 | 8>(8);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const preRef = useRef<HTMLPreElement>(null);

  const matchPositions = useMemo(() => {
    const set = new Set<number>();
    if (!query.trim()) return set;
    let idx = stream.binary.indexOf(query);
    while (idx !== -1) {
      for (let p = idx; p < idx + query.length; p++) set.add(p);
      idx = stream.binary.indexOf(query, idx + 1);
    }
    return set;
  }, [query, stream.binary]);

  const rowCount = Math.ceil(stream.length / 8 / BYTES_PER_ROW);

  const renderBinaryRow = (row: number) => {
    const cells: React.ReactNode[] = [];
    for (let b = 0; b < BYTES_PER_ROW; b++) {
      const byteIdx = row * BYTES_PER_ROW + b;
      const full = byteIdx * 8;
      if (full >= stream.length) break;
      const bits = stream.binary.slice(full, full + 8);
      const chunks =
        grouping === 8 ? [bits] : [bits.slice(0, 4), bits.slice(4, 8)];
      cells.push(
        <span key={byteIdx} className="group inline-flex gap-1">
          {chunks.map((chunk, ci) => (
            <span key={ci}>
              {chunk.split("").map((bitLi, bi) => {
                const bitPos = full + bi + (ci === 0 ? 0 : 4);
                const hit = matchPositions.has(bitPos);
                return (
                  <span
                    key={bi}
                    className={
                      hit
                        ? "rounded-sm bg-warn/30 text-warn"
                        : bitLi === "1"
                          ? "text-cyan-accent"
                          : "text-text-muted"
                    }
                  >
                    {bitLi}
                  </span>
                );
              })}
            </span>
          ))}
        </span>,
      );
    }
    return cells;
  };

  const renderHexRow = (row: number) => {
    const cells: React.ReactNode[] = [];
    for (let b = 0; b < BYTES_PER_ROW; b++) {
      const byteIdx = row * BYTES_PER_ROW + b;
      if (byteIdx >= stream.bytes.length) break;
      const byte = stream.bytes[byteIdx];
      const hit = [0, 1, 2, 3, 4, 5, 6, 7].some((p) =>
        matchPositions.has(byteIdx * 8 + p),
      );
      cells.push(
        <span
          key={byteIdx}
          className={
            hit
              ? "rounded-sm bg-warn/30 px-0.5 text-warn"
              : byte === 0
                ? "text-text-muted"
                : "text-violet-accent"
          }
        >
          {byte.toString(16).padStart(2, "0").toUpperCase()}
        </span>,
      );
    }
    return cells;
  };

  const asciiText = useMemo(
    () =>
      Array.from(stream.bytes)
        .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : "."))
        .join(""),
    [stream.bytes],
  );

  const copy = async () => {
    let text = "";
    if (view === "binary") {
      for (let r = 0; r < rowCount; r++) {
        const bytes = Array.from(stream.bytes.slice(r * BYTES_PER_ROW, r * BYTES_PER_ROW + BYTES_PER_ROW));
        const grouped = bytes.map((b) => {
          const bits = b.toString(2).padStart(8, "0");
          return grouping === 8 ? bits : `${bits.slice(0, 4)} ${bits.slice(4)}`;
        });
        text += `${formatOffset(r * BYTES_PER_ROW)}  ${grouped.join(" ")}\n`;
      }
    } else if (view === "hex") {
      for (let r = 0; r < rowCount; r++) {
        const bytes = Array.from(stream.bytes.slice(r * BYTES_PER_ROW, r * BYTES_PER_ROW + BYTES_PER_ROW));
        text += `${formatOffset(r * BYTES_PER_ROW)}  ${bytes.map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ")}\n`;
      }
    } else {
      text = asciiText;
    }
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      if (preRef.current) {
        const range = document.createRange();
        range.selectNodeContents(preRef.current);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  };

  const hasMatch = query.trim().length > 0 && matchPositions.size > 0;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex rounded-md border border-border bg-surface p-0.5" role="tablist" aria-label="Bit stream view">
          {(["binary", "hex", "ascii"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              role="tab"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`rounded px-2.5 py-1 font-mono text-[11px] uppercase transition-colors focus-ring ${
                view === v ? "bg-cyan-dim/80 text-bg" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {view === "binary" && (
            <label className="flex items-center gap-1.5 text-[11px] text-text-secondary">
              <span className="uppercase tracking-wide text-text-muted">Group</span>
              <select
                value={grouping}
                onChange={(e) => setGrouping(Number(e.target.value) as 4 | 8)}
                className="rounded border border-border-light bg-panel px-1.5 py-0.5 font-mono text-[11px] text-text-primary focus:border-cyan-dim focus:outline-none"
                aria-label="Bit grouping"
              >
                <option value={8}>8 bits</option>
                <option value={4}>4 bits</option>
              </select>
            </label>
          )}
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded border border-border-light bg-panel px-2.5 py-1 text-[11px] text-text-secondary transition-colors hover:border-cyan-dim/50 hover:text-text-primary focus-ring"
          >
            {copied ? (
              <Check className="h-3 w-3 text-ok" aria-hidden="true" />
            ) : (
              <Copy className="h-3 w-3" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search bit pattern (e.g. 10110100)..."
          aria-label="Search bit stream"
          className="w-full rounded-md border border-border-light bg-bg py-1.5 pl-8 pr-3 font-mono text-xs text-text-primary placeholder:text-text-muted focus:border-cyan-dim focus:outline-none"
        />
        {query && (
          <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] ${hasMatch ? "text-warn" : "text-err"}`}>
            {hasMatch ? `${matchPositions.size} bit${matchPositions.size > 1 ? "s" : ""} matched` : "no match"}
          </span>
        )}
      </div>

      <pre
        ref={preRef}
        className="max-h-[320px] overflow-auto rounded-md border border-border bg-surface p-3 font-mono text-[12px] leading-[1.7]"
        role="img"
        aria-label={`${view} view of decoded bit stream`}
      >
        {view === "ascii" ? (
          <div className="font-mono text-text-primary">{asciiText}</div>
        ) : (
          Array.from({ length: rowCount }).map((_, r) => (
            <div key={r} className="flex gap-4 whitespace-pre">
              <span className="select-none text-text-muted">{formatOffset(r * BYTES_PER_ROW)}</span>
              <span aria-label={`Bytes at offset ${r * BYTES_PER_ROW * 8} bits`}>
                {view === "hex" ? renderHexRow(r) : renderBinaryRow(r)}
              </span>
            </div>
          ))
        )}
      </pre>

      <div className="mt-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-text-muted">
        <span>
          {stream.length} bits · {stream.bytes.length} bytes
        </span>
        <span className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-sm bg-warn/60" aria-hidden="true" /> search hit
          </span>
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-sm bg-cyan-accent" aria-hidden="true" /> bit = 1
          </span>
        </span>
      </div>
    </div>
  );
}