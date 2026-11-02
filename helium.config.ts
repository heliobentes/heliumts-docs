import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    trustProxyDepth: 1, // The deployed site has one trusted reverse proxy.
    rpc: {
        maxBodySize: 1_048_576,
        maxBatchSize: 20,
        security: {
            maxRequestsPerWindow: 200,
            rateLimitWindowMs: 60000,
            tokenValidityMs: 30000,
        },
    },
};

export default config;
