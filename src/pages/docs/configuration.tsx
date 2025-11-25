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
        encoding: "msgpack",  // or "json"
        compression: {
            enabled: true,
            threshold: 1024,
        },
        security: {
            maxConnectionsPerIP: 10,
            maxMessagesPerWindow: 100,
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
