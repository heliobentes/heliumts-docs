"use ssg";

import CodeBlock from "../../../../components/CodeBlock";

export default function HttpHandlerExamples() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">HTTP Handler Examples</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Stripe Webhook</h2>
                <p>Handle Stripe webhook events with signature verification:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhook = defineHTTPRequest("POST", "/webhooks/stripe", async (req, ctx) => {
    const body = await req.text();
    const signature = req.headers["stripe-signature"] as string;
    
    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        
        // Handle event
        switch (event.type) {
            case "payment_intent.succeeded":
                const paymentIntent = event.data.object;
                await handlePaymentSuccess(paymentIntent);
                break;
            case "customer.subscription.created":
                const subscription = event.data.object;
                await handleSubscriptionCreated(subscription);
                break;
            case "customer.subscription.deleted":
                await handleSubscriptionCanceled(event.data.object);
                break;
            case "invoice.payment_failed":
                await handlePaymentFailed(event.data.object);
                break;
        }
        
        return { received: true };
    } catch (err) {
        console.error("Webhook error:", err);
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
});`}
                    language="typescript"
                />

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="font-semibold text-yellow-800 mb-2">Important:</p>
                    <ul className="list-disc list-inside space-y-1 text-yellow-700">
                        <li>Always verify the webhook signature</li>
                        <li>
                            Use <code>req.text()</code> to get the raw body (required for signature verification)
                        </li>
                        <li>Return a 200 status quickly to avoid Stripe retries</li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">OpenAI Streaming</h2>
                <p>Stream OpenAI chat completions to the client:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletionStream = defineHTTPRequest("POST", "/api/chat/stream", async (req, ctx) => {
    const { message } = (await req.json()) as { message: string };
    
    if (!message) {
        return new Response(JSON.stringify({ error: "Message is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
            stream: true,
        });
        
        // Create a ReadableStream from the OpenAI stream
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            // Send as SSE format
                            const data = \`data: \${JSON.stringify({ content })}\\n\\n\`;
                            controller.enqueue(new TextEncoder().encode(data));
                        }
                    }
                    controller.enqueue(new TextEncoder().encode("data: [DONE]\\n\\n"));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });
        
        return new Response(readableStream, {
            status: 200,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("OpenAI API error:", error);
        
        return new Response(
            JSON.stringify({ error: "Failed to get completion" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
});`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Client-Side Consumption</h3>
                <CodeBlock
                    code={`// React component consuming the stream
async function streamChat(message: string) {
    const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const text = decoder.decode(value);
        const lines = text.split("\\n");
        
        for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
                const json = JSON.parse(line.slice(6));
                // Append content to UI
                console.log(json.content);
            }
        }
    }
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Authentication Handler (Better Auth)</h2>
                <p>Integrate with Better Auth or similar authentication libraries:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import { betterAuth } from "better-auth";

export const auth = betterAuth({
    database: {
        // Your database configuration
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
    },
});

// Catch-all handler for all auth routes
export const authHandler = defineHTTPRequest("ALL", "/api/auth/*", async (req, ctx) => {
    const webRequest = await req.toWebRequest();
    return auth.handler(webRequest);
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">GitHub Webhook</h2>
                <p>Handle GitHub webhook events:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import crypto from "crypto";

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET!;

function verifySignature(payload: string, signature: string): boolean {
    const hmac = crypto.createHmac("sha256", GITHUB_WEBHOOK_SECRET);
    const digest = "sha256=" + hmac.update(payload).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(signature));
}

export const githubWebhook = defineHTTPRequest("POST", "/webhooks/github", async (req, ctx) => {
    const body = await req.text();
    const signature = req.headers["x-hub-signature-256"] as string;
    const event = req.headers["x-github-event"] as string;
    
    // Verify signature
    if (!verifySignature(body, signature)) {
        return new Response(JSON.stringify({ error: "Invalid signature" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const payload = JSON.parse(body);
    
    switch (event) {
        case "push":
            console.log(\`Push to \${payload.repository.full_name}\`);
            // Trigger CI/CD, update deployment, etc.
            break;
        case "pull_request":
            console.log(\`PR \${payload.action}: \${payload.pull_request.title}\`);
            break;
        case "issues":
            console.log(\`Issue \${payload.action}: \${payload.issue.title}\`);
            break;
    }
    
    return { received: true };
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">File Upload</h2>
                <p>Handle file uploads with form data:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export const uploadFile = defineHTTPRequest("POST", "/api/upload", async (req, ctx) => {
    const webRequest = await req.toWebRequest();
    const formData = await webRequest.formData();
    
    const file = formData.get("file") as File | null;
    
    if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: "Invalid file type" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        return new Response(JSON.stringify({ error: "File too large" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    // Save file
    const uploadDir = join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });
    
    const filename = \`\${Date.now()}-\${file.name}\`;
    const filepath = join(uploadDir, filename);
    
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    
    return {
        success: true,
        filename,
        size: file.size,
        type: file.type,
    };
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">REST API CRUD</h2>
                <p>A complete REST API example:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";

interface Todo {
    id: string;
    title: string;
    completed: boolean;
}

// In-memory store (use a database in production)
const todos = new Map<string, Todo>();

// GET /api/todos - List all todos
export const listTodos = defineHTTPRequest("GET", "/api/todos", async (req, ctx) => {
    return { todos: Array.from(todos.values()) };
});

// GET /api/todos/:id - Get a single todo
export const getTodo = defineHTTPRequest("GET", "/api/todos/:id", async (req, ctx) => {
    const todo = todos.get(req.params.id);
    
    if (!todo) {
        return new Response(JSON.stringify({ error: "Todo not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return { todo };
});

// POST /api/todos - Create a new todo
export const createTodo = defineHTTPRequest("POST", "/api/todos", async (req, ctx) => {
    const { title } = await req.json();
    
    if (!title) {
        return new Response(JSON.stringify({ error: "Title is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const todo: Todo = {
        id: crypto.randomUUID(),
        title,
        completed: false,
    };
    
    todos.set(todo.id, todo);
    
    return new Response(JSON.stringify({ todo }), {
        status: 201,
        headers: { "Content-Type": "application/json" },
    });
});

// PATCH /api/todos/:id - Update a todo
export const updateTodo = defineHTTPRequest("PATCH", "/api/todos/:id", async (req, ctx) => {
    const todo = todos.get(req.params.id);
    
    if (!todo) {
        return new Response(JSON.stringify({ error: "Todo not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    const updates = await req.json();
    const updated = { ...todo, ...updates };
    todos.set(todo.id, updated);
    
    return { todo: updated };
});

// DELETE /api/todos/:id - Delete a todo
export const deleteTodo = defineHTTPRequest("DELETE", "/api/todos/:id", async (req, ctx) => {
    const existed = todos.delete(req.params.id);
    
    if (!existed) {
        return new Response(JSON.stringify({ error: "Todo not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    return new Response(null, { status: 204 });
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Server-Sent Events (SSE)</h2>
                <p>Real-time updates using SSE:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";

// Store connected clients
const clients = new Set<ReadableStreamDefaultController>();

// SSE endpoint - clients connect here
export const sseEndpoint = defineHTTPRequest("GET", "/api/events", async (req, ctx) => {
    const stream = new ReadableStream({
        start(controller) {
            clients.add(controller);
            
            // Send initial connection message
            controller.enqueue("data: connected\\n\\n");
            
            // Cleanup on disconnect
            req.signal?.addEventListener("abort", () => {
                clients.delete(controller);
            });
        },
        cancel() {
            // Client disconnected
        },
    });
    
    return new Response(stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
        },
    });
});

// Broadcast to all connected clients
function broadcast(event: string, data: unknown) {
    const message = \`event: \${event}\\ndata: \${JSON.stringify(data)}\\n\\n\`;
    
    for (const client of clients) {
        try {
            client.enqueue(message);
        } catch {
            clients.delete(client);
        }
    }
}

// Trigger events from other endpoints
export const createNotification = defineHTTPRequest("POST", "/api/notifications", async (req, ctx) => {
    const { message } = await req.json();
    
    broadcast("notification", { message, timestamp: Date.now() });
    
    return { sent: true };
});`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Rate Limiting</h2>
                <p>Simple rate limiting example:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";

// Simple in-memory rate limiter
const rateLimits = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const record = rateLimits.get(ip);
    
    if (!record || now > record.resetTime) {
        rateLimits.set(ip, { count: 1, resetTime: now + windowMs });
        return true;
    }
    
    if (record.count >= limit) {
        return false;
    }
    
    record.count++;
    return true;
}

export const rateLimitedEndpoint = defineHTTPRequest("POST", "/api/limited", async (req, ctx) => {
    const ip = req.headers["x-forwarded-for"] as string || "unknown";
    
    // 10 requests per minute
    if (!checkRateLimit(ip, 10, 60 * 1000)) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "Retry-After": "60",
            },
        });
    }
    
    return { success: true };
});`}
                    language="typescript"
                />
            </section>
        </div>
    );
}
