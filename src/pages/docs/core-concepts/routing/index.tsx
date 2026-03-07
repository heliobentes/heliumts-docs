"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RoutingOverview() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Routing</Heading>

            <section className="space-y-4">
                <Heading level={2}>Overview</Heading>
                <p>
                    HeliumTS uses file-based routing similar to Next.js Pages Router. Pages are automatically mapped to routes based on their file path in the{" "}
                    <code>src/pages</code> directory. The framework provides a powerful routing system with support for dynamic routes, catch-all routes, layouts, and route groups.
                </p>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="font-semibold text-teal-800 mb-2">In this section:</p>
                    <ul className="list-disc list-inside space-y-1 text-teal-700">
                        <li>
                            <Link href="/docs/core-concepts/routing/navigation" className="underline hover:text-teal-900">
                                Navigation
                            </Link>{" "}
                            - Link component and programmatic navigation
                        </li>
                        <li>
                            <Link href="/docs/core-concepts/routing/use-router" className="underline hover:text-teal-900">
                                useRouter Hook
                            </Link>{" "}
                            - Access routing info and methods
                        </li>
                        <li>
                            <Link href="/docs/core-concepts/routing/layouts" className="underline hover:text-teal-900">
                                Layouts
                            </Link>{" "}
                            - Nested layouts and route groups
                        </li>
                        <li>
                            <Link href="/docs/core-concepts/routing/route-groups" className="underline hover:text-teal-900">
                                Route Groups
                            </Link>{" "}
                            - Organize sections without changing URLs
                        </li>
                        <li>
                            <Link href="/docs/core-concepts/routing/transitions" className="underline hover:text-teal-900">
                                Page Transitions
                            </Link>{" "}
                            - Smooth navigation with React 18+
                        </li>
                        <li>
                            <Link href="/docs/core-concepts/routing/examples" className="underline hover:text-teal-900">
                                Examples
                            </Link>{" "}
                            - Complete code examples
                        </li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <Heading level={2}>File-Based Routing</Heading>

                <Heading level={3}>Basic Routes</Heading>
                <p>
                    Files in <code>src/pages</code> are automatically mapped to routes:
                </p>
                <CodeBlock
                    code={`src/pages/
├── index.tsx           → /
├── about.tsx           → /about
├── contact.tsx         → /contact
└── blog/
    ├── index.tsx       → /blog
    └── post.tsx        → /blog/post`}
                    language="plaintext"
                />

                <Heading level={3}>Dynamic Routes</Heading>
                <p>
                    Use square brackets <code>[param]</code> to create dynamic routes:
                </p>
                <CodeBlock
                    code={`src/pages/
├── users/
│   └── [id].tsx        → /users/:id (matches /users/123, /users/abc, etc.)
├── blog/
│   └── [slug].tsx      → /blog/:slug
└── products/
    └── [category]/
        └── [id].tsx    → /products/:category/:id`}
                    language="plaintext"
                />

                <p className="font-semibold">Example usage:</p>
                <CodeBlock
                    code={`// src/pages/users/[id].tsx
import { useRouter } from "heliumts/client";

export default function UserPage() {
    const router = useRouter();
    const userId = router.params.id;  // Get the dynamic parameter
    
    return <div>User ID: {userId}</div>;
}`}
                    language="typescript"
                />

                <Heading level={3}>Catch-All Routes</Heading>
                <p>
                    Use <code>[...param]</code> to match any number of path segments:
                </p>
                <CodeBlock
                    code={`src/pages/
└── docs/
    └── [...slug].tsx   → /docs/* (matches /docs/a, /docs/a/b/c, etc.)`}
                    language="plaintext"
                />

                <p className="font-semibold">Example usage:</p>
                <CodeBlock
                    code={`// src/pages/docs/[...slug].tsx
import { useRouter } from "heliumts/client";

export default function DocsPage() {
    const router = useRouter();
    const slug = router.params.slug;  // Array of path segments
    
    return <div>Docs path: {Array.isArray(slug) ? slug.join('/') : slug}</div>;
}`}
                    language="typescript"
                />

                <Heading level={3}>Index Routes</Heading>
                <p>
                    Files named <code>index.tsx</code> represent the root of their directory:
                </p>
                <CodeBlock
                    code={`src/pages/
├── index.tsx           → /
├── blog/
│   ├── index.tsx       → /blog
│   └── post.tsx        → /blog/post
└── admin/
    └── index.tsx       → /admin`}
                    language="plaintext"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Route Groups</Heading>
                <p>Route groups allow you to organize pages without affecting URLs. Wrap folder names in parentheses:</p>
                <CodeBlock
                    code={`src/pages/
├── (marketing)/
│   ├── _layout.tsx     # Layout for marketing pages
│   ├── index.tsx       → /
│   ├── about.tsx       → /about
│   └── pricing.tsx     → /pricing
├── (app)/
│   ├── _layout.tsx     # Layout for app pages
│   ├── dashboard.tsx   → /dashboard
│   └── settings.tsx    → /settings
└── (auth)/
    ├── _layout.tsx     # Layout for auth pages
    ├── login.tsx       → /login
    └── register.tsx    → /register`}
                    language="plaintext"
                />

                <p>
                    The route group folders <code>(marketing)</code>, <code>(app)</code>, and <code>(auth)</code> are <strong>stripped from URLs</strong> but allow you to:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Organize related pages</li>
                    <li>Apply different layouts per group</li>
                    <li>Keep code organized by feature/domain</li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Layouts</Heading>
                <p>
                    Layouts allow you to share UI between pages. Create <code>_layout.tsx</code> files to wrap pages with shared headers, sidebars, and footers.
                </p>
                <p>
                    See <Link href="/docs/core-concepts/routing/layouts">Layouts</Link> for detailed documentation on root layouts, group layouts, and nested layouts.
                </p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>SSR-Aware Routing</Heading>
                <p>
                    Routing, layouts, and route groups also work with server-rendered pages. If a page opts into <code>"use ssr";</code>, HeliumTS renders the layout tree on the
                    server before sending HTML to the browser.
                </p>
                <p>
                    See <Link href="/docs/core-concepts/ssr">SSR</Link> for request-time rendering details and{" "}
                    <Link href="/docs/core-concepts/routing/route-groups">Route Groups</Link> for layout scoping.
                </p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Route Collision Detection</Heading>
                <p>Helium automatically detects when multiple files resolve to the same URL:</p>
                <CodeBlock
                    code={`❌ Route collision detected! Multiple files resolve to the same path "/":
   - /src/pages/index.tsx
   - /src/pages/(marketing)/index.tsx
Only the first file will be used.`}
                    language="plaintext"
                />

                <p className="font-semibold">Common causes:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        Multiple <code>index.tsx</code> files at the same level
                    </li>
                    <li>Same filename in different route groups</li>
                    <li>Mixed grouped and non-grouped files</li>
                </ul>

                <p>
                    <strong>Solution:</strong> Use unique filenames or nest pages in subdirectories.
                </p>
            </section>
        </div>
    );
}
