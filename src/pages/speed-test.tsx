import { Link, useCall } from "helium/client";
import { getTasks } from "helium/server";
import { useState } from "react";

const calculateFilteredAverage = (times: number[]) => {
    if (times.length === 0) return 0;
    const sorted = [...times].sort((a, b) => a - b);
    const trimCount = Math.floor(times.length * 0.1); // Trim 10% from each end
    const trimmed = sorted.slice(trimCount, sorted.length - trimCount);

    if (trimmed.length === 0) return 0;

    const sum = trimmed.reduce((acc, curr) => acc + curr, 0);
    return sum / trimmed.length;
};

export default function SpeedTest() {
    const { call: fetchTasks } = useCall(getTasks);

    const fetchTasksViaHTTP = async () => {
        const response = await fetch("/api/get-tasks?status=open", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return await response.json();
    };

    const fetchTasksViaRPC = async () => {
        return await fetchTasks({ status: "open" });
    };

    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [detailedResults, setDetailedResults] = useState<any[]>([]);

    const runTest = async () => {
        setIsRunning(true);
        const iterations = 100;

        // Initialize detailed results
        const initialDetails = Array.from({ length: iterations }, (_, i) => ({
            id: i + 1,
            rpc: null,
            http: null,
        }));
        setDetailedResults(initialDetails);

        setResults([
            {
                network: "Current Connection",
                rpc: "Testing...",
                http: "Pending...",
                improvement: "-",
            },
        ]);

        const rpcDurations: number[] = [];

        // Test RPC
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await fetchTasksViaRPC();
            const end = performance.now();
            const duration = end - start;
            rpcDurations.push(duration);

            setDetailedResults((prev) => {
                const newResults = [...prev];
                newResults[i] = { ...newResults[i], rpc: duration };
                return newResults;
            });
        }

        const rpcAvg = calculateFilteredAverage(rpcDurations);

        setResults([
            {
                network: "Current Connection",
                rpc: rpcAvg.toFixed(0),
                http: "Testing...",
                improvement: "-",
            },
        ]);

        const httpDurations: number[] = [];

        // Test HTTP
        for (let i = 0; i < iterations; i++) {
            const start = performance.now();
            await fetchTasksViaHTTP();
            const end = performance.now();
            const duration = end - start;
            httpDurations.push(duration);

            setDetailedResults((prev) => {
                const newResults = [...prev];
                newResults[i] = { ...newResults[i], http: duration };
                return newResults;
            });
        }

        const httpAvg = calculateFilteredAverage(httpDurations);
        const improvement = (httpAvg / rpcAvg).toFixed(1) + "x";

        setResults([
            {
                network: "Current Connection",
                rpc: rpcAvg.toFixed(0),
                http: httpAvg.toFixed(0),
                improvement,
            },
        ]);

        setIsRunning(false);
    };

    return (
        <div className="py-10 max-w-4xl mx-auto">
            <h1 className="text-3xl font-semibold text-center mb-3">Speed Test</h1>
            <p className="text-lg text-gray-500 text-center mb-8">Compare the performance of Helium RPC vs HTTP requests.</p>

            <div className="flex justify-center mb-10">
                <button onClick={runTest} disabled={isRunning} className="button primary">
                    {isRunning ? "Running Test..." : "Start Speed Test"}
                </button>
            </div>

            {results.length > 0 && (
                <div className="space-y-8">
                    <div className="overflow-x-auto">
                        <h3 className="text-xl font-semibold mb-4">Summary</h3>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RPC Avg (ms)</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HTTP Avg (ms)</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {results.map((result, index) => (
                                    <tr key={index}>
                                        <td className="py-4 px-6 text-sm font-medium text-gray-900">{result.network}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{result.rpc}</td>
                                        <td className="py-4 px-6 text-sm text-gray-500">{result.http}</td>
                                        <td className="py-4 px-6 text-sm text-green-600 font-semibold">{result.improvement}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {detailedResults.length > 0 && (
                        <div className="overflow-x-auto">
                            <h3 className="text-xl font-semibold mb-4">Detailed Results (100 requests)</h3>
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request #</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RPC (ms)</th>
                                        <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HTTP (ms)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {detailedResults.map((result) => (
                                        <tr key={result.id}>
                                            <td className="py-2 px-6 text-sm font-medium text-gray-900">{result.id}</td>
                                            <td className="py-2 px-6 text-sm text-gray-500">{result.rpc !== null ? result.rpc.toFixed(2) : "-"}</td>
                                            <td className="py-2 px-6 text-sm text-gray-500">{result.http !== null ? result.http.toFixed(2) : "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            <div className="mt-8 text-center">
                <Link href="/" className="text-teal-600 hover:underline">
                    &larr; Back to Home
                </Link>
            </div>
        </div>
    );
}
