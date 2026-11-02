import { callMethod, Link } from "heliumts/client";
import { getTasks } from "heliumts/server";
import { useEffect, useRef, useState } from "react";

import { type BenchmarkRow, runBenchmark, summarizeBenchmark } from "../lib/benchmark";

const iterations = 50;
const warmups = 3;

export default function SpeedTest() {
    const [isRunning, setIsRunning] = useState(false);
    const [rows, setRows] = useState<BenchmarkRow[]>([]);
    const [progress, setProgress] = useState("");
    const [error, setError] = useState<string | null>(null);
    const controllerRef = useRef<AbortController | null>(null);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
            controllerRef.current?.abort();
        };
    }, []);

    const runTest = async () => {
        if (controllerRef.current) {
            return;
        }
        const controller = new AbortController();
        controllerRef.current = controller;
        setIsRunning(true);
        setRows([]);
        setError(null);
        setProgress("Warming both connections…");
        try {
            const result = await runBenchmark({
                iterations,
                warmups,
                isCancelled: () => controller.signal.aborted,
                rpc: async () => {
                    const result = await callMethod(getTasks, undefined, { transport: "websocket" });
                    if (result.transport !== "websocket") {
                        throw new Error("The request did not use WebSocket. No HTTP fallback is included in this comparison.");
                    }
                    return result.data;
                },
                http: async () => {
                    const response = await fetch("/api/get-tasks", {
                        cache: "no-store",
                        headers: { Accept: "application/json" },
                        signal: controller.signal,
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP request failed (${response.status}).`);
                    }
                    return response.json();
                },
                onProgress: (phase, completed, total) => {
                    if (mountedRef.current && !controller.signal.aborted && (phase === "warmup" || completed % 5 === 0)) {
                        setProgress(phase === "warmup" ? `Warm-up ${completed} of ${total} pairs` : `Measured ${completed} of ${total} pairs`);
                    }
                },
            });
            if (mountedRef.current) {
                setRows(result.rows);
                setProgress(result.complete ? `Completed ${iterations} pairs.` : `Stopped after ${result.rows.length} complete pairs.`);
            }
        } catch (failure) {
            if (mountedRef.current) {
                if (controller.signal.aborted) {
                    setProgress("Test stopped.");
                } else {
                    setError(failure instanceof Error ? failure.message : "The benchmark could not complete.");
                    setProgress("Test failed during warm-up.");
                }
            }
        } finally {
            controllerRef.current = null;
            if (mountedRef.current) {
                setIsRunning(false);
            }
        }
    };

    const stopTest = () => {
        controllerRef.current?.abort();
        setProgress("Stopping after the current request…");
    };
    const summary = summarizeBenchmark(rows, iterations);
    const comparison =
        summary.ratio === null
            ? "A ratio is shown only when every measured request succeeds with matching data."
            : Math.abs(summary.ratio - 1) < 0.01
              ? "The average round-trip times were similar in this run."
              : summary.ratio > 1
                ? "WebSocket had the lower average round-trip time in this run."
                : "HTTP had the lower average round-trip time in this run.";

    return (
        <div className="py-10 px-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center mb-3">Speed Test</h1>
            <p className="text-lg text-gray-500 text-center mb-4">Compare warmed WebSocket RPC with uncached HTTP JSON on your current connection.</p>
            <p className="text-sm text-gray-500 text-center max-w-3xl mx-auto mb-8">
                Both return the same 1,000 deterministic in-memory tasks, with no database or artificial server delay. The test warms each path {warmups} times, then measures{" "}
                {iterations} sequential pairs with alternating order. Timing includes the request, transfer, and decoding; payload validation and table rendering are excluded.
            </p>

            <div className="flex justify-center gap-3 mb-4">
                <button onClick={runTest} disabled={isRunning} className="button primary">
                    {isRunning ? "Running Test…" : "Start Speed Test"}
                </button>
                {isRunning && (
                    <button onClick={stopTest} className="button">
                        Stop Test
                    </button>
                )}
            </div>
            <p role="status" aria-live="polite" className="text-center text-sm text-gray-500 mb-6">
                {progress}
            </p>
            {error && (
                <p role="alert" className="text-center text-red-700 mb-6">
                    {error}
                </p>
            )}

            {rows.length > 0 && (
                <div className="space-y-8">
                    <div className="overflow-x-auto">
                        <h2 className="text-xl font-semibold mb-4">Summary</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <caption className="sr-only">Successful request averages and failed requests for each transport</caption>
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {["Transport", "Average (ms)", "Successful", "Failed"].map((heading) => (
                                        <th key={heading} scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[
                                    { name: "WebSocket RPC", stats: summary.rpc },
                                    { name: "HTTP JSON", stats: summary.http },
                                ].map(({ name, stats }) => (
                                    <tr key={name}>
                                        <th scope="row" className="py-4 px-6 text-sm font-medium text-gray-900 text-left">
                                            {name}
                                        </th>
                                        <td className="py-4 px-6 text-sm text-gray-500">{stats.averageMs?.toFixed(2) ?? "—"}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{stats.successes}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{stats.failures}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="text-sm text-gray-600 mt-3">
                            HTTP average ÷ WebSocket average:{" "}
                            <strong>
                                {summary.ratio === null ? "—" : summary.ratio < 0.01 ? "<0.01" : summary.ratio.toFixed(2)}
                                {summary.ratio !== null ? "×" : ""}
                            </strong>
                            . {comparison}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                            Every positive successful timing is retained; no fast samples or outliers are trimmed. Failed or mismatched responses are reported separately.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <h2 className="text-xl font-semibold mb-4">Detailed Results ({rows.length} pairs)</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <caption className="sr-only">Individual paired measurements, with request failures displayed instead of zero milliseconds</caption>
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    {["Pair / first request", "WebSocket RPC (ms)", "HTTP JSON (ms)"].map((heading) => (
                                        <th key={heading} scope="col" className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {rows.map((row) => (
                                    <tr key={row.id}>
                                        <th scope="row" className="py-2 px-6 text-sm font-medium text-gray-900 text-left">
                                            {row.id} / {row.id % 2 === 1 ? "WebSocket" : "HTTP"}
                                        </th>
                                        {[row.rpc, row.http].map((sample, index) => (
                                            <td key={index} className="py-2 px-6 text-sm text-gray-500">
                                                {sample.error ? <span className="text-red-700">Failed: {sample.error}</span> : (sample.durationMs?.toFixed(2) ?? "—")}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <p className="text-sm text-gray-500 mt-8">
                Results depend on network conditions, proxy compression, payload, and device performance; WebSocket is not guaranteed to win. Chrome DevTools network throttling may
                apply latency differently to HTTP and WebSocket traffic, so throttled results are not a reliable like-for-like latency comparison. To compare slow links, use
                network shaping that applies equally to both. Connection setup and warm-up are not included in these averages.
            </p>
            <div className="mt-8 text-center">
                <Link href="/" className="text-teal-600 hover:underline">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
