"use ssg";

import CodeBlock from "../../../../components/CodeBlock";

export default function UseRouter() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">useRouter Hook</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
                <p>
                    The <code>useRouter</code> hook provides access to routing information and navigation methods.
                </p>

                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";

export default function MyComponent() {
    const router = useRouter();
    
    // Access router properties
    console.log(router.path);
    console.log(router.params);
    console.log(router.searchParams);
    console.log(router.status);
    
    return <div>...</div>;
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Properties</h2>

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>path</code> (string)
                </h3>
                <p>Current pathname (without query string):</p>
                <CodeBlock
                    code={`const router = useRouter();
console.log(router.path);  // "/blog/my-post"`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>params</code> (Record&lt;string, string | string[]&gt;)
                </h3>
                <p>Dynamic route parameters:</p>
                <CodeBlock
                    code={`// URL: /users/123
const router = useRouter();
console.log(router.params.id);  // "123"

// URL: /docs/guide/getting-started (catch-all route)
const router = useRouter();
console.log(router.params.slug);  // ["guide", "getting-started"]`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>searchParams</code> (URLSearchParams)
                </h3>
                <p>URL query parameters:</p>
                <CodeBlock
                    code={`// URL: /search?q=hello&page=2
const router = useRouter();
console.log(router.searchParams.get("q"));      // "hello"
console.log(router.searchParams.get("page"));   // "2"

// Get all values as object
const allParams = Object.fromEntries(router.searchParams);
console.log(allParams);  // { q: "hello", page: "2" }`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>status</code> (200 | 404)
                </h3>
                <p>Current route status:</p>
                <CodeBlock
                    code={`const router = useRouter();

if (router.status === 404) {
    return <div>Page not found</div>;
}

return <div>Content</div>;`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>isNavigating</code> (boolean)
                </h3>
                <p>Indicates whether a navigation is currently in progress. Useful for showing loading indicators:</p>
                <CodeBlock
                    code={`const router = useRouter();

return (
    <div>
        {router.isNavigating && <LoadingSpinner />}
        <main>{/* page content */}</main>
    </div>
);`}
                    language="tsx"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>isPending</code> (boolean)
                </h3>
                <p>Indicates when content is stale (React 18+ concurrent feature). True when React is rendering a new page in the background while still showing old content:</p>
                <CodeBlock
                    code={`const router = useRouter();

return (
    <div style={{ opacity: router.isPending ? 0.7 : 1 }}>
        <main>{/* page content */}</main>
    </div>
);`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Methods</h2>

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>push(href: string)</code>
                </h3>
                <p>Navigate to a new route (adds to history):</p>
                <CodeBlock
                    code={`const router = useRouter();

router.push("/about");
router.push("/users/123");
router.push("/search?q=hello");`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>replace(href: string)</code>
                </h3>
                <p>Navigate to a new route (replaces current history entry):</p>
                <CodeBlock
                    code={`const router = useRouter();

// Replace current URL (no back button entry)
router.replace("/login");`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">
                    <code>on(event, listener)</code>
                </h3>
                <p>Subscribe to router events. Returns an unsubscribe function:</p>
                <CodeBlock
                    code={`const router = useRouter();

useEffect(() => {
    // Listen to navigation events
    const unsubscribe = router.on("navigation", (event) => {
        console.log(\`Navigated from \${event.from} to \${event.to}\`);
    });
    
    // Cleanup
    return unsubscribe;
}, [router]);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Router Events</h2>

                <h3 className="text-xl font-semibold text-gray-900">Event Types</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>"navigation"</code>: Fires after navigation completes
                    </li>
                    <li>
                        <code>"before-navigation"</code>: Fires before navigation (can be prevented)
                    </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Event Object</h3>
                <CodeBlock
                    code={`{
    from: string;    // Previous path
    to: string;      // New path
    preventDefault?: () => void;  // Only for "before-navigation"
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Navigation Event</h3>
                <p>Fires after navigation completes:</p>
                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";
import { useEffect } from "react";

export default function Analytics() {
    const router = useRouter();
    
    useEffect(() => {
        const unsubscribe = router.on("navigation", (event) => {
            // Track page view
            trackPageView(event.to);
        });
        
        return unsubscribe;
    }, [router]);
    
    return null;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Before Navigation Event</h3>
                <p>Fires before navigation and can be prevented:</p>
                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";
import { useEffect, useState } from "react";

export default function UnsavedChangesGuard() {
    const router = useRouter();
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    useEffect(() => {
        const unsubscribe = router.on("before-navigation", (event) => {
            if (hasUnsavedChanges) {
                const confirmed = window.confirm(
                    "You have unsaved changes. Do you want to leave?"
                );
                
                if (!confirmed) {
                    event.preventDefault?.();  // Prevent navigation
                }
            }
        });
        
        return unsubscribe;
    }, [router, hasUnsavedChanges]);
    
    return <form>...</form>;
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">TypeScript Support</h2>

                <h3 className="text-xl font-semibold text-gray-900">Typing Route Params</h3>
                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";

type UserPageParams = {
    id: string;
};

export default function UserPage() {
    const router = useRouter();
    const { id } = router.params as UserPageParams;
    
    // id is typed as string
    return <div>User: {id}</div>;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Typing Search Params</h3>
                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";

export default function SearchPage() {
    const router = useRouter();
    
    const query = router.searchParams.get("q") ?? "";
    const page = Number(router.searchParams.get("page") ?? "1");
    
    // query: string, page: number
    return <div>Search: {query}, Page: {page}</div>;
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Troubleshooting</h2>

                <h3 className="text-xl font-semibold text-gray-900">useRouter throws "must be used inside &lt;AppRouter&gt;"</h3>
                <p>
                    <strong>Cause:</strong> <code>useRouter</code> called outside the router context
                </p>
                <p>
                    <strong>Solution:</strong> Ensure you deleted <code>/src/main.tsx</code> and your <code>/src/App.tsx</code> is like this:
                </p>
                <CodeBlock
                    code={`import { type AppShellProps } from "heliumts/client";
                    
export default function App({ Component, pageProps }: AppShellProps) {
    return <Component {...pageProps} />;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Dynamic params are undefined</h3>
                <p>
                    <strong>Cause:</strong> Wrong param name or file structure
                </p>
                <p>
                    <strong>Solution:</strong> Ensure param name matches filename:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        File: <code>[id].tsx</code> → Param: <code>router.params.id</code>
                    </li>
                    <li>
                        File: <code>[slug].tsx</code> → Param: <code>router.params.slug</code>
                    </li>
                </ul>
            </section>
        </div>
    );
}
