"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function ProductionDeployment() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Production Deployment</Heading>
            <p>
                Helium's production build runs a Node.js HTTP server for typed RPC, streaming methods, custom handlers, and SSR. Generated static pages and browser assets are
                served by the same process. Deploy the server as an HTTP service; framework RPC needs no upgrade endpoint or connection-affinity setup.
            </p>
            <Heading level={2}>Build and start</Heading>
            <CodeBlock
                language="bash"
                code={`npm ci
npm run build
npm run start
# Or: node dist/server.js`}
            />
            <p>
                Use Node.js 20.19+ on Node 20, or 22.12+. The default port is 3000 and <code>PORT</code> can override it. Keep runtime dependencies available beside the build
                output.
            </p>
            <Heading level={2}>Configuration and secrets</Heading>
            <p>
                The build bundles <code>helium.config.ts</code>, <code>.js</code>, or <code>.mjs</code> into <code>dist/helium.config.js</code>. Both start commands load the build
                directory first, then the project root. Set <code>HELIUM_CONFIG_DIR</code> only when intentionally deploying configuration separately.
            </p>
            <p>
                Set a stable, private <code>HELIUM_SECRET</code> shared by all instances that handle your app's traffic. Keep database and provider credentials server-side. Only{" "}
                <code>HELIUM_PUBLIC_</code> variables are exposed through Helium's browser environment support.
            </p>
            <Heading level={2}>HTTP requests and streaming</Heading>
            <p>
                Allow HTTP POST RPC requests and preserve cookies and required headers. Keep request-size and per-IP rate limits enabled. Normal calls use MessagePack with
                batching; async-generator methods send incremental responses consumed by <code>useStreaming</code>.
            </p>
            <p>
                Disable response buffering for streaming requests and set proxy idle timeouts above the longest expected pause between chunks. Compression or caching middleware
                must not hold the whole streaming response before forwarding it. Client cancellation should reach the Node process so <code>ctx.signal</code> can stop upstream
                work.
            </p>
            <Heading level={2}>Trusted proxies</Heading>
            <CodeBlock
                language="typescript"
                code={`import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    trustProxyDepth: 1, // Only when there is exactly one trusted reverse proxy.
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

export default config;`}
            />
            <p>
                Use zero for direct connections. Trusted proxies must sanitize forwarded headers. In-memory limits are process-local; enforce shared quotas outside the process when
                scaling across instances.
            </p>
            <Heading level={2}>Static hosts, functions, and workers</Heading>
            <p>
                A static-only host can serve generated HTML and assets but cannot execute RPC, auth handlers, or SSR. HTTP-only RPC does not automatically turn the generated Node
                server into a provider-specific serverless function; that requires an appropriate runtime adapter. Check its streaming and request-duration support.
            </p>
            <p>
                Background workers start in every server instance unless disabled by your configuration. Deploy scheduled or singleton work deliberately so scaling the web service
                does not duplicate it.
            </p>
            <Heading level={2}>Release checks</Heading>
            <ul className="list-disc ml-6 space-y-2">
                <li>Rebuild client and server together when changing framework versions.</li>
                <li>Check RPC auth, cookies, rate limits, and SSR through the deployed proxy.</li>
                <li>Confirm incremental chunks reach the browser before the response completes and cancellation stops upstream work.</li>
            </ul>
            <p>
                <Link href="/docs/core-concepts/rpc/streaming" className="text-teal-600 underline">
                    Streaming guide
                </Link>{" "}
                ·{" "}
                <Link href="/docs/getting-started/migration-0-10" className="text-teal-600 underline">
                    0.10 migration
                </Link>
            </p>
        </div>
    );
}
