import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Binary, LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { BitStreamViewer } from "@/components/bits/BitStreamViewer";
import { FrameStructure } from "@/components/bits/FrameStructure";
import { getBitStream, getFrame } from "@/services/api";
import { PanelSkeleton } from "@/components/ui/Skeleton";
import type { BitStream as BitStreamData, Frame } from "@/types";

export function BitStreamAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [stream, setStream] = useState<BitStreamData | null>(null);
  const [frame, setFrame] = useState<Frame | null>(null);

  useEffect(() => {
    getBitStream().then(setStream);
    getFrame().then(setFrame);
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        title="Bit Stream & Frame Analysis"
        subtitle={`Decoded bit stream and inferred framing structure for ANL-${id ?? ""}`}
        actions={
          <Link
            to={`/analyze/${id}/report`}
            className="inline-flex items-center gap-1.5 rounded-md border border-border-light bg-panel px-3.5 py-1.5 text-sm text-text-primary transition-colors hover:border-cyan-dim/50 hover:bg-panel-hover"
          >
            View Report
          </Link>
        }
      />

      <Panel title="Bit Stream" icon={<Binary className="h-3.5 w-3.5" aria-hidden="true" />}>
        {stream ? (
          <BitStreamViewer stream={stream} />
        ) : (
          <PanelSkeleton rows={6} />
        )}
        <p className="mt-3 text-[10px] leading-relaxed text-text-muted">
          Undecoded raw bits carry no semantic meaning; interpretation is only shown where the
          pipeline has established it.
        </p>
      </Panel>

      <Panel title="Frame Structure" icon={<LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />}>
        {frame ? <FrameStructure frame={frame} /> : <PanelSkeleton rows={4} />}
      </Panel>
    </div>
  );
}