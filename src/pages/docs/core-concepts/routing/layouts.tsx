"use ssg";

import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RoutingLayouts() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Layouts</Heading>

            <section className="space-y-4">
                <Heading level={2}>Overview</Heading>
                <p>
                    Layouts allow you to share UI between pages. They wrap page components and can be nested to create complex page structures with shared headers, sidebars, and
                    footers.
                </p>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="font-semibold text-teal-800 mb-2">Key Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-teal-700">
                        <li>
                            <strong>Nested layouts:</strong> Layouts can wrap other layouts
                        </li>
                        <li>
                            <strong>Route group layouts:</strong> Apply layouts to specific groups of pages
                        </li>
                        <li>
                            <strong>Preserved state:</strong> Layout components don't remount on navigation
                        </li>
                        <li>
                            <strong>Automatic wrapping:</strong> Pages are automatically wrapped by their parent layouts
                        </li>
                    </ul>
                </div>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Root Layout</Heading>
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

                <p>This layout wraps every page in your application, making it ideal for:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Global navigation headers</li>
                    <li>Site-wide footers</li>
                    <li>Theme providers</li>
                    <li>Analytics scripts</li>
                    <li>Error boundaries</li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Group Layouts</Heading>
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
}

// src/pages/(marketing)/_layout.tsx
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="marketing-layout">
            <header>Marketing Header</header>
            <main>{children}</main>
        </div>
    );
}

// src/pages/(auth)/_layout.tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="auth-layout min-h-screen flex items-center justify-center">
            <div className="auth-card">{children}</div>
        </div>
    );
}`}
                    language="typescript"
                />

                <p>Each route group can have its own distinct layout:</p>
                <CodeBlock
                    code={`src/pages/
├── (marketing)/
│   ├── _layout.tsx     # MarketingLayout
│   ├── index.tsx       → / (wrapped by MarketingLayout)
│   └── about.tsx       → /about (wrapped by MarketingLayout)
├── (app)/
│   ├── _layout.tsx     # AppLayout
│   └── dashboard.tsx   → /dashboard (wrapped by AppLayout)
└── (auth)/
    ├── _layout.tsx     # AuthLayout
    ├── login.tsx       → /login (wrapped by AuthLayout)
    └── register.tsx    → /register (wrapped by AuthLayout)`}
                    language="plaintext"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Nested Layouts</Heading>
                <p>Layouts can be nested in subdirectories for more complex UI structures:</p>
                <CodeBlock
                    code={`src/pages/
├── _layout.tsx                    # RootLayout - wraps ALL pages
├── (app)/
│   ├── _layout.tsx                # AppLayout - wraps (app) pages
│   ├── dashboard.tsx              # [RootLayout → AppLayout]
│   └── settings/
│       ├── _layout.tsx            # SettingsLayout - wraps settings pages
│       ├── index.tsx              # [RootLayout → AppLayout → SettingsLayout]
│       └── profile.tsx            # [RootLayout → AppLayout → SettingsLayout]`}
                    language="plaintext"
                />

                <Heading level={3}>Rendering Order</Heading>
                <p>Layouts render from outer to inner (Root → Group → Nested):</p>
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

                <Heading level={3}>Settings Layout Example</Heading>
                <CodeBlock
                    code={`// src/pages/(app)/settings/_layout.tsx
import { Link, useRouter } from "heliumts/client";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    const tabs = [
        { href: "/settings", label: "General" },
        { href: "/settings/profile", label: "Profile" },
        { href: "/settings/security", label: "Security" },
        { href: "/settings/notifications", label: "Notifications" },
    ];

    return (
        <div className="settings-layout">
            <h1>Settings</h1>
            <nav className="tabs">
                {tabs.map((tab) => (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={router.path === tab.href ? "active" : ""}
                    >
                        {tab.label}
                    </Link>
                ))}
            </nav>
            <div className="settings-content">{children}</div>
        </div>
    );
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Layouts with SSR</Heading>
                <p>
                    When a page uses <code>"use ssr";</code>, the layout tree is rendered on the server too. Avoid client-only guards that return <code>null</code> during server
                    render, or you will send empty HTML.
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
                <Heading level={2}>Layout Props</Heading>
                <p>
                    Layouts receive a <code>children</code> prop containing the page content:
                </p>
                <CodeBlock
                    code={`import type { LayoutProps } from "heliumts/client";

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="layout">
            {children}
        </div>
    );
}

// Or with explicit typing
interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return <div>{children}</div>;
}`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Layout Best Practices</Heading>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                        <strong>Keep layouts focused:</strong> Each layout should handle one level of UI structure
                    </li>
                    <li>
                        <strong>Use route groups:</strong> Organize pages by feature or domain with group layouts
                    </li>
                    <li>
                        <strong>Keep SSR in mind:</strong> Layouts used by server-rendered pages must be safe to execute on the server
                    </li>
                    <li>
                        <strong>Avoid heavy computations:</strong> Layouts persist across navigations, so expensive operations will run on every page
                    </li>
                    <li>
                        <strong>Use PageTransition in root layout:</strong> Apply transitions at the highest level for consistent behavior
                    </li>
                    <li>
                        <strong>Don't duplicate layout logic:</strong> If multiple groups need the same layout, consider a shared component
                    </li>
                </ol>
            </section>
        </div>
    );
}
