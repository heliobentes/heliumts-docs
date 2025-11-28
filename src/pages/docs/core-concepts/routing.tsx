"use ssg";
import { Link } from "helium/client";

import CodeBlock from "../../../components/CodeBlock";

export default function Routing() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Routing and useRouter</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
                <p>
                    HeliumJS uses file-based routing similar to Next.js Pages Router. Pages are automatically mapped to routes based on their file path in the{" "}
                    <code>src/pages</code> directory. The framework provides a powerful routing system with support for dynamic routes, catch-all routes, layouts, and route groups.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">File-Based Routing</h2>

                <h3 className="text-xl font-semibold text-gray-900">Basic Routes</h3>
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

                <h3 className="text-xl font-semibold text-gray-900">Dynamic Routes</h3>
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
import { useRouter } from "helium/client";

export default function UserPage() {
    const router = useRouter();
    const userId = router.params.id;  // Get the dynamic parameter
    
    return <div>User ID: {userId}</div>;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Catch-All Routes</h3>
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
import { useRouter } from "helium/client";

export default function DocsPage() {
    const router = useRouter();
    const slug = router.params.slug;  // Array of path segments
    
    return <div>Docs path: {Array.isArray(slug) ? slug.join('/') : slug}</div>;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Index Routes</h3>
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
                <h2 className="text-2xl font-semibold text-gray-900">Route Groups</h2>
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
                <p>
                    See <Link href="/docs/core-concepts/route-groups">Route Groups</Link> for detailed information.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Layouts</h2>
                <p>Layouts allow you to share UI between pages. They wrap page components and can be nested.</p>

                <h3 className="text-xl font-semibold text-gray-900">Root Layout</h3>
                <p>
                    Create <code>_layout.tsx</code> at the root of <code>src/pages</code> to wrap <strong>all pages</strong>:
                </p>
                <CodeBlock
                    code={`// src/pages/_layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <header>Global Header</header>
            <main>{children}</main>
            <footer>Global Footer</footer>
        </div>
    );
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Group Layouts</h3>
                <p>
                    Create <code>_layout.tsx</code> inside route groups to wrap <strong>only pages in that group</strong>:
                </p>
                <CodeBlock
                    code={`// src/pages/(app)/_layout.tsx
export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="app-layout">
            <nav>App Navigation</nav>
            <div className="content">{children}</div>
        </div>
    );
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Nested Layouts</h3>
                <p>Layouts can be nested in subdirectories:</p>
                <CodeBlock
                    code={`src/pages/
├── _layout.tsx                    # RootLayout - all pages
├── (app)/
│   ├── _layout.tsx                # AppLayout - (app) pages only
│   ├── dashboard.tsx              # [RootLayout → AppLayout]
│   └── settings/
│       ├── _layout.tsx            # SettingsLayout - settings pages only
│       └── profile.tsx            # [RootLayout → AppLayout → SettingsLayout]`}
                    language="plaintext"
                />

                <p>
                    <strong>Rendering order:</strong> Outer to inner (Root → Group → Nested)
                </p>
                <CodeBlock
                    code={`<RootLayout>
    <AppLayout>
        <SettingsLayout>
            <ProfilePage />
        </SettingsLayout>
    </AppLayout>
</RootLayout>`}
                    language="tsx"
                />

                <p>
                    See <Link href="/docs/core-concepts/route-groups#layout-hierarchy">Route Groups - Layout Hierarchy</Link> for more details.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Navigation</h2>

                <h3 className="text-xl font-semibold text-gray-900">Link Component</h3>
                <p>
                    Use the <code>Link</code> component for client-side navigation:
                </p>
                <CodeBlock
                    code={`import { Link } from "helium/client";

export default function Nav() {
    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/blog/my-post">Blog Post</Link>
        </nav>
    );
}`}
                    language="typescript"
                />

                <p className="font-semibold">Props:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>href</code> (string): Target URL
                    </li>
                    <li>
                        <code>replace</code> (boolean): Use <code>history.replace</code> instead of <code>history.push</code>
                    </li>
                    <li>
                        Standard <code>&lt;a&gt;</code> tag props (className, onClick, etc.)
                    </li>
                </ul>

                <p className="font-semibold">Behavior:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Left-clicks are intercepted for SPA navigation</li>
                    <li>Modifier keys (Ctrl, Cmd, Shift, Alt) preserve normal link behavior (open in new tab, etc.)</li>
                    <li>Right-clicks and middle-clicks work normally</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Programmatic Navigation</h3>
                <p>
                    Use the <code>useRouter</code> hook for programmatic navigation:
                </p>
                <CodeBlock
                    code={`import { useRouter } from "helium/client";

export default function LoginPage() {
    const router = useRouter();
    
    const handleLogin = async () => {
        // Perform login
        await login();
        
        // Navigate to dashboard
        router.push("/dashboard");
    };
    
    return <button onClick={handleLogin}>Login</button>;
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">useRouter Hook</h2>
                <p>
                    The <code>useRouter</code> hook provides access to routing information and navigation methods.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Usage</h3>
                <CodeBlock
                    code={`import { useRouter } from "helium/client";

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

                <h3 className="text-xl font-semibold text-gray-900">Properties</h3>

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>path</code> (string)
                </h4>
                <p>Current pathname (without query string):</p>
                <CodeBlock
                    code={`const router = useRouter();
console.log(router.path);  // "/blog/my-post"`}
                    language="typescript"
                />

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>params</code> (Record&lt;string, string | string[]&gt;)
                </h4>
                <p>Dynamic route parameters:</p>
                <CodeBlock
                    code={`// URL: /users/123
const router = useRouter();
console.log(router.params.id);  // "123"

// URL: /docs/guide/getting-started
const router = useRouter();
console.log(router.params.slug);  // ["guide", "getting-started"]`}
                    language="typescript"
                />

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>searchParams</code> (URLSearchParams)
                </h4>
                <p>URL query parameters:</p>
                <CodeBlock
                    code={`// URL: /search?q=hello&page=2
const router = useRouter();
console.log(router.searchParams.get("q"));      // "hello"
console.log(router.searchParams.get("page"));   // "2"

// Get all values
const allParams = Object.fromEntries(router.searchParams);
console.log(allParams);  // { q: "hello", page: "2" }`}
                    language="typescript"
                />

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>status</code> (200 | 404)
                </h4>
                <p>Current route status:</p>
                <CodeBlock
                    code={`const router = useRouter();

if (router.status === 404) {
    return <div>Page not found</div>;
}

return <div>Content</div>;`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Methods</h3>

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>push(href: string)</code>
                </h4>
                <p>Navigate to a new route (adds to history):</p>
                <CodeBlock
                    code={`const router = useRouter();

router.push("/about");
router.push("/users/123");
router.push("/search?q=hello");`}
                    language="typescript"
                />

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>replace(href: string)</code>
                </h4>
                <p>Navigate to a new route (replaces current history entry):</p>
                <CodeBlock
                    code={`const router = useRouter();

// Replace current URL (no back button entry)
router.replace("/login");`}
                    language="typescript"
                />

                <p className="font-semibold">Use cases:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Redirects after authentication</li>
                    <li>Replacing temporary URLs</li>
                    <li>Preventing back navigation to intermediate states</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Redirect Component</h3>
                <p>
                    For declarative redirects, use the <code>Redirect</code> component instead of calling <code>router.push()</code> during render:
                </p>
                <CodeBlock
                    code={`import { Redirect } from "helium/client";

export default function OldDocsPage() {
    return <Redirect to="/docs/getting-started" />;
}`}
                    language="typescript"
                />

                <p className="font-semibold">Props:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>to</code> (string): Target URL
                    </li>
                    <li>
                        <code>replace</code> (boolean, optional): Use <code>history.replace</code> instead of <code>history.push</code> (default: <code>false</code>)
                    </li>
                </ul>

                <p className="font-semibold">Why use Redirect?</p>
                <p>
                    Calling <code>router.push()</code> directly during render is an anti-pattern that can cause issues. The <code>Redirect</code> component uses{" "}
                    <code>useEffect</code> internally to ensure navigation happens after the component mounts, following React best practices.
                </p>

                <p className="font-semibold">Example use cases:</p>
                <CodeBlock
                    code={`// Redirect index page to a default subpage
// src/pages/docs/index.tsx
import { Redirect } from "helium/client";

export default function DocsIndex() {
    return <Redirect to="/docs/getting-started" />;
}

// Redirect with replace (no history entry)
export default function OldPage() {
    return <Redirect to="/new-page" replace />;
}

// Conditional redirect
export default function ProtectedPage() {
    const isAuthenticated = useAuth();
    
    if (!isAuthenticated) {
        return <Redirect to="/login" />;
    }
    
    return <div>Protected content</div>;
}`}
                    language="typescript"
                />

                <h4 className="text-lg font-semibold text-gray-900">
                    <code>on(event: RouterEvent, listener: EventListener)</code>
                </h4>
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

                <p className="font-semibold">Event types:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>"navigation"</code>: Fires after navigation completes
                    </li>
                    <li>
                        <code>"before-navigation"</code>: Fires before navigation (can be prevented)
                    </li>
                </ul>

                <p className="font-semibold">Event object:</p>
                <CodeBlock
                    code={`{
    from: string;    // Previous path
    to: string;      // New path
    preventDefault?: () => void;  // Only for "before-navigation"
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Router Events</h3>

                <h4 className="text-lg font-semibold text-gray-900">Navigation Event</h4>
                <p>Fires after navigation completes:</p>
                <CodeBlock
                    code={`import { useRouter } from "helium/client";
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

                <h4 className="text-lg font-semibold text-gray-900">Before Navigation Event</h4>
                <p>Fires before navigation (can be prevented):</p>
                <CodeBlock
                    code={`import { useRouter } from "helium/client";
import { useEffect } from "react";

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
                <h2 className="text-2xl font-semibold text-gray-900">Complete Examples</h2>

                <h3 className="text-xl font-semibold text-gray-900">Blog with Dynamic Routes</h3>
                <CodeBlock
                    code={`// src/pages/blog/[slug].tsx
import { useRouter } from "helium/client";
import { useFetch } from "helium/client";
import { getBlogPost } from "helium/server";

export default function BlogPostPage() {
    const router = useRouter();
    const slug = router.params.slug as string;
    
    const { data: post, isLoading } = useFetch(getBlogPost, { slug });
    
    if (isLoading) return <div>Loading...</div>;
    if (!post) return <div>Post not found</div>;
    
    return (
        <article>
            <h1>{post.title}</h1>
            <div>{post.content}</div>
        </article>
    );
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Search with Query Parameters</h3>
                <CodeBlock
                    code={`// src/pages/search.tsx
import { useRouter } from "helium/client";
import { useFetch } from "helium/client";
import { searchProducts } from "helium/server";

export default function SearchPage() {
    const router = useRouter();
    const query = router.searchParams.get("q") || "";
    
    const { data: results } = useFetch(searchProducts, { query });
    
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const q = formData.get("q");
        router.push(\`/search?q=\${q}\`);
    };
    
    return (
        <div>
            <form onSubmit={handleSearch}>
                <input name="q" defaultValue={query} />
                <button type="submit">Search</button>
            </form>
            
            <div>
                {results?.map(product => (
                    <div key={product.id}>{product.name}</div>
                ))}
            </div>
        </div>
    );
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Authentication Guard</h3>
                <CodeBlock
                    code={`// src/pages/(app)/dashboard.tsx
import { Redirect } from "helium/client";

export default function DashboardPage() {
    const isAuthenticated = checkAuth();  // Your auth logic
    
    if (!isAuthenticated) {
        return <Redirect to="/login" replace />;
    }
    
    return <div>Dashboard content</div>;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Breadcrumb Navigation</h3>
                <CodeBlock
                    code={`// src/components/Breadcrumbs.tsx
import { useRouter } from "helium/client";
import { Link } from "helium/client";

export default function Breadcrumbs() {
    const router = useRouter();
    const pathSegments = router.path.split("/").filter(Boolean);
    
    return (
        <nav>
            <Link href="/">Home</Link>
            {pathSegments.map((segment, index) => {
                const href = "/" + pathSegments.slice(0, index + 1).join("/");
                return (
                    <span key={href}>
                        {" / "}
                        <Link href={href}>{segment}</Link>
                    </span>
                );
            })}
        </nav>
    );
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Page Transition Analytics</h3>
                <CodeBlock
                    code={`// src/components/Analytics.tsx
import { useRouter } from "helium/client";
import { useEffect } from "react";

export default function Analytics() {
    const router = useRouter();
    
    useEffect(() => {
        // Track initial page view
        trackPageView(router.path);
        
        // Track subsequent navigations
        const unsubscribe = router.on("navigation", (event) => {
            trackPageView(event.to);
            trackNavigationTime(event.from, event.to);
        });
        
        return unsubscribe;
    }, [router]);
    
    return null;
}

function trackPageView(path: string) {
    console.log("Page view:", path);
    // Send to analytics service
}

function trackNavigationTime(from: string, to: string) {
    console.log(\`Navigation: \${from} → \${to}\`);
    // Track navigation performance
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Route Collision Detection</h2>
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
                <p>
                    See <Link href="/docs/core-concepts/route-groups#route-collision-detection">Route Groups - Route Collision Detection</Link> for more details.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Best Practices</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                        <strong>Use Link for internal navigation</strong>: Enables SPA navigation and better performance
                    </li>
                    <li>
                        <strong>Use router.replace for redirects</strong>: Prevents unwanted back button entries
                    </li>
                    <li>
                        <strong>Validate params</strong>: Dynamic params are strings - validate and parse them
                    </li>
                    <li>
                        <strong>Handle loading states</strong>: Show loading UI while data fetches
                    </li>
                    <li>
                        <strong>Use layouts wisely</strong>: Share UI without duplication
                    </li>
                    <li>
                        <strong>Organize with route groups</strong>: Keep related pages together
                    </li>
                    <li>
                        <strong>Subscribe to events carefully</strong>: Always unsubscribe in cleanup
                    </li>
                    <li>
                        <strong>Type your params</strong>: Use TypeScript to type route parameters
                    </li>
                </ol>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">TypeScript Support</h2>

                <h3 className="text-xl font-semibold text-gray-900">Typing Route Params</h3>
                <CodeBlock
                    code={`import { useRouter } from "helium/client";

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
                    code={`import { useRouter } from "helium/client";

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
                    <strong>Solution:</strong> Ensure your app is wrapped with <code>&lt;AppRouter&gt;</code>:
                </p>
                <CodeBlock
                    code={`// src/main.tsx
import { AppRouter } from "helium/client";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <AppRouter>
        {/* Your app */}
    </AppRouter>
);`}
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

                <h3 className="text-xl font-semibold text-gray-900">Navigation not working</h3>
                <p>
                    <strong>Cause:</strong> Using <code>&lt;a&gt;</code> instead of <code>&lt;Link&gt;</code>
                </p>
                <p>
                    <strong>Solution:</strong> Use <code>&lt;Link&gt;</code> for internal navigation:
                </p>
                <CodeBlock
                    code={`// ❌ Don't use <a> for internal links
<a href="/about">About</a>

// ✅ Use <Link>
<Link href="/about">About</Link>`}
                    language="tsx"
                />

                <h3 className="text-xl font-semibold text-gray-900">Route groups affecting URLs</h3>
                <p>
                    <strong>Cause:</strong> Misunderstanding how route groups work
                </p>
                <p>
                    <strong>Solution:</strong> Route groups are <strong>stripped from URLs</strong>. They're for organization only.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Related Documentation</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                        <Link href="/docs/core-concepts/route-groups">Route Groups</Link> - Detailed guide on route groups and layouts
                    </li>
                    <li>
                        <Link href="/docs/core-concepts/ssg">SSG</Link> - Static site generation with routing
                    </li>
                    <li>
                        <Link href="/docs/advanced/context-api">Context API</Link> - Access request context
                    </li>
                    <li>
                        <Link href="/docs/core-concepts/rpc">RPC Methods</Link> - Fetch data in pages
                    </li>
                </ul>
            </section>
        </div>
    );
}
