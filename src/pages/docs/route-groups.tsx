"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function RouteGroups() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Route Groups</h1>
            <p>
                Route groups allow you to organize your pages into logical groups without affecting the URL structure. This is similar to Next.js route groups and is particularly
                useful for organizing pages with different layouts or for future SSG configurations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Overview</h2>
            <p>
                Route groups are created by wrapping a folder name in parentheses: <code>(groupName)</code>. These folders are purely organizational and do not appear in the URL
                path.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Example Structure</h2>
            <CodeBlock
                code={`/src/pages/
  ├── (website)/
  │   ├── _layout.tsx      # Layout for website group
  │   ├── index.tsx        # → /
  │   ├── about.tsx        # → /about
  │   └── contact.tsx      # → /contact
  ├── (portal)/
  │   ├── _layout.tsx      # Layout for portal group
  │   ├── dashboard.tsx    # → /dashboard
  │   └── tasks.tsx        # → /tasks
  └── (auth)/
      ├── _layout.tsx      # Layout for auth group
      ├── login.tsx        # → /login
      └── register.tsx     # → /register`}
                language="plaintext"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Key Features</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">URL Path Generation</h3>
            <p>Route groups are stripped from the URL path. For example:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <code>/pages/(website)/contact.tsx</code> → <code>/contact</code>
                </li>
                <li>
                    <code>/pages/(portal)/dashboard.tsx</code> → <code>/dashboard</code>
                </li>
                <li>
                    <code>/pages/(auth)/login.tsx</code> → <code>/login</code>
                </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Layouts</h3>
            <p>
                Each route group can have its own <code>_layout.tsx</code> file. Layouts are isolated to their route group - a layout in one group does not apply to pages in other
                groups.
            </p>
            <CodeBlock
                code={`// /src/pages/(website)/_layout.tsx
export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="website-layout">
      <header>Website Header</header>
      <main>{children}</main>
      <footer>Website Footer</footer>
    </div>
  );
}

// /src/pages/(portal)/_layout.tsx
export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-layout">
      <nav>Portal Navigation</nav>
      <main>{children}</main>
    </div>
  );
}`}
                language="typescript"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Dynamic Routes</h3>
            <p>Route groups work seamlessly with dynamic routes:</p>
            <CodeBlock
                code={`/src/pages/
  └── (portal)/
      ├── tasks/
      │   ├── [id].tsx     # → /tasks/:id
      │   └── index.tsx    # → /tasks
      └── users/
          └── [userId].tsx # → /users/:userId`}
                language="plaintext"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Use Cases</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <strong>Different Layouts:</strong> Organize pages that share the same layout (e.g., public website vs. authenticated app).
                </li>
                <li>
                    <strong>Feature-Based Organization:</strong> Organize by feature or domain (e.g., blog, shop, docs).
                </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Route Collision Detection</h2>
            <p>The router automatically detects when multiple files resolve to the same URL pattern and logs errors to help you identify conflicts.</p>
            <CodeBlock
                code={`❌ Route collision detected! Multiple files resolve to the same path "/":
   - /src/pages/index.tsx
   - /src/pages/(website)/index.tsx
Only the first file will be used. Consider using different file names or paths.`}
                language="plaintext"
            />
        </div>
    );
}
