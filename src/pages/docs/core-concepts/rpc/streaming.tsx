"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function Streaming() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Typed Streaming</Heading>
            <p>
                Use an async generator with the existing <code>defineMethod</code> API, then consume its typed chunks with <code>useStreaming</code>. Helium handles the HTTP
                request and incremental decoding; your component does not write fetch or reader code.
            </p>
            <p>
                <Link href="/streaming" className="text-teal-600 underline">
                    Open the runnable streaming demo
                </Link>
                . It needs no provider SDK, API key, or database, and includes a partial-error control.
            </p>
            <Heading level={2}>Server method</Heading>
            <CodeBlock
                language="typescript"
                code={`// src/server/streaming.ts
import { setTimeout as delay } from "node:timers/promises";
import { defineMethod } from "heliumts/server";

export const streamReply = defineMethod(async function* (
    { prompt }: { prompt: string }, ctx
) {
    for (const word of ["Hello ", prompt, "! ", "This reply arrives in chunks."]) {
        if (ctx.signal.aborted) return;
        await delay(60, undefined, { signal: ctx.signal });
        yield word;
    }
});`}
            />
            <p>
                Keep implementations in <code>src/server</code>. Import generated method stubs from <code>heliumts/server</code> in components. Pass <code>ctx.signal</code> into
                upstream requests and cancellable work so disconnects and client cancellation stop the producer.
            </p>
            <Heading level={2}>React component</Heading>
            <CodeBlock
                language="tsx"
                code={`import { useStreaming } from "heliumts/client";
import { streamReply } from "heliumts/server";

export default function Reply() {
    const { chunks, text, isStreaming, error, stats, start, cancel, reset } =
        useStreaming(streamReply, { timeoutMs: 120_000 });

    return (
        <section>
            <button onClick={() => void start({ prompt: "Helium" })}>
                {isStreaming ? "Restart" : "Start"}
            </button>
            <button onClick={cancel} disabled={!isStreaming}>Cancel</button>
            <button onClick={reset}>Reset</button>
            <output>{text}</output>
            {error && <p role="alert">{error}</p>}
            <p>{chunks.length} typed chunks received</p>
        </section>
    );
}`}
            />
            <p>
                Arguments and chunk types are inferred from the method. <code>chunks</code> contains every received value; <code>text</code> concatenates string chunks. For
                structured chunks, render <code>chunks</code> directly. <code>stats</code> contains the current request rate-limit information when available.
            </p>
            <Heading level={2}>Lifecycle and errors</Heading>
            <ul className="list-disc ml-6 space-y-2">
                <li>
                    <code>start(args)</code> aborts the previous run, clears its output, and starts a fresh request.
                </li>
                <li>
                    <code>cancel()</code> stops the active request and preserves received chunks without treating cancellation as an error.
                </li>
                <li>
                    <code>reset()</code> cancels and clears the output and error state.
                </li>
                <li>
                    A failure after partial output leaves those chunks visible and sets <code>error</code>. Streams are never replayed automatically.
                </li>
                <li>
                    <code>start</code> resolves after errors are exposed in state and <code>onError</code>; a button handler does not need a rejection handler.
                </li>
                <li>Unmounting cancels the hook's active request.</li>
            </ul>
            <Heading level={2}>Options</Heading>
            <CodeBlock
                language="typescript"
                code={`const stream = useStreaming(streamReply, {
    timeoutMs: 120_000,
    onChunk: (chunk) => console.log(chunk), // Inferred string here.
    onComplete: () => console.log("Reply complete"),
    onError: (message) => console.error(message),
});`}
            />
            <p>
                <code>timeoutMs</code> is a positive finite idle timeout, defaulting to 120,000 ms. It limits idle time while waiting for the first response and between received
                data, rather than setting a total duration for a healthy stream.
            </p>
            <Heading level={2}>SSR, authentication, and hosting</Heading>
            <p>
                The hook can be imported and rendered during SSR; it starts no browser request until you call <code>start</code>. Start in an event handler or client effect, never
                while rendering. Streaming methods use the same request middleware and auth context as ordinary RPC methods.
            </p>
            <p>
                Reverse proxies must flush incremental responses instead of buffering the whole reply. Configure their idle timeouts for the longest expected pause. A buffering
                proxy can make correct server yields appear all at once.
            </p>
            <p>
                <Link href="/docs/guides/openai" className="text-teal-600 underline">
                    See the provider-agnostic LLM recipe
                </Link>{" "}
                to forward a provider's async text stream without changing the component API.
            </p>
        </div>
    );
}
