"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function Configuration() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Configuration</Heading>
            <p>Helium's configuration file allows you to customize server settings including RPC encoding, compression, security, and proxy configuration.</p>

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
        </div>
    );
}
