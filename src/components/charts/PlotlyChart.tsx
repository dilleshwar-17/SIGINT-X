import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";

const Plot = createPlotlyComponent(Plotly);

export type PlotData = Record<string, unknown>;
export type PlotLayout = Record<string, unknown>;

interface PlotlyChartProps {
  data: PlotData[];
  layout: PlotLayout;
  config?: PlotLayout;
  className?: string;
  height?: number;
}

export function PlotlyChart({
  data,
  layout,
  config,
  className = "",
  height = 320,
}: PlotlyChartProps) {
  return (
    <Plot
      data={data as unknown[]}
      layout={{
        ...(layout as unknown as Record<string, unknown>),
        autosize: true,
        height,
      }}
      config={config as unknown}
      useResizeHandler
      style={{ width: "100%", height }}
      divId={undefined}
      className={className}
    />
  );
}