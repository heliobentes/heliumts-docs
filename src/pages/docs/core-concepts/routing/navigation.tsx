"use ssg";

import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function Navigation() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Navigation</Heading>

            <section className="space-y-4">
                <Heading level={2}>Link Component</Heading>
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

                <Heading level={3}>Props</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>href</code> (string): Target URL
                    </li>
                    <li>
                        <code>replace</code> (boolean): Use <code>history.replace</code> instead of <code>history.push</code>
                    </li>
                    <li>
                        <code>prefetch</code> (boolean, default: <code>true</code>): Call the route preload hook on hover and focus
                    </li>
                    <li>
                        <code>scrollToTop</code> (boolean, default: <code>true</code>): Scroll to top of page after navigation
                    </li>
                    <li>
                        Standard <code>&lt;a&gt;</code> tag props (className, onClick, etc.)
                    </li>
                </ul>

                <Heading level={3}>Behavior</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Left-clicks are intercepted for SPA navigation</li>
                    <li>Modifier keys (Ctrl, Cmd, Shift, Alt) preserve normal link behavior (open in new tab, etc.)</li>
                    <li>Right-clicks and middle-clicks work normally</li>
                    <li>
                        <strong>Route preloading:</strong> Hovering or focusing a link calls the route preload hook. HeliumTS 0.9.6 eagerly imports page modules, so this does not
                        create separate page chunks.
                    </li>
                </ul>

                <Heading level={3}>Prefetching</Heading>
                <p>
                    Links call route preload hooks on hover and keyboard focus. Pages are already eagerly imported in this release; use explicit dynamic imports for application
                    code that should load separately.
                </p>
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
                <Heading level={2}>Programmatic Navigation</Heading>
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

                <Heading level={3}>Navigation Methods</Heading>

                <Heading level={4}>
                    <code>push(href: string)</code>
                </Heading>
                <p>Navigate to a new route (adds to history):</p>
                <CodeBlock
                    code={`const router = useRouter();

router.push("/about");
router.push("/users/123");
router.push("/search?q=hello");`}
                    language="typescript"
                />

                <Heading level={4}>
                    <code>replace(href: string)</code>
                </Heading>
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
                <Heading level={2}>Redirect Component</Heading>
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

                <Heading level={3}>Props</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>to</code> (string): Target URL
                    </li>
                    <li>
                        <code>replace</code> (boolean, optional): Use <code>history.replace</code> instead of <code>history.push</code> (default: <code>false</code>)
                    </li>
                </ul>

                <Heading level={3}>Why use Redirect?</Heading>
                <p>
                    Calling <code>router.push()</code> directly during render is an anti-pattern in React that can cause issues. The <code>Redirect</code> component uses{" "}
                    <code>useLayoutEffect</code> internally to ensure navigation happens after the component mounts but before paint, following React best practices and preventing
                    issues with server-side rendering.
                </p>

                <Heading level={3}>Example Use Cases</Heading>
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
                <Heading level={2}>Best Practices</Heading>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                        <strong>Use Link for internal navigation</strong>: Keeps navigation in the app and calls route preload hooks
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
