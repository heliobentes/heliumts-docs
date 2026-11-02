"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function Configuration() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Configuration</Heading>
            <p>
                Helium&apos;s configuration file lets you customize server behavior, HTTP RPC security, payload limits, and proxy handling from one place. Create
                <code> helium.config.ts</code>, <code>helium.config.js</code>, or <code>helium.config.mjs</code> in your project root.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-900">
                <strong>Built-in stale recovery:</strong> Helium includes client-side stale runtime recovery by default. Resume recovery and guarded reloads after chunk failures
                are always enabled when using <code>heliumts/client</code>.
            </div>

            <Heading level={2} className="mt-8">
                Basic Configuration
            </Heading>
            <CodeBlock
                code={`import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    // Your configuration here
};

export default config;`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                HTTP Security Headers
            </Heading>
            <p>Control Helium&apos;s default headers, override specific values, or remove headers when needed.</p>
            <CodeBlock
                code={`import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    security: {
        // Apply Helium defaults (X-Frame-Options, Referrer-Policy, etc.)
        defaultHeaders: true,

        // Final overrides applied last
        headerOverrides: {
            "X-Frame-Options": "SAMEORIGIN",
            "Permissions-Policy": null,
            "X-Custom-Security": "enabled",
        },

        contentSecurityPolicy: "default-src 'self'; frame-ancestors 'self'",
        hsts: true,
        corsOrigins: ["https://app.example.com"],
    },
};

export default config;`}
                language="typescript"
            />
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>security.defaultHeaders</code>: defaults to <code>true</code>. Set <code>false</code> for full manual control.
                </li>
                <li>
                    <code>security.headerOverrides</code>: use strings to set/override headers and <code>null</code> to remove a header.
                </li>
                <li>
                    <code>security.contentSecurityPolicy</code>, <code>security.hsts</code>, and <code>security.corsOrigins</code> remain supported.
                </li>
            </ul>

            <Heading level={2} className="mt-8">
                RPC Configuration
            </Heading>

            <p>
                All RPC uses HTTP. Calls queued together are split into concurrent batches of at most <code>rpc.maxBatchSize</code> calls (default 20). Per-IP request windows apply
                to ordinary and streaming RPC requests. HTTP response compression is negotiated automatically; there is no transport or socket-compression configuration.
            </p>

            <Heading level={3} className="mt-6">
                Security and Rate Limiting
            </Heading>
            <CodeBlock
                code={`const config: HeliumConfig = {
    rpc: {
        security: {
            maxRequestsPerWindow: 100,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },
    },
};`}
                language="typescript"
            />
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>maxRequestsPerWindow</code> defaults to <code>100</code>. Set <code>0</code> to disable.
                </li>
                <li>
                    <code>rateLimitWindowMs</code> defaults to <code>60000</code>.
                </li>
                <li>
                    <code>tokenValidityMs</code> defaults to <code>30000</code>.
                </li>
            </ul>

            <Heading level={3} className="mt-6">
                Payload Limits
            </Heading>
            <CodeBlock
                code={`const config: HeliumConfig = {
    rpc: {
        maxBodySize: 10_485_760,
        maxBatchSize: 50,
    },
};`}
                language="typescript"
            />
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>maxBodySize</code> default: <code>1048576</code> (1 MB).
                </li>
                <li>
                    <code>maxBatchSize</code> default: <code>20</code>.
                </li>
            </ul>

            <p>RPC request values may nest up to 128 containers (arrays and objects). This decoding limit applies in addition to the body-size and batch limits.</p>

            <Heading level={2} className="mt-8">
                Proxy Configuration
            </Heading>
            <p>
                Set <code>trustProxyDepth</code> to match your proxy chain so IP-based limits work correctly.
            </p>
            <CodeBlock
                code={`const config: HeliumConfig = {
    trustProxyDepth: 1,
};`}
                language="typescript"
            />
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>0</code> (default): trust no proxy headers.
                </li>
                <li>
                    <code>1</code>: recommended for most managed platforms.
                </li>
                <li>
                    <code>2+</code>: for multi-proxy setups.
                </li>
            </ul>
            <p className="font-semibold">Security note: setting this value too high can allow spoofed client IPs.</p>

            <Heading level={2} className="mt-8">
                Complete Example
            </Heading>
            <CodeBlock
                code={`import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    trustProxyDepth: 1,
    rpc: {
        security: {
            maxRequestsPerWindow: 100,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },
        maxBodySize: 10_485_760,
        maxBatchSize: 50,
    },
};

export default config;`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Environment-Specific Configuration
            </Heading>
            <CodeBlock
                code={`import type { HeliumConfig } from "heliumts/server";

const isDevelopment = process.env.NODE_ENV === "development";
const isProduction = process.env.NODE_ENV === "production";

const config: HeliumConfig = {
    trustProxyDepth: isProduction ? 1 : 0,
    rpc: {
        security: {
            maxRequestsPerWindow: isDevelopment ? 1000 : 100,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },
    },
};

export default config;`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Production Deployment Notes
            </Heading>
            <p>
                <code>helium build</code> selects <code>helium.config.js</code>, <code>helium.config.mjs</code>, then <code>helium.config.ts</code> and bundles the selected file to{" "}
                <code>dist/helium.config.js</code>. Local imports are bundled with it; package dependencies remain external.
            </p>
            <p>
                Both <code>helium start</code> and <code>node dist/server.js</code> check the build directory first, then the project root. Set <code>HELIUM_CONFIG_DIR</code>
                to override the config directory. A config build or evaluation error fails the build or startup instead of silently replacing your settings with defaults.
            </p>

            <Heading level={2} className="mt-8">
                Configuration Loading Order
            </Heading>
            <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                    Checks the <code>HELIUM_CONFIG_DIR</code> environment variable.
                </li>
                <li>
                    Resolves config files in this order: <code>helium.config.js</code>, <code>helium.config.mjs</code>, then <code>helium.config.ts</code>. TypeScript configs and
                    their local imports are bundled before loading, including on Node.js 20.
                </li>
            </ol>
            <p>
                Export a configuration object as the default export. Default settings apply only when no config file exists. Config caches are scoped to the project and config
                directory.
            </p>
        </div>
    );
}
