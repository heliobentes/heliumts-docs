"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function Routing() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">File-based Routing</h1>
            <p>HeliumJS uses a file-based routing system similar to Next.js.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Pages</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>src/pages/index.tsx</code> → <code>/</code>
                </li>
                <li>
                    <code>src/pages/about.tsx</code> → <code>/about</code>
                </li>
                <li>
                    <code>src/pages/users/[id].tsx</code> → <code>/users/123</code>
                </li>
                <li>
                    <code>src/pages/[...slug].tsx</code> → <code>/page1/page2/.../pageN</code>
                </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Layouts</h2>
            <p>
                Create a <code>_layout.tsx</code> file to wrap pages in a common layout. Each nested folder can have its own layout:
            </p>
            <CodeBlock
                code={`/src/pages/
├── _layout.tsx          # Root layout
├── index.tsx            # → /
├── about.tsx            # → /about
└── users/
    ├── _layout.tsx      # Layout for /users/*
    ├── [id].tsx         # → /users/123
    └── settings.tsx     # → /users/settings`}
                language="plaintext"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Link Component</h2>
            <p>
                Helium provides a <code>Link</code> component for client-side navigation:
            </p>
            <CodeBlock
                code={`import { Link } from "helium/client";

<Link href="/about">Go to About</Link>`}
                language="typescript"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">useRouter Hook</h2>
            <p>Access routing information and navigation methods:</p>
            <CodeBlock
                code={`import { useRouter } from "helium/client";

function MyComponent() {
    const router = useRouter();
    
    // Access current route
    console.log(router.path);           // "/users/123"
    console.log(router.params.id);      // "123"
    console.log(router.searchParams);   // URLSearchParams
    console.log(router.status);         // 200 | 404
    
    // Navigate programmatically
    router.push("/dashboard");
    router.replace("/login");
    
    // Listen to route changes
    router.on("navigation", (event) => {
        console.log(\`Navigated to \${event.to}\`);
    });
}`}
                language="typescript"
            />
        </div>
    );
}
