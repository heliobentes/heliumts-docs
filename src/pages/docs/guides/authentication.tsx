"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function AuthenticationGuide() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Authentication</h1>

            <p>
                This guide shows how to integrate authentication with HeliumJS using Better Auth. The same pattern works for other auth libraries like Auth.js, Clerk, or any
                provider that uses standard Web API Request/Response objects.
            </p>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Better Auth Example</h2>
                <p>Better Auth is a modern authentication library with excellent TypeScript support.</p>

                <h3 className="text-lg font-semibold text-gray-900 mt-4">Installation</h3>
                <CodeBlock code={`npm install better-auth`} language="bash" />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Setup Auth Configuration</h2>
                <p>Create your auth configuration file:</p>
                <p className="text-sm text-gray-600">
                    <code>src/libs/better-auth/auth.ts</code>
                </p>
                <CodeBlock
                    code={`import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client,
    }),
    experimental: {
        joins: true,
    },
    // Disable the cookie cache so server always validates session state against
    // the database. This prevents the server from returning a stale session
    // when the DB session was manually deleted or revoked elsewhere.
    session: {
        cookieCache: {
            enabled: false,
            strategy: "jwt",
            maxAge: 300,
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            disableSignUp: true, // Disable this if you want to allow new users to sign up
        },
    },
});`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Create Auth Handler</h2>
                <p>Use a catch-all route to handle all auth endpoints:</p>
                <p className="text-sm text-gray-600">
                    <code>src/server/auth.ts</code>
                </p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "helium/server";
import { auth } from "../libs/better-auth/auth";

// This handles all auth routes: /api/auth/signin, /api/auth/signout, 
// /api/auth/callback/google, etc.
export const betterAuthHttp = defineHTTPRequest("ALL", "/api/auth/*", async (req, _ctx) => {
    // Call the better-auth handler directly
    return auth.handler(await req.toWebRequest());
});`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Protecting RPC Endpoints</h2>
                <p>Add authentication check in your global middleware:</p>
                <p className="text-sm text-gray-600">
                    <code>src/server/_middleware.ts</code>
                </p>
                <CodeBlock
                    code={`import { auth } from "../libs/better-auth/auth";

export async function middleware(ctx: HeliumContext) {
    const session = await auth.api.getSession({
        headers: ctx.req.headers,
    });
    
    if (!session) {
        throw new Error("Unauthorized");
    }
    
    // Add session to context for use in RPC handlers
    return {
        ...ctx,
        session,
        user: session.user,
    };
}`}
                    language="typescript"
                />

                <p className="mt-4">Now your RPC functions automatically have access to the authenticated user:</p>
                <CodeBlock
                    code={`import { defineRPC } from "helium/server";

export const getProfile = defineRPC(async (ctx) => {
    // ctx.user is available thanks to middleware
    return {
        id: ctx.user.id,
        name: ctx.user.name,
        email: ctx.user.email,
    };
});

export const updateProfile = defineRPC(async (data: { name: string }, ctx) => {
    // Update user profile
    await db.users.update(ctx.user.id, { name: data.name });
    
    return { success: true };
});`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Client-Side Usage</h2>
                <p>Create a client instance with React hooks:</p>
                <p className="text-sm text-gray-600">
                    <code>src/libs/better-auth/auth-client.ts</code>
                </p>
                <CodeBlock
                    code={`import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, getSession } = createAuthClient();`}
                    language="typescript"
                />

                <p className="mt-4">Use in your React components:</p>
                <CodeBlock
                    code={`import { signIn, signOut, useSession } from "../libs/better-auth/auth-client";

export default function LoginPage() {
    const {
        data: session,
        isPending, // loading state
        refetch,
    } = useSession();
    
    const handleGoogleLogin = async () => {
        await signIn.social({
            provider: "google",
            callbackURL: "/dashboard",
        });
    };
    
    if (isPending) {
        return <div>Loading...</div>;
    }
    
    if (session) {
        return (
            <div>
                <p>Welcome, {session.user.name}!</p>
                <button onClick={() => signOut()}>Sign Out</button>
            </div>
        );
    }
    
    return (
        <div>
            <button onClick={handleGoogleLogin}>Sign In with Google</button>
        </div>
    );
}`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Using Other Auth Libraries</h2>
                <p>The same pattern works for any auth library that uses standard Web API Request/Response:</p>

                <h3 className="text-lg font-semibold text-gray-900 mt-4">Auth.js (NextAuth)</h3>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "helium/server";
import { handlers } from "./auth"; // Your Auth.js config

export const authHandler = defineHTTPRequest("ALL", "/api/auth/*", async (req, ctx) => {
    const webRequest = await req.toWebRequest();
    return handlers(webRequest);
});`}
                    language="typescript"
                />

                <h3 className="text-lg font-semibold text-gray-900 mt-4">Clerk</h3>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "helium/server";
import { clerkClient } from "@clerk/clerk-sdk-node";

export const clerkWebhook = defineHTTPRequest("POST", "/webhooks/clerk", async (req, ctx) => {
    const webRequest = await req.toWebRequest();
    // Handle Clerk webhooks
    return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
});`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Best Practices</h2>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Always use HTTPS in production</li>
                    <li>Store sensitive credentials in environment variables</li>
                    <li>Implement rate limiting on auth endpoints</li>
                    <li>Use secure session storage (httpOnly cookies)</li>
                    <li>Validate and sanitize all user input</li>
                    <li>Implement proper password requirements</li>
                    <li>Add CSRF protection for sensitive actions</li>
                    <li>Log authentication events for security monitoring</li>
                    <li>Use middleware consistently across protected endpoints</li>
                </ul>
            </div>
        </div>
    );
}
