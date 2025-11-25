"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function HttpHandlers() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">HTTP Handlers</h1>
            <p>
                Create standard HTTP endpoints using <code>defineHandler</code>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Example</h2>
            <p>
                <code>src/server/api/hello.ts</code>
            </p>
            <CodeBlock
                code={`import { defineHTTPRequest } from "helium/server";

export const stripeWebhook = defineHTTPRequest("POST", "/webhooks/stripe", async (req, ctx) => {
    const body = await req.json();
    // Handle webhook
    return { received: true };
});`}
                language="typescript"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Better Auth Example</h2>
            <p>
                <code>src/server/auth.ts</code>
            </p>
            <CodeBlock
                code={`import { defineHTTPRequest } from "helium/server";

export const authHandler = defineHTTPRequest("ALL", "/auth/:provider", async (req, ctx) => {
    // Call the better-auth handler directly
    return auth.handler(await req.toWebRequest());
});`}
                language="typescript"
            />
            <p className="text-sm text-gray-500">
                *<code>toWebRequest()</code> converts Helium's <code>Request</code> to a standard web <code>Request</code> object.
            </p>
        </div>
    );
}
