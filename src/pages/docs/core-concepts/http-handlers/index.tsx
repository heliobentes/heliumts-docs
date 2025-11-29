"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../../components/CodeBlock";

export default function HttpHandlersOverview() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">HTTP Handlers</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
                <p>
                    HeliumTS provides <code>defineHTTPRequest</code> for creating custom HTTP endpoints. This is useful for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Webhooks (Stripe, GitHub, etc.)</li>
                    <li>REST APIs</li>
                    <li>Third-party integrations (Auth providers)</li>
                    <li>File uploads/downloads</li>
                    <li>Server-sent events</li>
                </ul>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="font-semibold text-teal-800 mb-2">In this section:</p>
                    <ul className="list-disc list-inside space-y-1 text-teal-700">
                        <li>
                            <Link href="/docs/core-concepts/http-handlers/examples" className="underline hover:text-teal-900">
                                Examples
                            </Link>{" "}
                            - Stripe webhooks, OpenAI streaming, auth handlers
                        </li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Basic Usage</h2>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";

export const myEndpoint = defineHTTPRequest("GET", "/api/hello", async (req, ctx) => {
    return { message: "Hello World" };
});`}
                    language="typescript"
                />
                <p className="text-sm text-gray-600">
                    Supported methods: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>DELETE</code>, <code>ALL</code>
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Dynamic Routes</h2>
                <p>
                    Use <code>:param</code> syntax for dynamic path segments:
                </p>
                <CodeBlock
                    code={`export const getUser = defineHTTPRequest("GET", "/api/users/:id", async (req, ctx) => {
    const userId = req.params.id;
    const user = await db.users.findById(userId);
    return { user };
});

// Multiple parameters
export const getProduct = defineHTTPRequest("GET", "/api/products/:category/:id", async (req, ctx) => {
    const { category, id } = req.params;
    return { category, id };
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Catch-All Routes</h2>
                <p>
                    Use <code>*</code> to match any remaining path segments (useful for auth providers):
                </p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import { auth } from "./auth"; // Better Auth or similar

// Matches /api/auth/signin, /api/auth/signout, /api/auth/callback/google, etc.
export const authHandler = defineHTTPRequest("ALL", "/api/auth/*", async (req, ctx) => {
    const webRequest = await req.toWebRequest();
    return auth.handler(webRequest);
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Request Object</h2>
                <CodeBlock
                    code={`export const myHandler = defineHTTPRequest("POST", "/api/data", async (req, ctx) => {
    // HTTP method
    console.log(req.method); // "POST"
    
    // Headers
    const contentType = req.headers["content-type"];
    
    // Query parameters
    const search = req.query.q;
    
    // Route parameters
    const id = req.params.id;
    
    // Cookies
    const sessionId = req.cookies.sessionId;
    
    // Parse JSON body
    const body = await req.json();
    
    // Parse text body
    const text = await req.text();
    
    return { success: true };
});`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Request Properties</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>req.method</code> - HTTP method (GET, POST, etc.)
                    </li>
                    <li>
                        <code>req.headers</code> - Request headers object
                    </li>
                    <li>
                        <code>req.query</code> - Query string parameters
                    </li>
                    <li>
                        <code>req.params</code> - Route parameters
                    </li>
                    <li>
                        <code>req.cookies</code> - Parsed cookies
                    </li>
                    <li>
                        <code>req.json()</code> - Parse JSON body
                    </li>
                    <li>
                        <code>req.text()</code> - Get raw body as text
                    </li>
                    <li>
                        <code>req.toWebRequest()</code> - Convert to Web API Request
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Response Headers & Status Codes</h2>
                <p>
                    Return a standard Web API <code>Response</code> object for full control:
                </p>
                <CodeBlock
                    code={`export const customHeaders = defineHTTPRequest("GET", "/api/data", async (req, ctx) => {
    const data = { message: "Hello World" };
    
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "max-age=3600",
            "X-Custom-Header": "my-value",
        },
    });
});

// Error response
export const errorExample = defineHTTPRequest("POST", "/api/resource", async (req, ctx) => {
    const body = await req.json();
    
    if (!body.email) {
        return new Response(JSON.stringify({ error: "Email required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return { success: true };
});`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Common Status Codes</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>200</code> - OK
                    </li>
                    <li>
                        <code>201</code> - Created
                    </li>
                    <li>
                        <code>400</code> - Bad Request
                    </li>
                    <li>
                        <code>401</code> - Unauthorized
                    </li>
                    <li>
                        <code>403</code> - Forbidden
                    </li>
                    <li>
                        <code>404</code> - Not Found
                    </li>
                    <li>
                        <code>500</code> - Internal Server Error
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Streaming Responses</h2>
                <CodeBlock
                    code={`export const streamData = defineHTTPRequest("GET", "/api/stream", async (req, ctx) => {
    const stream = new ReadableStream({
        async start(controller) {
            for (let i = 0; i < 10; i++) {
                controller.enqueue(\`data: \${i}\\n\\n\`);
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            controller.close();
        },
    });
    
    return new Response(stream, {
        status: 200,
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Converting to Web Request</h2>
                <p>
                    Use <code>toWebRequest()</code> to convert Helium's request to a standard Web API <code>Request</code> for third-party libraries:
                </p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import { auth } from "./auth"; // Better Auth or similar

export const authHandler = defineHTTPRequest("ALL", "/auth/*", async (req, ctx) => {
    // Convert to Web Request for third-party libraries
    const webRequest = await req.toWebRequest();
    
    // Pass to third-party handler
    return auth.handler(webRequest);
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Best Practices</h2>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        Use <code>Response</code> objects when you need custom headers or status codes
                    </li>
                    <li>Set appropriate HTTP status codes for different scenarios</li>
                    <li>Always validate request data before processing</li>
                    <li>Verify webhook signatures for security</li>
                    <li>Add cache headers for cacheable responses</li>
                    <li>Handle errors gracefully with try-catch blocks</li>
                </ul>
            </section>
        </div>
    );
}
