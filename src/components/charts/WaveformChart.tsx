import type { WaveformData } from "@/types";
import { ChartFrame } from "./ChartFrame";
import { PlotlyChart, type PlotData, type PlotLayout } from "./PlotlyChart";
import { baseConfig, baseLayout, labelFont, plotColors } from "./PlotTheme";

interface WaveformChartProps {
  data: WaveformData;
  height?: number;
}

export function WaveformChart({ data, height = 320 }: WaveformChartProps) {
  const traces: PlotData[] = [
    {
      type: "scatter",
      mode: "lines",
      x: data.time,
      y: data.i,
      name: "I",
      line: { color: plotColors.cyan, width: 1.2 },
      hovertemplate: "t=%{x:.4f} ms<br>I=%{y:.3f}<extra></extra>",
    },
    {
      type: "scatter",
      mode: "lines",
      x: data.time,
      y: data.q,
      name: "Q",
      line: { color: plotColors.violet, width: 1.2 },
      hovertemplate: "t=%{x:.4f} ms<br>Q=%{y:.3f}<extra></extra>",
    },
  ];

  const layout: PlotLayout = {
    ...baseLayout,
    showlegend: true,
    legend: { font: labelFont, bgcolor: "rgba(0,0,0,0)", orientation: "h" },
    xaxis: {
      ...baseLayout.xaxis,
      title: { text: "Time (ms)", font: labelFont },
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: { text: "Amplitude", font: labelFont },
    },
  };

  return (
    <ChartFrame
      title="Waveform"
      subtitle="Baseband I/Q samples"
    >
      <PlotlyChart data={traces} layout={layout} config={baseConfig} height={height} />
    </ChartFrame>
  );
}