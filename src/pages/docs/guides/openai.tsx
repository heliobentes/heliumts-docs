"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function OpenAIStreaming() {
    return (
        <div className="space-y-6">
            <Heading level={1}>OpenAI Streaming</Heading>
            <p>
                Stream OpenAI responses through an async-generator <code>defineMethod</code> and render the text with <code>useStreaming</code>. The hook manages the HTTP request,
                incremental output, cancellation, and component state.
            </p>
            <p>
                <Link href="/streaming" className="text-teal-600 underline">
                    Try the deterministic streaming demo
                </Link>{" "}
                without an API key or provider account.
            </p>
            <Heading level={2}>Install and configure OpenAI</Heading>
            <CodeBlock language="bash" code={`npm install openai`} />
            <p>
                Set <code>OPENAI_API_KEY</code> in your server environment. Optionally set <code>OPENAI_MODEL</code> to a model available to your project; the example defaults to{" "}
                <code>gpt-6-astra</code>. Keep these variables server-only.
            </p>
            <CodeBlock
                language="bash"
                code={`# .env — server only
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-6-astra`}
            />
            <Heading level={2}>Define a streaming server method</Heading>
            <p>
                Keep the implementation in <code>src/server/assistant.ts</code>. Creating the SDK client inside the handler lets method discovery and builds run without an API key.
                <code> maxRetries: 0</code> disables SDK retries, so starting another generation is an explicit application action.
            </p>
            <CodeBlock
                language="typescript"
                code={`// src/server/assistant.ts
import { defineMethod, PublicError } from "heliumts/server";
import OpenAI from "openai";

export const streamAssistant = defineMethod(async function* (
    { prompt }: { prompt: string }, ctx
) {
    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new PublicError("Enter a prompt.");
    }

    const openai = new OpenAI({ maxRetries: 0 });
    const stream = await openai.responses.create(
        {
            model: process.env.OPENAI_MODEL || "gpt-6-astra",
            input: prompt.trim(),
            stream: true,
        },
        { signal: ctx.signal },
    );

    let completed = false;
    try {
        for await (const event of stream) {
            if (event.type === "response.output_text.delta" ||
                event.type === "response.refusal.delta") {
                yield event.delta;
            } else if (event.type === "response.completed") {
                completed = true;
            } else if (event.type === "error" ||
                event.type === "response.failed" ||
                event.type === "response.incomplete") {
                throw new PublicError("The response could not be completed. Try again.");
            }
        }
        if (!completed && !ctx.signal.aborted) {
            throw new PublicError("The response ended before completion. Try again.");
        }
    } finally {
        stream.controller.abort();
    }
});`}
            />
            <p>
                The generator yields text deltas, including refusal text, and reports failed, incomplete, or prematurely ended responses as safe public errors. It closes the
                upstream stream in <code>finally</code>. The same pattern works with any provider that exposes an async iterable.
            </p>
            <Heading level={2}>Render the stream with useStreaming</Heading>
            <p>
                Import the generated method stub from <code>heliumts/server</code> in the component. The OpenAI SDK and API key stay on the server. The hook infers the prompt
                argument and string chunk type from the method.
            </p>
            <CodeBlock
                language="tsx"
                code={`// src/pages/assistant.tsx
import { useState } from "react";
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
            <label htmlFor="assistant-prompt">Prompt</label>
            <input id="assistant-prompt" value={prompt}
                onChange={(event) => setPrompt(event.target.value)} />
            <button type="submit" disabled={!prompt.trim()}>
                {isStreaming ? "Restart" : "Send"}
            </button>
            <button type="button" disabled={!isStreaming} onClick={cancel}>
                Cancel
            </button>
            <button type="button" onClick={reset}>Reset</button>
            <output aria-live="polite" style={{ whiteSpace: "pre-wrap" }}>{text}</output>
            {error && <p role="alert">{error}</p>}
        </form>
    );
}`}
            />
            <Heading level={2}>Cancellation and partial failures</Heading>
            <p>
                Cancel, restart, and unmount abort the active request. Passing <code>ctx.signal</code> to the OpenAI SDK lets that cancellation stop upstream work. Received text
                remains visible after cancellation or failure; render the hook's <code>error</code> separately. Restart clears the old reply, and reset cancels and clears all
                output.
            </p>
            <p>
                Apply application authentication and quotas in method middleware before exposing a provider-backed method. Use a positive <code>timeoutMs</code> to change the idle
                limit, and configure hosting proxies to flush chunks as they arrive.
            </p>
            <p>
                See the{" "}
                <Link href="/docs/core-concepts/rpc/streaming" className="text-teal-600 underline">
                    useStreaming reference
                </Link>{" "}
                for fields, callbacks, and lifecycle behavior, and the{" "}
                <a href="https://developers.openai.com/api/docs/guides/streaming-responses" target="_blank" rel="noopener noreferrer" className="text-teal-600 underline">
                    official OpenAI streaming documentation
                </a>{" "}
                for provider event types.
            </p>
        </div>
    );
}
