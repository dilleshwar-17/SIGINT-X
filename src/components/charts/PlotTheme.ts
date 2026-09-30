export const plotColors = {
  background: "rgba(0,0,0,0)",
  paper: "rgba(0,0,0,0)",
  grid: "rgba(148,163,184,0.10)",
  gridZero: "rgba(148,163,184,0.22)",
  text: "#9aa6ba",
  textStrong: "#e8edf6",
  cyan: "#22d3ee",
  violet: "#a78bfa",
  ok: "#34d399",
  warn: "#fbbf24",
  err: "#f87171",
  magenta: "#e879f9",
  yellow: "#facc15",
} as const;

export const sansStack =
  "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif";
export const monoStack = "'JetBrains Mono', ui-monospace, monospace";

/** Prose, titles, legends and annotations read better in the UI sans. */
export const labelFont = {
  family: sansStack,
  size: 11,
  color: plotColors.text,
};

/** Numeric ticks stay monospaced so digits align down the axis. */
export const plotFont = {
  family: monoStack,
  size: 10,
  color: plotColors.text,
};

export const axisBase = {
  gridcolor: plotColors.grid,
  zerolinecolor: plotColors.gridZero,
  linecolor: "rgba(148,163,184,0.16)",
  linewidth: 1,
  tickfont: plotFont,
  title: { font: { family: sansStack, size: 11, color: plotColors.text } },
  ticks: "outside" as const,
  ticklen: 3,
  tickcolor: "rgba(148,163,184,0.24)",
  automargin: true,
  showspikes: false,
};

export const baseLayout = {
  font: labelFont,
  paper_bgcolor: plotColors.paper,
  plot_bgcolor: plotColors.background,
  margin: { l: 58, r: 20, t: 18, b: 44 },
  hovermode: "closest" as const,
  hoverdistance: 40,
  spikedistance: -1,
  dragmode: "zoom" as const,
  hoverlabel: {
    bgcolor: "rgba(14,18,27,0.95)",
    bordercolor: "rgba(34,211,238,0.35)",
    font: { family: monoStack, size: 10, color: plotColors.textStrong },
    align: "left" as const,
    namelength: -1,
  },
  legend: {
    bgcolor: "rgba(0,0,0,0)",
    bordercolor: "rgba(148,163,184,0.14)",
    borderwidth: 1,
    font: labelFont,
    orientation: "h" as const,
    x: 0,
    y: 1.14,
  },
  modebar: {
    color: "rgba(154,166,186,0.65)",
    activecolor: plotColors.cyan,
    bgcolor: "rgba(0,0,0,0)",
  },
  xaxis: axisBase,
  yaxis: axisBase,
  colorway: [plotColors.cyan, plotColors.violet, plotColors.ok, plotColors.warn, plotColors.magenta],
  transitions: { duration: 260, easing: "cubic-in-out" as const },
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
    "hoverClosestGl2d",
    "hoverCompareGl2d",
    "toggleHover",
    "sendDataToCloud",
  ],
  toImageButtonOptions: {
    format: "png" as const,
    scale: 2,
    bgcolor: "#0b0e15",
  },
} as const;
