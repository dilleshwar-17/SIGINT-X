/**
 * SIGINT-X development API server.
 *
 * Serves the existing fixture dataset over the real `/api/v1` contract so the
 * frontend runs against genuine HTTP instead of in-process fixtures.
 *
 * The dataset is imported directly from the TypeScript source: every import in
 * that module is `import type`, which Node's native type stripping erases, so no
 * build step and no duplicated data are required.
 *
 *   node server/index.mjs
 *
 * Not a production backend: state is in-memory and resets on restart.
 */
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const {
  mockApi,
  mockHypotheses,
  mockModulationPrediction,
  mockEvidence,
} = await import("../src/services/mockData.ts");

const PORT = Number(process.env.PORT ?? 8000);
const HOST = process.env.HOST ?? "127.0.0.1";
const BASE = "/api/v1";

/** Uploaded signals live here for the lifetime of the process. */
const uploadedSignals = [];

const json = (res, status, body) => {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(payload);
};

/** Status payload now reflects a genuinely running service. */
const status = () => ({
  reachable: true,
  backendVersion: process.env.npm_package_version ?? "1.0.0",
  modelVersion: "v0.3.1",
});

const allSignals = async () => [...uploadedSignals, ...(await mockApi.getSignals())];

const routes = [
  ["GET", /^\/status$/, () => status()],
  ["GET", /^\/signals$/, () => allSignals()],

  ["GET", /^\/signals\/([^/]+)\/features$/, async (_m) => mockApi.getSignalFeatures()],

  ["POST", /^\/signals$/, async (_m, body) => {
    const signal = {
      id: `SIG-${randomUUID().slice(0, 8).toUpperCase()}`,
      filename: body?.filename ?? "upload.iq",
      format: (body?.filename?.split(".").pop() ?? "iq").toUpperCase(),
      sizeBytes: Number(body?.sizeBytes ?? 0),
      sampleRate: 2_048_000,
      centerFrequency: 1_575_420_000,
      capturedAt: new Date().toISOString(),
      status: "analyzed",
    };
    uploadedSignals.unshift(signal);
    return signal;
  }],

  // `recent` must be matched before the `:id` pattern.
  ["GET", /^\/analyses\/recent$/, () => mockApi.getRecentAnalyses()],
  ["GET", /^\/analyses$/, () => mockApi.getRecentAnalyses()],
  ["POST", /^\/analyses$/, () => mockApi.getAnalysis("ANL-0042")],

  ["GET", /^\/analyses\/([^/]+)$/, async (m) => mockApi.getAnalysis(m[1])],
  ["GET", /^\/analyses\/([^/]+)\/status$/, async () => ({
    status: await mockApi.getAnalysisStatus(),
  })],
  ["GET", /^\/analyses\/([^/]+)\/pipelines$/, () => mockApi.getPipelines()],
  ["GET", /^\/analyses\/([^/]+)\/pipelines\/([^/]+)$/, async (m) => {
    const list = await mockApi.getPipelines();
    return list.find((p) => p.id === m[2]) ?? list[0];
  }],
  ["GET", /^\/analyses\/([^/]+)\/hypotheses$/, () => mockHypotheses],
  ["GET", /^\/analyses\/([^/]+)\/modulation$/, () => mockModulationPrediction],
  ["GET", /^\/analyses\/([^/]+)\/evidence$/, () => mockEvidence],
  ["GET", /^\/analyses\/([^/]+)\/report$/, async (m) => mockApi.getAnalysis(m[1])],

  ["GET", /^\/dashboard\/stats$/, () => mockApi.getDashboardStats()],
  ["GET", /^\/experiments$/, () => mockApi.getExperiments()],
  ["GET", /^\/models$/, () => mockApi.getModels()],
  ["GET", /^\/bitstream$/, () => mockApi.getBitStream()],
  ["GET", /^\/frame$/, () => mockApi.getFrame()],
  ["GET", /^\/constellation$/, () => mockApi.getConstellationData()],
];

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  if (!url.pathname.startsWith(BASE)) {
    return json(res, 404, { error: "not_found", path: url.pathname });
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  const route = url.pathname.slice(BASE.length) || "/";
  const method = req.method ?? "GET";

  for (const [verb, pattern, handler] of routes) {
    if (verb !== method) continue;
    const match = route.match(pattern);
    if (!match) continue;
    try {
      const body = method === "POST" ? await readBody(req) : undefined;
      const payload = await handler(match, body);
      return json(res, 200, payload);
    } catch (err) {
      return json(res, 500, { error: "handler_failed", message: String(err) });
    }
  }

  json(res, 404, { error: "no_route", method, path: url.pathname });
});

server.listen(PORT, HOST, () => {
  console.log(`SIGINT-X API  http://${HOST}:${PORT}${BASE}`);
  console.log("Health:  curl http://" + `${HOST}:${PORT}${BASE}/status`);
});
