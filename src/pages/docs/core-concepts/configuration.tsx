"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function Configuration() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Configuration</Heading>
            <p>Helium's configuration file lets you tune transport, payload limits, compression, security, and proxy handling from one place.</p>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-900">
                <strong>Built-in stale recovery:</strong> HeliumTS includes client-side stale runtime recovery by default. Background resume recovery and guarded reloads after
                stale chunks do not require extra configuration.
            </div>

            <p>
                <code>helium.config.ts</code>
            </p>
            <CodeBlock
                code={`import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    // Trust 1 proxy level (e.g., Vercel)
    trustProxyDepth: 1,

    rpc: {
        // Transport mode: "websocket" | "http" | "auto"
        transport: "websocket", // default

        // Auto-switch to HTTP on mobile/cellular networks
        autoHttpOnMobile: false, // default

        // Compression settings
        compression: {
            enabled: true,
            threshold: 1024,
        },

        // Security settings
        security: {
            maxConnectionsPerIP: 10,
            maxMessagesPerWindow: 100,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },

        // Payload limits
        maxWsPayload: 10_485_760, // 10 MB
        maxBodySize: 10_485_760, // 10 MB
        maxBatchSize: 50,
    },
};

export default config;`}
                language="typescript"
            />

            <section className="space-y-4">
                <Heading level={2}>Transport Modes</Heading>
                <p>
                    RPC can run over WebSocket, HTTP, or automatic transport selection. WebSocket is still the default, but <code>transport: "auto"</code> is useful when you want
                    mobile and slower networks to fall back to HTTP.
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>websocket</code>: best default for persistent, low-latency app sessions
                    </li>
                    <li>
                        <code>http</code>: useful when you want stateless request/response transport
                    </li>
                    <li>
                        <code>auto</code>: lets HeliumTS decide based on network and device conditions
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Proxy and Rate-Limit Safety</Heading>
                <p>
                    Set <code>trustProxyDepth</code> correctly in production so client IP detection, rate limiting, and connection limits behave as expected behind proxies or load
                    balancers.
                </p>
            </section>
        </div>
    );
}
