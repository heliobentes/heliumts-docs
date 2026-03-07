"use ssg";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function SSR() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Server-Side Rendering (SSR)</Heading>
            <p>
                HeliumTS supports server-side rendering for pages that need fully rendered HTML on first load. Use SSR when content depends on per-request data, authenticated state,
                or SEO-sensitive markup that cannot wait for client hydration.
            </p>

            <section className="space-y-4">
                <Heading level={2}>Quick Start</Heading>
                <p>Add the <code>"use ssr";</code> directive at the top of a page file:</p>
                <CodeBlock
                    code={`"use ssr";

export default function DashboardPage() {
    return <h1>Dashboard</h1>;
}`}
                    language="tsx"
                />
                <p>On every request, HeliumTS renders the page on the server, injects the markup into the HTML response, then hydrates it in the browser.</p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>When to Use SSR</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Authenticated dashboards that depend on request-time session state.</li>
                    <li>User-specific or geo-specific pages.</li>
                    <li>SEO-critical pages where the HTML must include real content on first response.</li>
                    <li>Pages that need server-side props from a database or API before render.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Server-Side Props</Heading>
                <p>Export <code>getServerSideProps</code> from a sidecar file to fetch data per request without mixing server and client concerns in one module.</p>
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
                <p>
                    Using a sidecar file keeps Fast Refresh clean and avoids the common React warning caused by exporting both components and server-only helpers from the same page module.
                </p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Layouts with SSR</Heading>
                <p>Layouts wrap SSR pages the same way they wrap SPA and SSG pages, but client-only auth guards need special handling to avoid rendering empty HTML on the server.</p>
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

    if (!isSSR()) {
        if (isPending) return null;
        if (!data?.session) return null;
    }

    return <main>{children}</main>;
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>SSR vs SSG vs SPA</Heading>
                <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-2 font-medium text-gray-900">Mode</th>
                                <th className="px-4 py-2 font-medium text-gray-900">Best For</th>
                                <th className="px-4 py-2 font-medium text-gray-900">HTML Timing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            <tr>
                                <td className="px-4 py-2 font-medium text-gray-900">SSR</td>
                                <td className="px-4 py-2">Dynamic, request-aware pages</td>
                                <td className="px-4 py-2">Rendered per request</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-medium text-gray-900">SSG</td>
                                <td className="px-4 py-2">Static content and marketing pages</td>
                                <td className="px-4 py-2">Generated at build time</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 font-medium text-gray-900">SPA</td>
                                <td className="px-4 py-2">Client-only flows where HTML is not required upfront</td>
                                <td className="px-4 py-2">Rendered after hydration</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Limitations</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Browser-only libraries that touch <code>window</code> or <code>document</code> during module evaluation must be loaded lazily.</li>
                    <li>Providers used during SSR need to be safe to execute on the server.</li>
                    <li>HeliumTS currently uses synchronous render-to-string, not streaming SSR.</li>
                </ul>
            </section>
        </div>
    );
}