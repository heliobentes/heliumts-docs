import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const directory = mkdtempSync(path.join(tmpdir(), "helium-benchmark-test-"));
after(() => rmSync(directory, { recursive: true, force: true }));
execFileSync(process.execPath, [
    fileURLToPath(new URL("../node_modules/typescript/bin/tsc", import.meta.url)),
    fileURLToPath(new URL("../src/lib/benchmark.ts", import.meta.url)),
    "--target", "ES2022", "--module", "ES2022", "--moduleResolution", "bundler", "--skipLibCheck", "--outDir", directory,
]);
writeFileSync(path.join(directory, "package.json"), '{"type":"module"}');
const { runBenchmark, summarizeBenchmark } = await import(pathToFileURL(path.join(directory, "benchmark.js")).href);

const payload = Array.from({ length: 1000 }, (_, index) => ({
    name: `Task ${index}`,
    status: "open",
    description: "Deterministic task",
    date: "2026-01-01T00:00:00.000Z",
    priority: 1,
}));

function harness() {
    let clock = 0;
    const calls = [];
    return {
        calls,
        now: () => clock,
        rpc: async () => { calls.push("rpc"); clock += 0.25; return payload; },
        http: async () => { calls.push("http"); clock += 0.5; return payload; },
    };
}

test("warms both paths, balances sequential request order, and retains sub-100ms samples", async () => {
    const operations = harness();
    const result = await runBenchmark({ ...operations, iterations: 4, warmups: 2 });
    assert.deepEqual(operations.calls, ["rpc", "http", "http", "rpc", "rpc", "http", "http", "rpc", "rpc", "http", "http", "rpc"]);
    assert.equal(result.complete, true);
    assert.equal(result.rows.length, 4);
    const summary = summarizeBenchmark(result.rows, 4);
    assert.equal(summary.rpc.averageMs, 0.25);
    assert.equal(summary.http.averageMs, 0.5);
    assert.equal(summary.rpc.successes, 4);
    assert.equal(summary.ratio, 2);
});

test("keeps failed requests separate instead of presenting zero milliseconds or a success ratio", async () => {
    const operations = harness();
    let rpcCalls = 0;
    const result = await runBenchmark({
        ...operations, iterations: 3, warmups: 0,
        rpc: async () => {
            if (++rpcCalls === 3) throw new Error("WebSocket disconnected");
            return operations.rpc();
        },
    });
    assert.equal(result.rows[2].rpc.durationMs, null);
    assert.equal(result.rows[2].rpc.error, "WebSocket disconnected");
    const summary = summarizeBenchmark(result.rows, 3);
    assert.equal(summary.rpc.failures, 1);
    assert.equal(summary.http.successes, 3);
    assert.equal(summary.ratio, null);
});

test("rejects different payloads instead of comparing a partial or altered response", async () => {
    const operations = harness();
    const alteredPayload = payload.map((task, index) => index === 0 ? { ...task, priority: 2 } : task);
    const result = await runBenchmark({ ...operations, iterations: 1, warmups: 0, http: async () => { await operations.http(); return alteredPayload; } });
    assert.match(result.rows[0].rpc.error, /Responses differed/);
    assert.match(result.rows[0].http.error, /Responses differed/);
    assert.equal(summarizeBenchmark(result.rows, 1).ratio, null);
});

test("fails warm-up when an endpoint returns an error-shaped or incomplete payload", async () => {
    const operations = harness();
    await assert.rejects(runBenchmark({ ...operations, iterations: 2, warmups: 1, http: async () => ({ error: "Rate limited" }) }), /HTTP warm-up failed.*1,000-task/);
    assert.deepEqual(operations.calls, ["rpc"]);
});

test("stops between requests after cancellation without starting the second transport", async () => {
    const operations = harness();
    let cancelled = false;
    const result = await runBenchmark({
        ...operations, iterations: 2, warmups: 0, isCancelled: () => cancelled,
        rpc: async () => { const response = await operations.rpc(); cancelled = true; return response; },
    });
    assert.deepEqual(operations.calls, ["rpc"]);
    assert.deepEqual(result, { rows: [], complete: false });
});

test("uses every positive successful sample without trimming fast or slow observations", () => {
    const times = [0.01, 1, 5, 1000];
    const rows = times.map((durationMs, index) => ({ id: index + 1, rpc: { durationMs, error: null }, http: { durationMs: durationMs * 2, error: null } }));
    const summary = summarizeBenchmark(rows, rows.length);
    assert.equal(summary.rpc.averageMs, times.reduce((sum, value) => sum + value, 0) / times.length);
    assert.equal(summary.ratio, 2);
    assert.equal(summarizeBenchmark(rows, 50).ratio, null);
    assert.equal(summarizeBenchmark([], 50).rpc.averageMs, null);
    assert.equal(summarizeBenchmark([], 50).ratio, null);
});
