import { useState } from "react";
import { Grid3X3 } from "lucide-react";
import type { ConstellationData } from "@/types";
import { ChartFrame } from "./ChartFrame";
import { PlotlyChart, type PlotData, type PlotLayout } from "./PlotlyChart";
import { baseConfig, baseLayout, plotColors, plotFont } from "./PlotTheme";

interface ConstellationChartProps {
  data: ConstellationData;
  height?: number;
}

export function ConstellationChart({ data, height = 320 }: ConstellationChartProps) {
  const [showReference, setShowReference] = useState(true);

  const traces: PlotData[] = [
    {
      type: "scattergl",
      mode: "markers",
      x: data.iSamples,
      y: data.qSamples,
      name: "Observed samples",
      marker: {
        color: plotColors.cyan,
        size: 3.2,
        opacity: 0.75,
      },
      hovertemplate: "I=%{x:.3f}<br>Q=%{y:.3f}<extra></extra>",
      customdata: data.iSamples.map((_, i) => i),
    },
  ];

  if (showReference && data.referencePoints) {
    traces.push({
      type: "scatter",
      mode: "markers",
      x: data.referencePoints.map((p) => p.x),
      y: data.referencePoints.map((p) => p.y),
      text: data.referencePoints.map((p) => p.label),
      name: "Reference",
      marker: {
        color: plotColors.violet,
        symbol: "star",
        size: 11,
        line: { color: "rgba(0,0,0,0.5)", width: 0.6 },
      },
      hovertemplate: "%{text}<br>%{x:.2f}, %{y:.2f}<extra></extra>",
    });
  }

  const layout: PlotLayout = {
    ...baseLayout,
    showlegend: true,
    legend: {
      font: plotFont,
      bgcolor: "rgba(0,0,0,0)",
    },
    xaxis: {
      ...baseLayout.xaxis,
      title: { text: "I", font: plotFont },
      zerolinecolor: plotColors.gridZero,
      domain: [0, 1],
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: { text: "Q", font: plotFont },
      scaleanchor: "x",
      scaleratio: 1,
    },
  };

  return (
    <ChartFrame
      title="Constellation"
      subtitle={`${data.iSamples.length.toLocaleString()} observed samples`}
      badge="DEMO DATA"
      toolbar={
        <button
          type="button"
          onClick={() => setShowReference((v) => !v)}
          aria-pressed={showReference}
          title="Toggle reference points"
          className={
            showReference
              ? "rounded p-1 text-cyan-accent"
              : "rounded p-1 text-text-muted hover:text-text-primary"
          }
        >
          <Grid3X3 className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      }
    >
      <PlotlyChart data={traces} layout={layout} config={baseConfig} height={height} />
    </ChartFrame>
  );
}