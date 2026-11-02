export type BenchmarkSample = {
    durationMs: number | null;
    error: string | null;
};

export type BenchmarkRow = {
    id: number;
    rpc: BenchmarkSample;
    http: BenchmarkSample;
};

type Protocol = "rpc" | "http";

type BenchmarkOptions = {
    rpc: () => Promise<unknown>;
    http: () => Promise<unknown>;
    iterations: number;
    warmups: number;
    now?: () => number;
    isCancelled?: () => boolean;
    onProgress?: (phase: "warmup" | "measure", completed: number, total: number) => void;
};

function payloadSignature(payload: unknown): string {
    if (
        !Array.isArray(payload) ||
        payload.length !== 1000 ||
        !payload.every(
            (task) =>
                task !== null &&
                typeof task === "object" &&
                typeof task.name === "string" &&
                (task.status === "open" || task.status === "closed") &&
                typeof task.description === "string" &&
                typeof task.date === "string" &&
                typeof task.priority === "number" &&
                Number.isFinite(task.priority)
        )
    ) {
        throw new Error("Expected the complete 1,000-task benchmark payload.");
    }
    return JSON.stringify(payload);
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Request failed.";
}

export function summarizeBenchmark(rows: BenchmarkRow[], expectedPairs: number) {
    const stats = (protocol: Protocol) => {
        const samples = rows.map((row) => row[protocol]);
        const durations = samples.filter((sample) => sample.error === null && sample.durationMs !== null && sample.durationMs > 0).map((sample) => sample.durationMs!);
        return {
            averageMs: durations.length ? durations.reduce((sum, duration) => sum + duration, 0) / durations.length : null,
            successes: durations.length,
            failures: samples.length - durations.length,
        };
    };
    const rpc = stats("rpc");
    const http = stats("http");
    const complete = rows.length === expectedPairs && rpc.successes === expectedPairs && http.successes === expectedPairs;
    const ratio = complete && rpc.averageMs !== null && http.averageMs !== null ? http.averageMs / rpc.averageMs : null;
    return { rpc, http, ratio: ratio !== null && Number.isFinite(ratio) ? ratio : null };
}

/** Measure alternating, sequential pairs. Warm-up and payload checks are excluded from timing. */
export async function runBenchmark(options: BenchmarkOptions): Promise<{ rows: BenchmarkRow[]; complete: boolean }> {
    const { rpc, http, iterations, warmups, now = () => performance.now(), isCancelled = () => false, onProgress } = options;
    const operations = { rpc, http };
    const rows: BenchmarkRow[] = [];
    const order = (index: number): Protocol[] => (index % 2 === 0 ? ["rpc", "http"] : ["http", "rpc"]);

    for (let index = 0; index < warmups; index++) {
        const signatures: string[] = [];
        for (const protocol of order(index)) {
            if (isCancelled()) {
                return { rows, complete: false };
            }
            try {
                signatures.push(payloadSignature(await operations[protocol]()));
            } catch (error) {
                if (isCancelled()) {
                    return { rows, complete: false };
                }
                throw new Error(`${protocol === "rpc" ? "WebSocket" : "HTTP"} warm-up failed: ${errorMessage(error)}`);
            }
        }
        if (signatures[0] !== signatures[1]) {
            throw new Error("Warm-up responses differed. A comparison would not measure the same payload.");
        }
        onProgress?.("warmup", index + 1, warmups);
    }

    for (let index = 0; index < iterations; index++) {
        const results = {} as Record<Protocol, BenchmarkSample & { signature?: string }>;
        for (const protocol of order(index)) {
            if (isCancelled()) {
                return { rows, complete: false };
            }
            const start = now();
            try {
                const payload = await operations[protocol]();
                const durationMs = now() - start;
                if (!Number.isFinite(durationMs) || durationMs <= 0) {
                    throw new Error("The browser did not provide a positive timing sample.");
                }
                // Validation and comparison happen after the timed transfer/decode.
                results[protocol] = { durationMs, error: null, signature: payloadSignature(payload) };
            } catch (error) {
                results[protocol] = { durationMs: null, error: errorMessage(error) };
            }
        }
        if (isCancelled()) {
            return { rows, complete: false };
        }
        if (!results.rpc.error && !results.http.error && results.rpc.signature !== results.http.signature) {
            results.rpc.error = "Responses differed; this pair cannot be compared.";
            results.http.error = "Responses differed; this pair cannot be compared.";
        }
        rows.push({
            id: index + 1,
            rpc: { durationMs: results.rpc.durationMs, error: results.rpc.error },
            http: { durationMs: results.http.durationMs, error: results.http.error },
        });
        onProgress?.("measure", index + 1, iterations);
    }
    return { rows, complete: true };
}
