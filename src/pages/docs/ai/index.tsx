"use ssg";
import { useState } from "react";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";
import guide from "../../../content/agent-guide.json";

export default function AgentGuide() {
    const [copyStatus, setCopyStatus] = useState("");

    const copyMarkdown = async () => {
        try {
            await navigator.clipboard.writeText(guide.markdown);
            setCopyStatus("Markdown copied.");
        } catch {
            setCopyStatus("Could not copy. Select the Markdown below or open the raw file.");
        }
    };

    return (
        <article className="space-y-6">
            <header className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">For AI coding agents</p>
                <Heading level={1}>For AI Agents</Heading>
                <p className="text-gray-700">Use this Markdown reference to choose HeliumTS APIs, follow project conventions, and verify changes.</p>
            </header>

            <section className="space-y-4 rounded-xl border border-teal-200 bg-teal-50 p-5" aria-labelledby="agent-start">
                <h2 id="agent-start" className="text-xl font-semibold">
                    Start with one task
                </h2>
                <p>
                    Read the project’s AGENTS.md, then the{" "}
                    <a href="/ai/index.md" className="text-teal-700 underline">
                        short task index
                    </a>
                    . Open only the relevant guide and its missing prerequisites. The full reference is available below when broader context is needed.
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-teal-700 underline">
                    <a href="/ai/validation-page.md">Validated server method + page</a>
                    <a href="/ai/mutations.md">Mutation and invalidation</a>
                    <a href="/ai/streaming.md">Cancellation and streaming</a>
                    <a href="/ai/rendering.md">SSR and SSG</a>
                </div>
            </section>
            <Heading level={2}>Locate the contract before editing</Heading>
            <CodeBlock
                language="bash"
                code={`npx helium inspect --rpc getTasks --json
npx helium api useCall --from client --json
npx helium api --list --match define --from server
npx helium typegen
npx helium check`}
            />
            <p>
                Inspection and API commands target the 0.11.0 release. Normal app calls use generated RPC references and built-in hooks. Keep loading, error, refresh, server
                validation and authorization explicit; use HTTP handlers when an integration needs its own endpoint.
            </p>
            <Heading level={2}>Verify the behavior</Heading>
            <p>
                Render loading and error states, refresh related reads after a mutation, and keep validation and authorization on the server. Run the app’s verification script and
                the behavior tests required for your change.
            </p>
            <Heading level={2}>Full reference</Heading>
            <div className="flex flex-wrap items-center gap-4">
                <button type="button" onClick={copyMarkdown} className="button primary">
                    Copy Markdown
                </button>
                <a href="/agent-guide.md" className="text-teal-700 underline">
                    Open raw Markdown
                </a>
                <span role="status" className="text-sm text-gray-600">
                    {copyStatus}
                </span>
            </div>

            <details className="rounded-lg border border-gray-200 bg-white">
                <summary className="cursor-pointer p-4 font-semibold text-teal-700">Read the complete Markdown reference</summary>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-800">
                    <code className="block rounded-none bg-transparent p-0 text-inherit">{guide.markdown}</code>
                </pre>
            </details>
            <p className="text-sm text-gray-500">This page and /agent-guide.md contain the same tested reference from the framework repository.</p>
        </article>
    );
}
