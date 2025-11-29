"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../../components/CodeBlock";

export default function RoutingExamples() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Routing Examples</h1>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Blog with Dynamic Routes</h2>
                <p>A complete blog implementation with dynamic routes:</p>
                <CodeBlock
                    code={`// src/pages/blog/[slug].tsx
"use ssg";
import { useRouter, Link } from "heliumts/client";
import { GetStaticPaths, GetStaticProps } from "heliumts/rsc";

interface BlogPost {
    slug: string;
    title: string;
    content: string;
    date: string;
}

// Static props for the page
export const getStaticProps: GetStaticProps<{ post: BlogPost }> = async ({ params }) => {
    const post = await fetchPost(params.slug);
    return { props: { post } };
};

// Generate all blog post paths
export const getStaticPaths: GetStaticPaths = async () => {
    const posts = await fetchAllPosts();
    return {
        paths: posts.map((post) => ({ params: { slug: post.slug } })),
        fallback: false,
    };
};

export default function BlogPost({ post }: { post: BlogPost }) {
    const router = useRouter();

    return (
        <article className="prose max-w-2xl mx-auto">
            <Link href="/blog">← Back to Blog</Link>
            <h1>{post.title}</h1>
            <time>{post.date}</time>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Search with Query Parameters</h2>
                <p>Handle search queries using URL parameters:</p>
                <CodeBlock
                    code={`// src/pages/search.tsx
import { useRouter, Link } from "heliumts/client";
import { useState, useEffect } from "react";

export default function SearchPage() {
    const router = useRouter();
    const query = router.searchParams.get("q") || "";
    const category = router.searchParams.get("category") || "all";
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (query) {
            fetchResults(query, category).then(setResults);
        }
    }, [query, category]);

    const handleSearch = (newQuery: string) => {
        router.push(\`/search?q=\${encodeURIComponent(newQuery)}&category=\${category}\`);
    };

    const handleCategoryChange = (newCategory: string) => {
        router.replace(\`/search?q=\${query}&category=\${newCategory}\`);
    };

    return (
        <div className="p-8">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(query); }}>
                <input
                    type="text"
                    defaultValue={query}
                    placeholder="Search..."
                    className="border p-2 rounded"
                />
                <select 
                    value={category} 
                    onChange={(e) => handleCategoryChange(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="docs">Documentation</option>
                    <option value="blog">Blog</option>
                </select>
            </form>

            <div className="mt-4">
                {results.map((result) => (
                    <Link 
                        key={result.id} 
                        href={result.url}
                        prefetch
                        className="block p-4 hover:bg-gray-50"
                    >
                        {result.title}
                    </Link>
                ))}
            </div>
        </div>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Authentication Guard</h2>
                <p>Protect routes with authentication using the Redirect component:</p>
                <CodeBlock
                    code={`// src/components/AuthGuard.tsx
import { Redirect } from "heliumts/client";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export default function AuthGuard({ 
    children, 
    redirectTo = "/login" 
}: AuthGuardProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Redirect to={redirectTo} replace />;
    }

    return <>{children}</>;
}

// Usage in a protected page
// src/pages/dashboard.tsx
import AuthGuard from "../components/AuthGuard";

export default function Dashboard() {
    return (
        <AuthGuard>
            <div>Protected Dashboard Content</div>
        </AuthGuard>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Breadcrumb Navigation</h2>
                <p>Build breadcrumbs based on the current route:</p>
                <CodeBlock
                    code={`// src/components/Breadcrumbs.tsx
import { useRouter, Link } from "heliumts/client";

export default function Breadcrumbs() {
    const router = useRouter();
    const segments = router.path.split("/").filter(Boolean);

    const crumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = segment
            .replace(/-/g, " ")
            .replace(/\\b\\w/g, (char) => char.toUpperCase());

        return { href, label };
    });

    return (
        <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" prefetch className="text-gray-500 hover:text-gray-700">
                Home
            </Link>
            {crumbs.map((crumb, index) => (
                <span key={crumb.href} className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    {index === crumbs.length - 1 ? (
                        <span className="text-gray-900 font-medium">{crumb.label}</span>
                    ) : (
                        <Link 
                            href={crumb.href} 
                            prefetch
                            className="text-gray-500 hover:text-gray-700"
                        >
                            {crumb.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Analytics Tracking</h2>
                <p>Track page views using router events:</p>
                <CodeBlock
                    code={`// src/components/Analytics.tsx
import { useRouter } from "heliumts/client";
import { useEffect } from "react";

export default function Analytics() {
    const router = useRouter();

    useEffect(() => {
        // Track initial page load
        trackPageView(router.path);

        // Track subsequent navigations
        const unsubscribe = router.on("routeChange", ({ path }) => {
            trackPageView(path);
        });

        return () => unsubscribe();
    }, []);

    return null;
}

function trackPageView(path: string) {
    // Send to your analytics service
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", "GA_MEASUREMENT_ID", {
            page_path: path,
        });
    }
}`}
                    language="tsx"
                />

                <p>Add the Analytics component to your root layout:</p>
                <CodeBlock
                    code={`// src/pages/_layout.tsx
import Analytics from "../components/Analytics";
import { PageTransition } from "heliumts/client";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Analytics />
            <PageTransition loadingClassName="opacity-60 transition-opacity">
                {children}
            </PageTransition>
        </div>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Navigation Loading Indicator</h2>
                <p>Show a progress bar during page transitions:</p>
                <CodeBlock
                    code={`// src/components/NavigationProgress.tsx
import { useRouter } from "heliumts/client";
import { useEffect, useState } from "react";

export default function NavigationProgress() {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (router.isNavigating) {
            setVisible(true);
            setProgress(30);

            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(timer);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 200);

            return () => clearInterval(timer);
        } else {
            setProgress(100);
            const hideTimer = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);

            return () => clearTimeout(hideTimer);
        }
    }, [router.isNavigating]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
            <div
                className="h-full bg-teal-500 transition-all duration-200"
                style={{ width: \`\${progress}%\` }}
            />
        </div>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Scroll Restoration</h2>
                <p>Control scroll behavior when navigating between pages:</p>
                <CodeBlock
                    code={`// Scroll to top on navigation (default behavior)
<Link href="/about" scrollToTop>
    About
</Link>

// Preserve scroll position
<Link href="/about" scrollToTop={false}>
    About
</Link>

// Programmatic navigation with scroll control
router.push("/about", { scrollToTop: true });
router.push("/settings", { scrollToTop: false });`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">Related</h2>
                <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                        <Link href="/docs/core-concepts/routing">Routing Overview</Link> - File-based routing basics
                    </li>
                    <li>
                        <Link href="/docs/core-concepts/routing/navigation">Navigation</Link> - Link component and programmatic navigation
                    </li>
                    <li>
                        <Link href="/docs/core-concepts/routing/use-router">useRouter Hook</Link> - Router API reference
                    </li>
                    <li>
                        <Link href="/docs/core-concepts/routing/transitions">Page Transitions</Link> - Smooth navigation transitions
                    </li>
                </ul>
            </section>
        </div>
    );
}
