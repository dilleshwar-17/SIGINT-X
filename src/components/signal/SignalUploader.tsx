import { useCallback, useRef, useState } from "react";
import { FileUp, File, X } from "lucide-react";
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
    // Mock integration: replace with uploadSignal(file) when backend is wired.
    await new Promise((r) => setTimeout(r, 800));
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
    setUploading(false);
    onUploaded?.(signal);
  }, [file, onUploaded]);

  return (
    <div>
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
        className={`flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed p-8 text-center transition-colors focus-ring ${
          dragActive
            ? "border-cyan-accent bg-cyan-accent/10"
            : "border-border-light bg-panel hover:border-cyan-dim/60"
        }`}
      >
        <FileUp className="h-10 w-10 text-cyan-accent" aria-hidden="true" />
        <span className="text-sm font-semibold uppercase tracking-widest text-text-primary">
          Drop Signal File
        </span>
        <span className="font-mono text-xs text-text-muted">IQ / WAV</span>
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

      {error && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2 rounded-md border border-err/40 bg-err/10 px-3 py-2 text-xs text-err"
        >
          <span>{error}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setError(null)}
            className="ml-auto focus-ring"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      )}

      {file && validated && (
        <div className="mt-4 rounded-md border border-border bg-panel p-4">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-text-muted">
            File
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <File className="h-5 w-5 shrink-0 text-info" aria-hidden="true" />
              <div>
                <div className="font-mono text-sm text-text-primary">{file.name}</div>
                <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-text-muted">
                  <span className="uppercase">
                    Format: Complex {file.name.split(".").pop()?.toUpperCase()}
                  </span>
                  <span>Size: {formatBytes(file.size)}</span>
                  <span>Duration: 4.21 sec (estimate)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs text-ok">
                <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                Valid
              </span>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setValidated(false);
                }}
                aria-label="Remove file"
                className="rounded p-1 text-text-muted transition-colors hover:bg-panel-hover hover:text-text-primary focus-ring"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      )}

      {file && validated && !uploading && (
        <button
          type="button"
          onClick={handleUpload}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-cyan-dim/80 px-4 py-2.5 text-sm font-semibold text-bg transition-colors hover:bg-cyan-accent focus-ring"
        >
          <FileUp className="h-4 w-4" aria-hidden="true" />
          Upload Signal
        </button>
      )}

      {uploading && (
        <div className="mt-4 flex items-center justify-center gap-2 rounded-md border border-border bg-panel px-4 py-2.5 text-sm text-text-secondary">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-accent/30 border-t-cyan-accent" aria-hidden="true" />
          Uploading signal...
        </div>
      )}
    </div>
  );
}