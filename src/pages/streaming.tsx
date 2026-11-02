import { Link, useStreaming } from "heliumts/client";
import { streamText } from "heliumts/server";
import { useState } from "react";

const buttonClasses =
    "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-4 py-2.5 text-center text-sm font-semibold transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-40";
const primaryButtonClasses = `${buttonClasses} border-teal-700 bg-teal-700 text-white enabled:hover:border-teal-800 enabled:hover:bg-teal-800`;
const secondaryButtonClasses = `${buttonClasses} border-slate-200 bg-white text-slate-700 enabled:hover:border-slate-300 enabled:hover:bg-slate-50`;

const statusClasses = {
    Ready: "border-slate-200 bg-slate-50 text-slate-600",
    Streaming: "border-teal-200 bg-teal-50 text-teal-800",
    Complete: "border-teal-200 bg-teal-50 text-teal-800",
    Stopped: "border-slate-200 bg-slate-50 text-slate-600",
    Error: "border-rose-200 bg-rose-50 text-rose-700",
};

export default function StreamingDemo() {
    const [name, setName] = useState("Helium");
    const [simulateError, setSimulateError] = useState(false);
    const [run, setRun] = useState<{ id: number; state: "ready" | "started" | "stopped" }>({ id: 0, state: "ready" });
    const { chunks, text, isStreaming, error, start, cancel, reset } = useStreaming(streamText);
    const status = error ? "Error" : isStreaming ? "Streaming" : run.state === "stopped" ? "Stopped" : run.state === "started" ? "Complete" : "Ready";
    const hasRun = run.state !== "ready";
    const emptyTitle = isStreaming
        ? "Waiting for the response…"
        : status === "Stopped"
          ? "Stream stopped"
          : status === "Error"
            ? "No response received"
            : "Your response starts here";
    const emptyHint = isStreaming
        ? "Chunks will appear as they arrive."
        : status === "Stopped"
          ? "Restart whenever you’re ready."
          : status === "Error"
            ? "Adjust the request and try again."
            : "Enter a name, then start streaming.";

    return (
        <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Streaming playground</h1>
                    <p className="mt-3 text-base leading-relaxed text-slate-600">Watch a sample response arrive, one chunk at a time.</p>
                </div>
                <Link
                    href="/docs/core-concepts/rpc/streaming"
                    className="shrink-0 rounded text-sm font-medium text-teal-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
                >
                    useStreaming guide <span aria-hidden="true">↗</span>
                </Link>
            </div>

            <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-6">
                <section aria-labelledby="stream-request-heading" className="min-w-0 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
                    <h2 id="stream-request-heading" className="text-sm font-semibold text-slate-900">
                        Request
                    </h2>
                    <form
                        className="mt-6 space-y-5"
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!name.trim()) return;
                            setRun((previous) => ({ id: previous.id + 1, state: "started" }));
                            void start({ prompt: name, failAfterFirstChunk: simulateError });
                        }}
                    >
                        <div>
                            <label htmlFor="stream-name" className="block text-sm font-medium text-slate-800">
                                Name
                            </label>
                            <input
                                id="stream-name"
                                name="name"
                                type="text"
                                value={name}
                                maxLength={200}
                                required
                                aria-describedby="stream-name-hint"
                                onChange={(event) => setName(event.target.value)}
                                className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 outline-none transition-colors placeholder:text-slate-500 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15 sm:text-sm"
                            />
                            <p id="stream-name-hint" className="mt-2 text-xs text-slate-500">
                                Used in the sample greeting.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <button type="submit" className={`${primaryButtonClasses} w-full`} disabled={!name.trim()}>
                                {hasRun ? "Restart" : "Start streaming"}
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    className={secondaryButtonClasses}
                                    disabled={!isStreaming}
                                    onClick={() => {
                                        cancel();
                                        setRun((previous) => ({ ...previous, state: "stopped" }));
                                    }}
                                >
                                    Stop
                                </button>
                                <button
                                    type="button"
                                    className={secondaryButtonClasses}
                                    disabled={!hasRun && !isStreaming && !error}
                                    onClick={() => {
                                        reset();
                                        setRun((previous) => ({ ...previous, state: "ready" }));
                                    }}
                                >
                                    Reset
                                </button>
                            </div>
                            <p className="pt-1 text-center text-xs text-slate-500">Stopping keeps the text received so far.</p>
                        </div>
                    </form>
                    <details className="mt-6 border-t border-slate-100 pt-4">
                        <summary className="cursor-pointer rounded text-xs font-medium text-slate-500 marker:text-slate-400 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
                            Advanced options
                        </summary>
                        <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-sm leading-5 text-slate-600">
                            <input
                                type="checkbox"
                                checked={simulateError}
                                onChange={(event) => setSimulateError(event.target.checked)}
                                className="mt-0.5 size-4 shrink-0 accent-teal-700"
                            />
                            Simulate an error after the first chunk
                        </label>
                    </details>
                </section>

                <section aria-labelledby="stream-response-heading" className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
                        <h2 id="stream-response-heading" className="text-sm font-semibold text-slate-900">
                            Response
                        </h2>
                        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}>
                            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                            <span className="sr-only">Stream status: </span>
                            {status}
                        </span>
                    </div>
                    <output
                        aria-labelledby="stream-response-heading"
                        aria-live="polite"
                        aria-atomic="false"
                        aria-relevant="additions"
                        className="block min-h-72 flex-1 px-5 py-6 text-base leading-8 text-slate-800 [overflow-wrap:anywhere] sm:min-h-80 sm:px-6"
                    >
                        {text ? (
                            <span className="whitespace-pre-wrap">
                                {chunks.map((chunk, index) => (
                                    <span key={`${run.id}-${index}`}>{chunk}</span>
                                ))}
                            </span>
                        ) : (
                            <span className="flex min-h-60 flex-col items-center justify-center px-3 text-center sm:min-h-68">
                                <span
                                    aria-hidden="true"
                                    className="mb-4 flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 font-mono text-sm text-slate-400"
                                >
                                    &gt;_
                                </span>
                                <span className="text-sm font-medium text-slate-700">{emptyTitle}</span>
                                <span className="mt-1 text-sm leading-6 text-slate-500">{emptyHint}</span>
                            </span>
                        )}
                    </output>
                    {error ? (
                        <p
                            role="alert"
                            className="mx-5 mb-5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm leading-6 text-rose-800 [overflow-wrap:anywhere] sm:mx-6"
                        >
                            {error}
                        </p>
                    ) : null}
                    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-slate-100 bg-slate-50/60 px-5 py-3 text-xs text-slate-500 sm:px-6">
                        <span className="font-mono tabular-nums">
                            {chunks.length} {chunks.length === 1 ? "chunk" : "chunks"}
                        </span>
                        <span>Sample response · No API key</span>
                    </div>
                </section>
            </div>
        </div>
    );
}
