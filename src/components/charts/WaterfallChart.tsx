import type { WaterfallData } from "@/types";
import { ChartFrame } from "./ChartFrame";
import { PlotlyChart, type PlotData, type PlotLayout } from "./PlotlyChart";
import { baseConfig, baseLayout, plotFont } from "./PlotTheme";

interface WaterfallChartProps {
  data: WaterfallData;
  height?: number;
}

export function WaterfallChart({ data, height = 320 }: WaterfallChartProps) {
  const traces: PlotData[] = [
    {
      type: "heatmap",
      x: data.frequencies,
      y: data.times,
      z: data.intensities,
      colorscale: [
        [0, "#0a0c10"],
        [0.35, "#0e2a3a"],
        [0.6, "#155e75"],
        [0.8, "#22d3ee"],
        [1, "#7dd3fc"],
      ],
      colorbar: {
        title: { text: "dBm", font: plotFont },
        tickfont: plotFont,
        thickness: 10,
      },
      hovertemplate:
        "t=%{y:.2f} s<br>f=%{x:,.0f} Hz<br>P=%{z:.1f} dBm<extra></extra>",
    },
  ];

  const layout: PlotLayout = {
    ...baseLayout,
    showlegend: false,
    xaxis: {
      ...baseLayout.xaxis,
      title: { text: "Frequency (Hz)", font: plotFont },
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: { text: "Time (s)", font: plotFont },
      autorange: "reversed",
    },
    margin: { ...baseLayout.margin, r: 56 },
  };

  return (
    <ChartFrame
      title="Waterfall"
      subtitle={`${(data.times[data.times.length - 1] ?? 0).toFixed(1)}s observation window`}
      badge="DEMO DATA"
    >
      <PlotlyChart data={traces} layout={layout} config={baseConfig} height={height} />
    </ChartFrame>
  );
}