"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function ContextAPI() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Context API</h1>
            <p>
                Every RPC method and HTTP handler in Helium receives a <code>HeliumContext</code> object as the second parameter. This context provides access to request metadata,
                including the client IP, headers, and other connection information.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Context Structure</h2>
            <CodeBlock
                code={`interface HeliumContext {
    req: {
        ip: string; // Client IP (respects trustProxyDepth config)
        headers: http.IncomingHttpHeaders; // Request headers
        url?: string; // Request URL
        method?: string; // HTTP method
        raw: http.IncomingMessage; // Raw Node.js request object
    };
    [key: string]: unknown; // Custom properties from middleware
}`}
                language="typescript"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Usage in RPC Methods</h2>
            <CodeBlock
                code={`import { defineMethod } from "heliumts/server";

export const getClientInfo = defineMethod(async (args, ctx) => {
    // Access client IP (extracted based on trustProxyDepth configuration)
    console.log("Client IP:", ctx.req.ip);

    // Access request headers
    const userAgent = ctx.req.headers["user-agent"];
    const acceptLanguage = ctx.req.headers["accept-language"];

    // Access WebSocket upgrade request details
    console.log("Connection URL:", ctx.req.url);

    return {
        ip: ctx.req.ip,
        userAgent,
        language: acceptLanguage,
    };
});`}
                language="typescript"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Usage in HTTP Handlers</h2>
            <CodeBlock
                code={`import { defineHTTPRequest } from "heliumts/server";

export const apiEndpoint = defineHTTPRequest("POST", "/api/data", async (req, ctx) => {
    // Access client IP
    console.log("Client IP:", ctx.req.ip);

    // Access request headers
    const authorization = ctx.req.headers["authorization"];

    // Check if request is from a specific IP range
    if (ctx.req.ip.startsWith("10.0.")) {
        return { error: "Internal network not allowed" };
    }

    return { success: true };
});`}
                language="typescript"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Custom Context Properties</h2>
            <p>Middleware can add custom properties to the context:</p>
            <CodeBlock
                code={`import { middleware } from "heliumts/server";

export const authMiddleware = middleware(async (context, next) => {
    // Add custom property
    context.ctx.user = await getUserFromToken(context.ctx.req.headers["authorization"]);

    await next();
});`}
                language="typescript"
            />
        </div>
    );
}
