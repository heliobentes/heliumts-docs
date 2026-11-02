"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function Migration() {
    const changes = [
        ["rpc.transport and rpc.autoHttpOnMobile", "Remove them. All RPC uses HTTP."],
        ["rpc.compression and rpc.maxWsPayload", "Remove them. HTTP compression is negotiated; use maxBodySize for incoming request bytes."],
        ["rpc.security.maxConnectionsPerIP", "Remove it. There are no framework RPC connections to count."],
        ["rpc.security.maxMessagesPerWindow", "Rename to maxRequestsPerWindow; limits now share a window per client IP."],
        ["preconnect, getRpcTransport, isAutoHttpOnMobileEnabled, RpcTransport", "Remove these imports and related connection logic."],
        ["callMethod transport option and result.transport", "Use callMethod(method, args), returning data and stats."],
    ];
    return (
        <div className="space-y-6">
            <Heading level={1}>Migrating to 0.10</Heading>
            <p>
                HeliumTS 0.10 uses HTTP-only RPC and adds typed streaming through <code>useStreaming</code>. This is a breaking upgrade from 0.9. Upgrade the framework, matching
                scaffolder, templates, and deployed app together.
            </p>
            <CodeBlock
                language="bash"
                code={`npm install heliumts@^0.10.1
npm create heliumts-app@0.10.1 my-app`}
            />
            <Heading level={2}>Remove old connection settings and helpers</Heading>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr>
                            <th scope="col" className="text-left p-2">
                                Removed API
                            </th>
                            <th scope="col" className="text-left p-2">
                                Migration
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {changes.map(([name, action]) => (
                            <tr key={name}>
                                <th scope="row" className="text-left p-2 font-mono">
                                    {name}
                                </th>
                                <td className="p-2">{action}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <CodeBlock
                language="typescript"
                code={`const config: HeliumConfig = {
    rpc: {
        maxBodySize: 1_048_576,
        maxBatchSize: 20,
        security: {
            maxRequestsPerWindow: 100,
            rateLimitWindowMs: 60_000,
            tokenValidityMs: 30_000,
        },
    },
};

const { data, stats } = await callMethod(getTasks, { status: "open" });`}
            />
            <p>
                The WebSocket RPC endpoint and client implementation are removed, not kept as compatibility no-ops. Rebuild and deploy the client and server together; refresh old
                open clients after the rollout. Vite's development HMR and application-owned external connections are separate from framework RPC.
            </p>
            <Heading level={2}>Keep the typed application APIs</Heading>
            <p>
                <code>defineMethod</code>, generated method stubs, <code>useFetch</code>, <code>useCall</code>, cache invalidation, <code>callMethod</code>, MessagePack, batching,
                middleware, SSR, and SSG remain. Hook arguments and normal method results keep their inferred types.
            </p>
            <Heading level={2}>Update request and retry assumptions</Heading>
            <p>
                <code>ctx.req</code> now describes the current HTTP request, with fresh cookies and headers for each call. Remove guards that assumed an upgrade request with{" "}
                <code>GET /rpc</code>; use method middleware and session checks. Rate limits and <code>stats</code> use the shared client-IP request window.
            </p>
            <p>
                Network failures and server errors are not automatically replayed. The client may safely refresh an expired request token after an authorization rejection before
                retrying. Streaming requests are never replayed. Preserve request security, <code>HELIUM_SECRET</code>, and proxy trust configuration.
            </p>
            <p>
                RPC request values may nest up to 128 containers (arrays and objects). Keep request payloads within this limit as well as the configured body-size and batch limits.
            </p>
            <Heading level={2}>Add streaming when needed</Heading>
            <p>
                Define an async generator using <code>defineMethod</code> and consume it with <code>useStreaming</code>. Pass the required <code>ctx.signal</code> to upstream work.
                Cancellation and partial failures preserve received output; a new start replaces it.
            </p>
            <p>
                <Link href="/docs/core-concepts/rpc/streaming" className="text-teal-600 underline">
                    Read the streaming guide
                </Link>
                . The old transport comparison page and its synthetic benchmark endpoints have been removed.
            </p>
        </div>
    );
}
