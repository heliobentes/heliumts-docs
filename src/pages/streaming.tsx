import { IconArrowUp, IconMessageCircle, IconSparkles } from "@tabler/icons-react";
import { Link, useStreaming } from "heliumts/client";
import { useEffect, useRef, useState } from "react";

import { streamText } from "../rpc.generated";

const buttonClasses =
    "inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-40";
const primaryButtonClasses = `${buttonClasses} border-teal-700 bg-teal-700 text-white enabled:hover:bg-teal-800`;
const secondaryButtonClasses = `${buttonClasses} border-slate-200 bg-white text-slate-700 enabled:hover:bg-slate-50`;

const statusClasses = {
    Ready: "border-slate-200 bg-slate-50 text-slate-600",
    Streaming: "border-teal-200 bg-teal-50 text-teal-800",
    Complete: "border-teal-200 bg-teal-50 text-teal-800",
    Stopped: "border-slate-200 bg-slate-50 text-slate-600",
    Error: "border-rose-200 bg-rose-50 text-rose-700",
};

type Run = { id: number; prompt: string; stopped: boolean };
type Turn = Run & { chunks: readonly string[]; error: string | null };

export default function StreamingDemo() {
    const [draft, setDraft] = useState("");
    const [simulateError, setSimulateError] = useState(false);
    const [history, setHistory] = useState<Turn[]>([]);
    const [run, setRun] = useState<Run | null>(null);
    const logRef = useRef<HTMLDivElement>(null);
    const followReply = useRef(true);
    const { chunks, isStreaming, error, start, cancel, reset } = useStreaming(streamText);
    const status = error ? "Error" : isStreaming ? "Streaming" : run?.stopped ? "Stopped" : run ? "Complete" : "Ready";
    const currentTurn = run ? { ...run, chunks, error } : null;
    const turns = currentTurn ? [...history, currentTurn] : history;

    useEffect(() => {
        const log = logRef.current;
        if (log && followReply.current) log.scrollTop = log.scrollHeight;
    }, [chunks.length, error, isStreaming, run]);

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
            <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Streaming chat demo</h1>
                    <p className="mt-2 text-slate-600">Send a message and watch a scripted reply arrive one chunk at a time.</p>
                </div>
                <Link href="/docs/core-concepts/rpc/streaming" className="shrink-0 text-sm font-medium text-teal-700 underline-offset-4 hover:underline">
                    useStreaming guide <span aria-hidden="true">↗</span>
                </Link>
            </div>

            <section aria-labelledby="conversation-heading" className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-4 py-3 sm:px-6">
                    <h2 id="conversation-heading" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <IconMessageCircle size={19} className="text-teal-700" aria-hidden="true" /> Conversation
                    </h2>
                    <span role="status" className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}>
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
                        <span className="sr-only">Stream status: </span>
                        {status}
                    </span>
                </div>

                <div
                    ref={logRef}
                    role="log"
                    aria-labelledby="conversation-heading"
                    aria-relevant="additions"
                    tabIndex={0}
                    onScroll={(event) => {
                        const log = event.currentTarget;
                        followReply.current = log.scrollHeight - log.scrollTop - log.clientHeight < 32;
                    }}
                    className="min-h-72 max-h-[min(28rem,60vh)] space-y-5 overflow-y-auto bg-slate-50 px-4 py-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700 sm:min-h-80 sm:px-6"
                >
                    {turns.length === 0 ? (
                        <div className="flex min-h-60 flex-col items-center justify-center text-center">
                            <span className="mb-3 rounded-xl bg-teal-100 p-2.5 text-teal-700">
                                <IconSparkles size={22} aria-hidden="true" />
                            </span>
                            <p className="text-sm font-semibold text-slate-800">Send a message to start</p>
                            <p className="mt-1 text-sm text-slate-600">The demo assistant sends scripted replies. No API key needed.</p>
                        </div>
                    ) : (
                        turns.map((turn) => (
                            <div key={turn.id} className="space-y-4">
                                <div className="ml-auto w-fit max-w-[90%] sm:max-w-[80%]">
                                    <p className="mb-1 text-right text-xs font-medium text-slate-600">You</p>
                                    <p className="rounded-2xl rounded-tr-sm bg-teal-700 px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap text-white wrap-anywhere">
                                        {turn.prompt}
                                    </p>
                                </div>
                                <div className="w-fit max-w-[95%] sm:max-w-[85%]">
                                    <p className="mb-1 text-xs font-medium text-slate-600">Demo assistant</p>
                                    <div className="rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-800 wrap-anywhere">
                                        {turn.chunks.length > 0 ? (
                                            <p className="whitespace-pre-wrap">
                                                {turn.chunks.map((chunk, index) => (
                                                    <span key={index}>{chunk}</span>
                                                ))}
                                            </p>
                                        ) : (
                                            <p className="text-slate-500">{turn.id === run?.id && isStreaming ? "Waiting for the reply…" : "No reply received."}</p>
                                        )}
                                        {turn.stopped ? <p className="mt-1 text-xs text-slate-500">Reply stopped</p> : null}
                                        {turn.error ? (
                                            <p role="alert" className="mt-1 text-sm text-rose-700">
                                                {turn.error}
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t border-slate-200 p-4 sm:px-6">
                    <form
                        className="flex items-center gap-2"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const prompt = draft.trim();
                            if (!prompt || isStreaming) return;
                            if (currentTurn) setHistory((previous) => [...previous, currentTurn]);
                            followReply.current = true;
                            setRun({ id: (run?.id ?? 0) + 1, prompt, stopped: false });
                            setDraft("");
                            void start({ prompt, failAfterFirstChunk: simulateError });
                        }}
                    >
                        <label htmlFor="stream-message" className="sr-only">
                            Message
                        </label>
                        <input
                            id="stream-message"
                            name="message"
                            type="text"
                            value={draft}
                            maxLength={200}
                            required
                            placeholder="Write a message…"
                            onChange={(event) => setDraft(event.target.value)}
                            className="min-h-11 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 outline-none placeholder:text-slate-500 focus:border-teal-700 focus:ring-2 focus:ring-teal-700/15 sm:text-sm"
                        />
                        <button type="submit" className={`${primaryButtonClasses} min-h-11 shrink-0`} disabled={!draft.trim() || isStreaming}>
                            Send <IconArrowUp size={16} aria-hidden="true" />
                        </button>
                    </form>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                className={secondaryButtonClasses}
                                disabled={!isStreaming}
                                onClick={() => {
                                    cancel();
                                    setRun((previous) => previous && { ...previous, stopped: true });
                                }}
                            >
                                Stop
                            </button>
                            <button
                                type="button"
                                className={secondaryButtonClasses}
                                disabled={!run}
                                onClick={() => {
                                    if (!run) return;
                                    followReply.current = true;
                                    setRun({ ...run, stopped: false });
                                    void start({ prompt: run.prompt, failAfterFirstChunk: simulateError });
                                }}
                            >
                                Restart reply
                            </button>
                            <button
                                type="button"
                                className={secondaryButtonClasses}
                                disabled={!run}
                                onClick={() => {
                                    reset();
                                    followReply.current = true;
                                    setRun(null);
                                    setHistory([]);
                                    setDraft("");
                                }}
                            >
                                Clear chat
                            </button>
                        </div>
                        <span className="font-mono text-xs text-slate-500 tabular-nums">
                            {chunks.length} {chunks.length === 1 ? "chunk" : "chunks"}
                        </span>
                    </div>
                </div>
            </section>

            <details className="mt-4 text-sm text-slate-600">
                <summary className="w-fit cursor-pointer rounded text-sm font-medium hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
                    Advanced options
                </summary>
                <label className="mt-3 flex w-fit cursor-pointer items-start gap-2">
                    <input
                        type="checkbox"
                        checked={simulateError}
                        onChange={(event) => setSimulateError(event.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-teal-700"
                    />
                    Simulate an error after the first chunk
                </label>
            </details>
        </div>
    );
}
