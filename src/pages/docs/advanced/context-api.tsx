"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function ContextAPI() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Context API</Heading>
            <p>
                Every RPC method and HTTP handler in Helium receives a <code>HeliumContext</code> object as the second parameter. This context provides access to request metadata,
                including the client IP, fresh request headers, and cancellation signal.
            </p>

            <Heading level={2} className="mt-8">
                Context Structure
            </Heading>
            <CodeBlock
                code={`interface HeliumContext {
    signal: AbortSignal; // Cancellation for this request and upstream work.
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

            <Heading level={2} className="mt-8">
                Usage in RPC Methods
            </Heading>
            <CodeBlock
                code={`import { defineMethod } from "heliumts/server";

export const getClientInfo = defineMethod(async (args, ctx) => {
    // Access client IP (extracted based on trustProxyDepth configuration)
    console.log("Client IP:", ctx.req.ip);

    // Access request headers
    const userAgent = ctx.req.headers["user-agent"];
    const acceptLanguage = ctx.req.headers["accept-language"];

    // Access the current HTTP RPC request details
    console.log("Request URL:", ctx.req.url);

    return {
        ip: ctx.req.ip,
        userAgent,
        language: acceptLanguage,
    };
});`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Usage in HTTP Handlers
            </Heading>
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

            <Heading level={2} className="mt-8">
                Request cancellation
            </Heading>
            <p>
                Pass <code>ctx.signal</code> to upstream fetches or provider adapters. The signal is aborted when the client cancels or disconnects. Each RPC call receives the
                current HTTP request metadata, including updated session cookies; do not cache authentication based on a previous connection.
            </p>

            <Heading level={2} className="mt-8">
                Custom Context Properties
            </Heading>
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
