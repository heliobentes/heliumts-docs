"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function Configuration() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Configuration</h1>
            <p>Helium's configuration file allows you to customize server settings including RPC encoding, compression, security, and proxy configuration.</p>

            <p>
                <code>helium.config.ts</code>
            </p>
            <CodeBlock
                code={`import type { HeliumConfig } from "helium/server";

const config: HeliumConfig = {
    trustProxyDepth: 1,  // Trust 1 proxy level (e.g., Vercel)
    rpc: {
        // Transport mode: "websocket" | "http" | "auto"
        transport: "websocket",  // default
        
        // Auto-switch to HTTP on mobile/cellular networks
        // Mobile carriers prioritize HTTP traffic over WebSocket
        autoHttpOnMobile: false, // default
        
        // Message encoding: "msgpack" | "json" (default: "msgpack")
        encoding: "msgpack",  // or "json"

        // Compression settings
        compression: {
            enabled: true,
            threshold: 1024,
        },
        // Security settings
        security: {
            maxConnectionsPerIP: 10,
            maxMessagesPerWindow: 200,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },
    },
};

export default config;`}
                language="typescript"
            />
        </div>
    );
}
