"use ssg";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function SSR() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Server-Side Rendering (SSR)</Heading>
            <p>
                HeliumTS supports server-side rendering for pages that need fully rendered HTML for search engines and social crawlers. Unlike SSG, SSR renders per request and can
                return personalized content.
            </p>

            <Heading level={2} className="mt-8">
                Quick Start
            </Heading>
            <p>
                Add the <code>"use ssr"</code> directive at the top of any page file:
            </p>
            <CodeBlock
                code={`"use ssr";

export default function DashboardPage() {
    return <h1>Dashboard</h1>;
}`}
                language="tsx"
            />
            <p>
                On each request, HeliumTS renders on the server, injects HTML into <code>index.html</code>, and sends complete markup to the browser. React then hydrates
                client-side.
            </p>

            <Heading level={2} className="mt-8">
                Rendering Modes Comparison
            </Heading>
            <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 font-medium text-gray-900">Feature</th>
                            <th className="px-4 py-2 font-medium text-gray-900">SSR</th>
                            <th className="px-4 py-2 font-medium text-gray-900">SSG</th>
                            <th className="px-4 py-2 font-medium text-gray-900">SPA (default)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">HTML on first load</td>
                            <td className="px-4 py-2">Per-request</td>
                            <td className="px-4 py-2">Build-time</td>
                            <td className="px-4 py-2">Empty root shell</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Dynamic per-request data</td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">No</td>
                            <td className="px-4 py-2">Client-only</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Server-side props</td>
                            <td className="px-4 py-2">getServerSideProps</td>
                            <td className="px-4 py-2">No</td>
                            <td className="px-4 py-2">No</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Auth-protected pages</td>
                            <td className="px-4 py-2">Yes (skip guard on server)</td>
                            <td className="px-4 py-2">No</td>
                            <td className="px-4 py-2">Yes</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Build step required</td>
                            <td className="px-4 py-2">No</td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">No</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2 font-medium text-gray-900">Suitable for SEO</td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">Yes</td>
                            <td className="px-4 py-2">Requires crawler JS execution</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Heading level={2} className="mt-8">
                Server-Side Props
            </Heading>
            <p>
                To fetch data per request, export <code>getServerSideProps</code> from the same page file or from a sidecar <code>page.server.ts</code> file.
            </p>

            <Heading level={3} className="mt-6">
                Inline Export (Not Recommended)
            </Heading>
            <CodeBlock
                code={`"use ssr";

import type { GetServerSideProps } from "heliumts/server";

export const getServerSideProps: GetServerSideProps = async (req) => {
    const user = await db.users.findById(req.params.id);
    return { user };
};

export default function ProfilePage({ user }: { user: { name: string } }) {
    return <h1>Hello, {user.name}</h1>;
}`}
                language="tsx"
            />

            <Heading level={3} className="mt-6">
                Sidecar File (Recommended)
            </Heading>
            <p>Use a sidecar file to avoid mixing component and non-component exports in one module and keep Fast Refresh clean.</p>
            <CodeBlock
                code={`src/pages/
├── profile.tsx
└── profile.server.ts`}
                language="plaintext"
            />
            <CodeBlock
                code={`// src/pages/profile.server.ts
import type { GetServerSideProps } from "heliumts/server";

export const getServerSideProps: GetServerSideProps = async (req, ctx) => {
    const user = await db.users.findById(req.params.id as string);
    return { user };
};`}
                language="typescript"
            />
            <CodeBlock
                code={`// src/pages/profile.tsx
"use ssr";

export default function ProfilePage({ user }: { user: { name: string } }) {
    return <h1>Hello, {user.name}</h1>;
}`}
                language="tsx"
            />

            <Heading level={3} className="mt-6">
                GetServerSideProps Type
            </Heading>
            <CodeBlock code={`import type { GetServerSideProps } from "heliumts/server";`} language="typescript" />
            <p>
                The handler receives <code>req</code> and <code>ctx</code> and may return <code>null</code>, <code>undefined</code>, a plain props object, or a redirect result.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>req</code> includes method, path, headers, query, and dynamic route params.
                </li>
                <li>
                    <code>ctx</code> contains server context like client IP, normalized headers, and raw incoming request.
                </li>
            </ul>

            <Heading level={3} className="mt-6">
                Redirects from SSR
            </Heading>
            <CodeBlock
                code={`import type { GetServerSideProps } from "heliumts/server";

export const getServerSideProps: GetServerSideProps = async (req, ctx) => {
    const accountStatus = await billing.getStatus(ctx.req.headers.authorization);

    if (accountStatus === "overdue") {
        return {
            redirect: {
                destination: "/billing/overdue",
                statusCode: 307,
                replace: true,
            },
        };
    }

    return { accountStatus };
};`}
                language="typescript"
            />
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>destination</code>: required redirect target.
                </li>
                <li>
                    <code>statusCode</code>: optional HTTP redirect status.
                </li>
                <li>
                    <code>permanent</code>: shortcut for defaulting to 308 when no status is set.
                </li>
                <li>
                    <code>replace</code>: client history behavior (default true).
                </li>
            </ul>

            <Heading level={2} className="mt-8">
                Layouts with SSR
            </Heading>
            <p>
                Layouts work the same way as with regular pages. If a layout returns <code>null</code> during SSR due to auth guards, the server output will be empty.
            </p>
            <p>
                Use <code>isSSR()</code> to skip client-only guards on the server while still rendering the full provider tree.
            </p>
            <CodeBlock
                code={`import { isSSR, useRouter } from "heliumts/client";
import { useEffect } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const { isPending, data } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!data?.session && !isPending) {
            router.push("/login");
        }
    }, [data, isPending, router]);

    // Skip guard on SSR so providers still wrap the page.
    // Client-side hydration enforces redirect if needed.
    if (!isSSR()) {
        if (isPending) return null;
        if (!data?.session) return null;
    }

    return (
        <SidebarProvider>
            <main>{children}</main>
        </SidebarProvider>
    );
}`}
                language="tsx"
            />

            <Heading level={3} className="mt-6">
                isSSR Utility
            </Heading>
            <CodeBlock code={`import { isSSR } from "heliumts/client";`} language="typescript" />
            <p>
                Returns <code>true</code> on the server during SSR and <code>false</code> in the browser.
            </p>

            <Heading level={2} className="mt-8">
                How SSR Works
            </Heading>
            <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                    Directive scanning discovers pages with <code>"use ssr"</code>.
                </li>
                <li>The server intercepts HTML responses for SSR routes.</li>
                <li>
                    If present, <code>getServerSideProps</code> is executed and merged into props.
                </li>
                <li>
                    React renders layouts and page with <code>renderToString</code>.
                </li>
                <li>
                    Helium injects rendered markup into <code>&lt;div id="root"&gt;</code>.
                </li>
                <li>
                    Serialized props are injected as <code>window.__HELIUM_SSR_DATA__</code>.
                </li>
                <li>Browser hydration attaches listeners without a full re-render.</li>
            </ol>

            <Heading level={2} className="mt-8">
                Client-Side Navigation
            </Heading>
            <p>
                After the first load, Helium fetches props via <code>GET /__helium__/page-props?path=&lt;url&gt;</code> and re-renders client-side without full-page reloads.
            </p>

            <Heading level={2} className="mt-8">
                Sidecar File Conventions
            </Heading>
            <p>Helium automatically discovers these sidecar extensions for each SSR page:</p>
            <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-2 font-medium text-gray-900">Sidecar File</th>
                            <th className="px-4 py-2 font-medium text-gray-900">Example</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        <tr>
                            <td className="px-4 py-2">page.server.ts</td>
                            <td className="px-4 py-2">src/pages/profile.server.ts</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">page.server.tsx</td>
                            <td className="px-4 py-2">src/pages/profile.server.tsx</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">page.server.js</td>
                            <td className="px-4 py-2">src/pages/profile.server.js</td>
                        </tr>
                        <tr>
                            <td className="px-4 py-2">page.server.mts</td>
                            <td className="px-4 py-2">src/pages/profile.server.mts</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p>
                The sidecar must export <code>getServerSideProps</code>. Other exports are ignored.
            </p>

            <Heading level={2} className="mt-8">
                Browser-Only Dependencies
            </Heading>
            <p>
                If imported modules access <code>window</code>, <code>document</code>, or <code>navigator</code> during module evaluation, SSR fails and falls back to the SPA
                shell.
            </p>
            <p>Load browser-only libraries in a client-only code path:</p>
            <CodeBlock
                code={`"use ssr";

import { useEffect } from "react";

export default function MapPage() {
    useEffect(() => {
        import("leaflet").then(({ default: L }) => {
            L.map("map-container");
        });
    }, []);

    return <div id="map-container" />;
}`}
                language="tsx"
            />

            <Heading level={2} className="mt-8">
                Limitations
            </Heading>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    SSR supports dynamic routes; params are available in <code>req.params</code>.
                </li>
                <li>
                    Rendering is synchronous with <code>renderToString</code>; streaming SSR is not supported yet.
                </li>
                <li>
                    Providers rendered during SSR must be safe on the server and should move browser side effects into <code>useEffect</code>.
                </li>
            </ul>

            <Heading level={2} className="mt-8">
                See Also
            </Heading>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <a href="./ssg">Static Site Generation (SSG)</a>
                </li>
                <li>
                    <a href="./routing">Routing</a>
                </li>
                <li>
                    <a href="../advanced/context-api">Context API</a>
                </li>
            </ul>
        </div>
    );
}
