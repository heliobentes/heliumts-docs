import type { HeliumConfig } from "helium/server";

const config: HeliumConfig = {
    trustProxyDepth: 1, // Trust 1 proxy level (e.g., Vercel)
    rpc: {
        transport: "websocket",
        autoHttpOnMobile: false,
        compression: {
            enabled: true,
            threshold: 1024,
        },
        security: {
            maxConnectionsPerIP: 10,
            maxMessagesPerWindow: 200,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },
    },
};

export default config;
