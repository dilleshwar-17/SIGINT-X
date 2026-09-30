import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Binary, LayoutGrid, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { Button } from "@/components/ui/Button";
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
    getBitStream().then(setStream).catch(() => setStream(null));
    getFrame().then(setFrame).catch(() => setFrame(null));
  }, []);

  return (
    <div className="max-w-5xl space-y-6">
      <PageHeader
        eyebrow="Decoded Output"
        title="Bit Stream & Frame Analysis"
        subtitle={`Decoded bit stream and inferred framing structure for ${id ?? "analysis"}`}
        actions={
          <Link to={`/analyze/${id}/report`}>
            <Button variant="secondary" size="md">
              <FileText className="h-3.5 w-3.5" aria-hidden="true" />
              View Report
            </Button>
          </Link>
        }
      />

      <Panel
        title="Bit Stream"
        subtitle={stream ? `${stream.length} bits decoded` : undefined}
        icon={<Binary className="h-3.5 w-3.5" aria-hidden="true" />}
        footer="Undecoded raw bits carry no semantic meaning; interpretation is shown only where the pipeline has established it."
      >
        {stream ? <BitStreamViewer stream={stream} /> : <PanelSkeleton rows={6} />}
      </Panel>

      <Panel
        title="Frame Structure"
        subtitle={frame ? `${frame.regions.length} regions inferred` : undefined}
        icon={<LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />}
      >
        {frame ? <FrameStructure frame={frame} /> : <PanelSkeleton rows={4} />}
      </Panel>
    </div>
  );
}