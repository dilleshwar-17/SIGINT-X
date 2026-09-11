import type { SpectrumData } from "@/types";
import { ChartFrame } from "./ChartFrame";
import { PlotlyChart, type PlotData, type PlotLayout } from "./PlotlyChart";
import { baseConfig, baseLayout, plotColors, plotFont } from "./PlotTheme";

interface SpectrumChartProps {
  data: SpectrumData;
  height?: number;
}

export function SpectrumChart({ data, height = 320 }: SpectrumChartProps) {
  const traces: PlotData[] = [
    {
      type: "scatter",
      mode: "lines",
      x: data.frequencies,
      y: data.magnitudes,
      name: "Magnitude",
      line: { color: plotColors.cyan, width: 1.4 },
      hovertemplate:
        "f=%{x:,.0f} Hz<br>P=%{y:.1f} dBm<extra></extra>",
    },
  ];

  if (data.peakIndices.length > 0) {
    traces.push({
      type: "scatter",
      mode: "markers",
      x: data.peakIndices.map((i) => data.frequencies[i]),
      y: data.peakIndices.map((i) => data.magnitudes[i]),
      name: "Detected peak",
      marker: {
        color: plotColors.violet,
        symbol: "diamond-open",
        size: 9,
        line: { color: plotColors.violet, width: 1.5 },
      },
      hovertemplate: "Peak f=%{x:,.0f} Hz<br>%{y:.1f} dBm<extra></extra>",
    });
  }

  // Find the strongest peak center and the -3 dB band edges for the subtitle.
  const strongest = [...data.peakIndices].sort(
    (a, b) => data.magnitudes[b] - data.magnitudes[a],
  )[0];
  const centerFreq = strongest !== undefined ? data.frequencies[strongest] : 0;
  const bwKHz = data.bandwidth / 1000;

  const layout: PlotLayout = {
    ...baseLayout,
    showlegend: false,
    xaxis: {
      ...baseLayout.xaxis,
      title: { text: "Frequency (Hz)", font: plotFont },
      range: [data.frequencies[0], data.frequencies[data.frequencies.length - 1]],
    },
    yaxis: {
      ...baseLayout.yaxis,
      title: { text: "dBm", font: plotFont },
    },
    shapes: [
      {
        type: "line",
        x0: centerFreq - data.bandwidth / 2,
        x1: centerFreq - data.bandwidth / 2,
        y0: -130,
        y1: -50,
        line: { color: plotColors.ok, width: 1, dash: "dot" },
      },
      {
        type: "line",
        x0: centerFreq + data.bandwidth / 2,
        x1: centerFreq + data.bandwidth / 2,
        y0: -130,
        y1: -50,
        line: { color: plotColors.ok, width: 1, dash: "dot" },
      },
    ],
    annotations: [
      {
        x: centerFreq,
        y: -50,
        xanchor: "center",
        yanchor: "bottom",
        text: `${bwKHz.toFixed(0)} kHz BW`,
        showarrow: false,
        font: { ...plotFont, color: plotColors.ok },
      },
    ],
  };

  return (
    <ChartFrame
      title="Spectrum"
      subtitle={`Peak ${(centerFreq / 1000).toFixed(0)} kHz · ${bwKHz.toFixed(0)} kHz bandwidth`}
      badge="DEMO DATA"
    >
      <PlotlyChart data={traces} layout={layout} config={baseConfig} height={height} />
    </ChartFrame>
  );
}