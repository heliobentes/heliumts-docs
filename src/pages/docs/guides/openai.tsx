"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function LLMStreaming() {
    return (
        <div className="space-y-6">
            <Heading level={1}>LLM Streaming</Heading>
            <p>
                Keep provider calls and credentials on the server. Forward your provider's async text stream from a typed method and consume it with <code>useStreaming</code>.
                Helium requires no LLM SDK and the component needs no custom fetch or reader.
            </p>
            <p>
                <Link href="/streaming" className="text-teal-600 underline">
                    Try the deterministic demo first
                </Link>
                . It needs no API key or provider account.
            </p>
            <Heading level={2}>Provider-agnostic server adapter</Heading>
            <p>
                The following recipe assumes an app-defined <code>provider.generate</code> adapter returning <code>{`{ textStream: AsyncIterable<string> }`}</code>. Map its{" "}
                <code>signal</code> to your provider SDK's cancellation option and configure credentials in server environment variables. The adapter is application code, not a
                Helium dependency.
            </p>
            <CodeBlock
                language="typescript"
                code={`// src/server/assistant.ts
import { defineMethod, PublicError } from "heliumts/server";
import { provider } from "../lib/provider"; // Your server-side adapter.

export const streamAssistant = defineMethod(async function* (
    { prompt }: { prompt: string }, ctx
) {
    if (!prompt.trim()) throw new PublicError("Enter a prompt.");
    const result = await provider.generate({ prompt, signal: ctx.signal });
    for await (const text of result.textStream) {
        if (ctx.signal.aborted) return;
        yield text;
    }
});`}
            />
            <Heading level={2}>React component</Heading>
            <CodeBlock
                language="tsx"
                code={`import { useState } from "react";
import { useStreaming } from "heliumts/client";
import { streamAssistant } from "heliumts/server";

export default function Assistant() {
    const [prompt, setPrompt] = useState("");
    const { text, error, isStreaming, start, cancel, reset } =
        useStreaming(streamAssistant);

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            void start({ prompt });
        }}>
            <label>Prompt <input value={prompt}
                onChange={(event) => setPrompt(event.target.value)} /></label>
            <button disabled={!prompt.trim()}>{isStreaming ? "Restart" : "Send"}</button>
            <button type="button" onClick={cancel}>Cancel</button>
            <button type="button" onClick={reset}>Reset</button>
            <output>{text}</output>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}`}
            />
            <Heading level={2}>Cancellation and partial failures</Heading>
            <p>
                Cancel, restart, and unmount abort the active HTTP stream. Passing <code>ctx.signal</code> upstream lets the provider stop its own work. Already received text
                remains visible on cancellation or failure; show the hook's string <code>error</code> separately. A stream is never automatically replayed, so a failed generation
                does not silently start and charge for another request.
            </p>
            <p>
                Apply your auth, input validation, quotas, and provider-specific error handling in method middleware and the server adapter. Use a positive <code>timeoutMs</code>{" "}
                when you need a different idle limit, and ensure hosting proxies flush chunks instead of buffering the complete reply.
            </p>
            <p>
                <Link href="/docs/core-concepts/rpc/streaming" className="text-teal-600 underline">
                    See all useStreaming fields, callbacks, and lifecycle behavior.
                </Link>
            </p>
        </div>
    );
}
