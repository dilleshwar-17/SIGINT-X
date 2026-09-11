export const plotColors = {
  background: "#151a23",
  paper: "rgba(0,0,0,0)",
  grid: "#232936",
  gridZero: "#2c3442",
  text: "#9aa3b2",
  textStrong: "#e5e9f0",
  cyan: "#22d3ee",
  violet: "#a78bfa",
  ok: "#34d399",
  warn: "#fbbf24",
  err: "#f87171",
  magenta: "#e879f9",
  yellow: "#facc15",
} as const;

export const plotFont = {
  family: "'JetBrains Mono', ui-monospace, monospace",
  size: 10,
  color: plotColors.text,
};

export const baseLayout = {
  font: plotFont,
  paper_bgcolor: plotColors.paper,
  plot_bgcolor: plotColors.background,
  margin: { l: 56, r: 24, t: 24, b: 44 },
  hoverlabel: {
    bgcolor: "#1a202b",
    bordercolor: "#2c3442",
    font: { family: plotFont.family, size: 10, color: plotColors.textStrong },
  },
  modebar: {
    color: plotColors.text,
    activecolor: plotColors.cyan,
    bgcolor: "rgba(0,0,0,0)",
  },
  xaxis: {
    gridcolor: plotColors.grid,
    zerolinecolor: plotColors.gridZero,
    linecolor: plotColors.grid,
    tickfont: plotFont,
  },
  yaxis: {
    gridcolor: plotColors.grid,
    zerolinecolor: plotColors.gridZero,
    linecolor: plotColors.grid,
    tickfont: plotFont,
  },
};

export const baseConfig = {
  responsive: true,
  displaylogo: false,
  scrollZoom: true,
  editable: false,
  displayModeBar: true,
  modeBarButtonsToRemove: [
    "autoScale2d",
    "lasso2d",
    "select2d",
    "toggleSpikelines",
    "hoverClosestCartesian",
    "hoverCompareCartesian",
  ],
} as const;