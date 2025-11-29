"use ssg";

import CodeBlock from "../../../../components/CodeBlock";

export default function Navigation() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Link Component</h2>
                <p>
                    Use the <code>Link</code> component for client-side navigation:
                </p>
                <CodeBlock
                    code={`import { Link } from "heliumts/client";

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

                <h3 className="text-xl font-semibold text-gray-900">Props</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>href</code> (string): Target URL
                    </li>
                    <li>
                        <code>replace</code> (boolean): Use <code>history.replace</code> instead of <code>history.push</code>
                    </li>
                    <li>
                        <code>prefetch</code> (boolean, default: <code>true</code>): Prefetch page on hover for faster navigation
                    </li>
                    <li>
                        <code>scrollToTop</code> (boolean, default: <code>true</code>): Scroll to top of page after navigation
                    </li>
                    <li>
                        Standard <code>&lt;a&gt;</code> tag props (className, onClick, etc.)
                    </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Behavior</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Left-clicks are intercepted for SPA navigation</li>
                    <li>Modifier keys (Ctrl, Cmd, Shift, Alt) preserve normal link behavior (open in new tab, etc.)</li>
                    <li>Right-clicks and middle-clicks work normally</li>
                    <li>
                        <strong>Automatic prefetching:</strong> When users hover over or focus on a link, the page chunk is preloaded in the background for instant navigation
                    </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Prefetching</h3>
                <p>Links automatically prefetch page chunks on hover and focus (keyboard navigation). This means when a user clicks a link, the page is often already loaded:</p>
                <CodeBlock
                    code={`// Prefetching enabled by default
<Link href="/heavy-page">Heavy Page</Link>

// Disable prefetching for specific links
<Link href="/settings" prefetch={false}>Settings</Link>

// Disable scroll-to-top (e.g., for in-page tab navigation)
<Link href="/settings/profile" scrollToTop={false}>Profile Tab</Link>`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Programmatic Navigation</h2>
                <p>
                    Use the <code>useRouter</code> hook for programmatic navigation:
                </p>
                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";

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

                <h3 className="text-xl font-semibold text-gray-900">Navigation Methods</h3>

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

                <p className="font-semibold">Use cases for replace:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Redirects after authentication</li>
                    <li>Replacing temporary URLs</li>
                    <li>Preventing back navigation to intermediate states</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Redirect Component</h2>
                <p>
                    For declarative redirects, use the <code>Redirect</code> component instead of calling <code>router.push()</code> during render:
                </p>
                <CodeBlock
                    code={`import { Redirect } from "heliumts/client";

export default function OldDocsPage() {
    return <Redirect to="/docs/getting-started" />;
}`}
                    language="typescript"
                />

                <h3 className="text-xl font-semibold text-gray-900">Props</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>to</code> (string): Target URL
                    </li>
                    <li>
                        <code>replace</code> (boolean, optional): Use <code>history.replace</code> instead of <code>history.push</code> (default: <code>false</code>)
                    </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900">Why use Redirect?</h3>
                <p>
                    Calling <code>router.push()</code> directly during render is an anti-pattern in React that can cause issues. The <code>Redirect</code> component uses{" "}
                    <code>useLayoutEffect</code> internally to ensure navigation happens after the component mounts but before paint, following React best practices and preventing
                    issues with server-side rendering.
                </p>

                <h3 className="text-xl font-semibold text-gray-900">Example Use Cases</h3>
                <CodeBlock
                    code={`// Redirect index page to a default subpage
// src/pages/docs/index.tsx
import { Redirect } from "heliumts/client";

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
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Best Practices</h2>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                        <strong>Use Link for internal navigation</strong>: Enables SPA navigation, prefetching, and better performance
                    </li>
                    <li>
                        <strong>Use router.replace for redirects</strong>: Prevents unwanted back button entries
                    </li>
                    <li>
                        <strong>Use Redirect component for declarative redirects</strong>: Follows React best practices
                    </li>
                    <li>
                        <strong>Disable scrollToTop for tab navigation</strong>: Prevents jarring scroll behavior for in-page navigation
                    </li>
                </ol>

                <CodeBlock
                    code={`// ❌ Don't use <a> for internal links
<a href="/about">About</a>

// ✅ Use <Link>
<Link href="/about">About</Link>

// ❌ Don't call router.push during render
function BadRedirect() {
    const router = useRouter();
    router.push("/dashboard"); // Anti-pattern!
    return null;
}

// ✅ Use Redirect component
function GoodRedirect() {
    return <Redirect to="/dashboard" />;
}`}
                    language="tsx"
                />
            </section>
        </div>
    );
}
