import { useCallback, useRef, useState } from "react";
import { FileUp, File, X, CheckCircle2, Radio } from "lucide-react";
import { useSigintStore } from "@/store/useSigintStore";
import type { Signal } from "@/types";

const SUPPORTED_EXTENSIONS = ["iq", "wav"];

function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

interface SignalUploaderProps {
  onUploaded?: (signal: Signal) => void;
}

export function SignalUploader({ onUploaded }: SignalUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const accept = useCallback((f: File) => {
    setError(null);
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !SUPPORTED_EXTENSIONS.includes(ext)) {
      setError(`Unsupported file type ".${ext ?? "?"}". Supported: .iq, .wav`);
      setFile(null);
      setValidated(false);
      return;
    }
    if (f.size > 200 * 1024 ** 2) {
      setError("File exceeds the 200 MB upload limit.");
      setFile(null);
      setValidated(false);
      return;
    }
    setFile(f);
    setValidated(true);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) accept(dropped);
    },
    [accept],
  );

  const handleUpload = useCallback(async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    // Mock integration: replace with uploadSignal(file) when backend is wired.
    const steps = [18, 42, 68, 88, 100];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 160));
      setProgress(step);
    }

    const signal: Signal = {
      id: "SIG-LOCAL",
      filename: file.name,
      format: file.name.split(".").pop()?.toUpperCase() === "WAV" ? "WAV" : "IQ",
      sizeBytes: file.size,
      duration: 4.21,
      uploadedAt: new Date().toISOString(),
      status: "UPLOADED",
    };
    useSigintStore.getState().setCurrentSignal(signal);
    useSigintStore.getState().addSignal(signal);
    setUploading(false);
    onUploaded?.(signal);
  }, [file, onUploaded]);

  const hasFile = Boolean(file && validated);

  return (
    <div>
      {!hasFile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload a signal file (IQ or WAV)"
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={onDrop}
          className={`group relative flex min-h-[230px] cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 focus-ring ${
            dragActive
              ? "scale-[1.01] border-cyan-accent bg-cyan-accent/[0.12] shadow-[0_20px_50px_-24px_rgba(34,211,238,0.9)]"
              : "border-border-light/80 bg-white/[0.02] hover:border-cyan-accent/60 hover:bg-cyan-accent/[0.05]"
          }`}
        >
          <span
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-accent/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />
          <span
            className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-accent/25 bg-gradient-to-br from-cyan-accent/20 to-violet-dim/15 text-cyan-accent transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_14px_34px_-14px_rgba(34,211,238,0.9)]"
            aria-hidden="true"
          >
            <FileUp className="h-6 w-6" />
          </span>

          <span className="text-sm font-semibold uppercase tracking-[0.16em] text-text-primary">
            Drop Signal File
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted">
            .iq · .wav
          </span>
          <span className="text-xs text-text-secondary">
            Drag &amp; drop or <span className="text-cyan-accent">browse files</span>
          </span>

          <input
            ref={inputRef}
            type="file"
            accept=".iq,.wav"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) accept(f);
              e.target.value = "";
            }}
          />
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="animate-fade-in mt-3 flex items-start gap-2 rounded-lg border border-err/40 bg-err/10 px-3 py-2.5 text-xs text-err"
        >
          <span>{error}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError(null)}
            className="ml-auto rounded transition-colors hover:text-white focus-ring"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {hasFile && (
        <div className="animate-fade-up panel-surface p-4" style={{ borderColor: "rgba(52,211,153,0.28)" }}>
          <div className="mb-3 flex items-center gap-2">
            <Radio className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
              Selected file
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="icon-chip h-9 w-9 shrink-0 text-info">
                <File className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <div className="truncate font-mono text-sm text-text-primary">{file!.name}</div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 font-mono text-[11px] text-text-muted">
                  <span>Format: {file!.name.split(".").pop()?.toUpperCase()}</span>
                  <span>Size: {formatBytes(file!.size)}</span>
                  <span>≈ 4.21 s</span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-2 py-0.5 font-mono text-[10px] text-ok">
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                Valid
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setValidated(false);
                }}
                aria-label="Remove file"
                className="rounded-lg p-1.5 text-text-muted transition-colors hover:bg-white/[0.06] hover:text-err focus-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {hasFile && !uploading && (
        <button
          type="button"
          onClick={handleUpload}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-cyan-accent to-cyan-dim px-4 py-2.5 text-sm font-semibold text-[#04121a] transition-all duration-200 hover:from-white hover:to-cyan-accent hover:shadow-[0_14px_34px_-16px_rgba(34,211,238,0.95)] focus-ring"
        >
          <FileUp className="h-4 w-4" aria-hidden="true" />
          Upload Signal
        </button>
      )}

      {uploading && (
        <div className="animate-fade-up panel-surface mt-4 px-4 py-3.5">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-text-secondary">
              <span
                className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-accent/25 border-t-cyan-accent"
                aria-hidden="true"
              />
              Uploading signal…
            </span>
            <span className="font-mono text-xs text-cyan-accent">{progress}%</span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-accent to-violet-accent transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
