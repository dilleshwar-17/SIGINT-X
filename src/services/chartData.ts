import type {
  ConstellationData,
  SpectrumData,
  WaterfallData,
} from "@/types";

// Deterministic PRNG (mulberry32) so generated datasets are stable across renders.
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SAMPLE_RATE = 2_400_000; // Hz
const N_BINS = 1024;
const N_TIME_ROWS = 64;

function gaussian(x: number, mean: number, std: number) {
  return Math.exp(-((x - mean) ** 2) / (2 * std * std));
}

export function generateSpectrum(): SpectrumData {
  const rng = mulberry32(20260908);
  const lo = -SAMPLE_RATE / 2;
  const hi = SAMPLE_RATE / 2;
  const fc = 120_000; // Hz center offset
  const std = 76_500; // gives ~180 kHz occupied bandwidth
  const noiseFloor = -108;

  const frequencies: number[] = [];
  const magnitudes: number[] = [];
  for (let i = 0; i < N_BINS; i++) {
    const f = lo + ((hi - lo) * i) / (N_BINS - 1);
    frequencies.push(f);
    const ripple = noiseFloor + (rng() - 0.5) * 6;
    const numerator = noiseFloor + 22 * gaussian(f, fc, std) + 4 * gaussian(f, fc - 40_000, std);
    magnitudes.push(Math.max(ripple, numerator));
  }

  // Detect peaks: local maxima above -95 dBm, separated by at least 8 bins.
  const peakIndices: number[] = [];
  const threshold = -95;
  for (let i = 2; i < N_BINS - 2; i++) {
    if (magnitudes[i] > threshold) {
      const localMax =
        magnitudes[i] >= magnitudes[i - 1] &&
        magnitudes[i] >= magnitudes[i + 1] &&
        magnitudes[i] >= magnitudes[i - 2] &&
        magnitudes[i] >= magnitudes[i + 2];
      if (localMax) {
        const last = peakIndices[peakIndices.length - 1];
        if (last === undefined || i - last > 8) {
          peakIndices.push(i);
        }
      }
    }
  }

  // Bandwidth estimate: -3 dB points around the strongest peak.
  let bandwidth = 180_000;
  if (peakIndices.length > 0) {
    const strongest = [...peakIndices].sort((a, b) => magnitudes[b] - magnitudes[a])[0];
    const peakDb = magnitudes[strongest];
    const half = peakDb - 3;
    let leftIdx = strongest;
    let rightIdx = strongest;
    while (leftIdx > 0 && magnitudes[leftIdx] > half) leftIdx--;
    while (rightIdx < N_BINS - 1 && magnitudes[rightIdx] > half) rightIdx++;
    bandwidth = Math.max(30_000, frequencies[rightIdx] - frequencies[leftIdx]);
  }

  return { frequencies, magnitudes, peakIndices, bandwidth };
}

export function generateWaterfall(): WaterfallData {
  const { frequencies } = generateSpectrum();
  const rng = mulberry32(314159);
  const duration = 4.2;
  const fcStart = 120_000;
  const fcDrift = 18_000; // slow doppler drift
  const std = 76_500;
  const noiseFloor = -108;

  const times: number[] = [];
  const intensities: number[][] = [];
  const step = duration / N_TIME_ROWS;
  for (let r = 0; r < N_TIME_ROWS; r++) {
    const t = r * step;
    times.push(t);
    const fc = fcStart + fcDrift * Math.sin((2 * Math.PI * t) / duration);
    const amplitude = 21 + 4 * Math.sin((2 * Math.PI * t) / 1.1 + rng());
    const row: number[] = [];
    const decimation = 4;
    for (let i = 0; i < N_BINS; i += decimation) {
      const f = frequencies[i];
      const value =
        noiseFloor + amplitude * gaussian(f, fc, std) + (rng() - 0.5) * 8;
      row.push(value);
    }
    intensities.push(row);
  }

  return {
    frequencies: frequencies.filter((_, i) => i % 4 === 0),
    times,
    intensities,
  };
}

export function generateConstellation(): ConstellationData {
  const rng = mulberry32(2718);
  const pointsPerCluster = 500;
  const spread = 0.11;
  const clusters = [
    { x: 1, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ];
  const iSamples: number[] = [];
  const qSamples: number[] = [];
  for (const c of clusters) {
    for (let k = 0; k < pointsPerCluster; k++) {
      const noise = (s: number) => s * 0.12 + (rng() - 0.5) * spread * 2;
      iSamples.push(noise(c.x));
      qSamples.push(noise(c.y));
    }
  }
  // Rotate the constellation into the observed reference frame.
  const cos = Math.cos(Math.PI / 4);
  const sin = Math.sin(Math.PI / 4);
  for (let i = 0; i < iSamples.length; i++) {
    const x = iSamples[i];
    const y = qSamples[i];
    iSamples[i] = x * cos - y * sin;
    qSamples[i] = x * sin + y * cos;
  }
  return {
    iSamples,
    qSamples,
    referencePoints: clusters.map((c) => {
      const x = c.x * cos - c.y * sin;
      const y = c.x * sin + c.y * cos;
      return { x, y, label: `QPSK+${Math.round((Math.atan2(y, x) * 180) / Math.PI)}°` };
    }),
  };
}

export function generateWaveform(): {
  time: number[];
  i: number[];
  q: number[];
} {
  const rng = mulberry32(16180);
  const samples = 512;
  const spectrum: number[] = [];
  const time: number[] = [];
  const q: number[] = [];
  const symbolsPerWindow = 8;
  const phases = new Array<number>(symbolsPerWindow);
  for (let k = 0; k < symbolsPerWindow; k++) {
    phases[k] = (Math.round(rng()) * Math.PI) / 2 + (Math.round(rng()) * Math.PI);
  }
  for (let n = 0; n < samples; n++) {
    const t = n / samples;
    time.push(t * 2); // ms
    const symbolIdx = Math.floor(n / (samples / symbolsPerWindow));
    const within = (n % (samples / symbolsPerWindow)) / (samples / symbolsPerWindow);
    const pulse = Math.sin(Math.PI * Math.min(1, Math.max(0, within))) ** 0.9;
    const phase = phases[symbolIdx % symbolsPerWindow];
    spectrum.push(pulse * Math.cos(phase) + (rng() - 0.5) * 0.12);
    q.push(pulse * Math.sin(phase) + (rng() - 0.5) * 0.12);
  }
  return { time, i: spectrum, q };
}

export { SAMPLE_RATE };