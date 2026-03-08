"use ssg";

import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function PageTransitions() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Page Transitions</Heading>

            <section className="space-y-4">
                <Heading level={2}>Overview</Heading>
                <p>Helium provides built-in support for smooth page transitions using React 18+ concurrent features. This prevents UI freezing when navigating to heavy pages.</p>

                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="font-semibold text-teal-800 mb-2">How It Works:</p>
                    <ol className="list-decimal list-inside space-y-1 text-teal-700">
                        <li>
                            <strong>Lazy Loading:</strong> Pages are automatically code-split and lazy-loaded
                        </li>
                        <li>
                            <strong>Prefetching:</strong> Link components prefetch pages on hover/focus
                        </li>
                        <li>
                            <strong>Deferred Rendering:</strong> React renders new pages in the background
                        </li>
                        <li>
                            <strong>Visual Feedback:</strong> Old content fades while new content loads
                        </li>
                        <li>
                            <strong>No Blocking:</strong> UI remains responsive during heavy page renders
                        </li>
                    </ol>
                </div>
            </section>

            <section className="space-y-4">
                <Heading level={2}>PageTransition Component</Heading>
                <p>
                    Transition APIs are exported from <code>heliumts/client/transitions</code>. The <code>PageTransition</code> component handles navigation transition complexity
                    with a simple API:
                </p>
                <CodeBlock
                    code={`import { PageTransition } from "heliumts/client/transitions";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Header />
            <PageTransition
                loadingClassName="opacity-50 transition-opacity"
                fallback={<LoadingSpinner />}
            >
                {children}
            </PageTransition>
            <Footer />
        </div>
    );
}`}
                    language="tsx"
                />

                <Heading level={3}>Props</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>children</code> (ReactNode): Content to wrap
                    </li>
                    <li>
                        <code>loadingClassName</code> (string, optional): CSS class applied during transitions
                    </li>
                    <li>
                        <code>loadingStyle</code> (CSSProperties, optional): Inline styles applied during transitions
                    </li>
                    <li>
                        <code>fallback</code> (ReactNode, optional): Suspense fallback for lazy-loaded pages
                    </li>
                </ul>

                <Heading level={3}>With Tailwind CSS</Heading>
                <CodeBlock
                    code={`<PageTransition
    loadingClassName="opacity-60 transition-opacity duration-150"
    fallback={<div className="animate-pulse">Loading...</div>}
>
    {children}
</PageTransition>`}
                    language="tsx"
                />

                <Heading level={3}>With Inline Styles</Heading>
                <CodeBlock
                    code={`<PageTransition
    loadingStyle={{ opacity: 0.6, transition: 'opacity 150ms ease' }}
>
    {children}
</PageTransition>`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>useDeferredNavigation Hook</Heading>
                <p>
                    For more control, the <code>useDeferredNavigation</code> hook integrates <code>useDeferredValue</code> and <code>useTransition</code> with the router:
                </p>
                <CodeBlock
                    code={`import { useDeferredNavigation } from "heliumts/client/transitions";

export default function Layout({ children }: { children: React.ReactNode }) {
    const { isStale, isPending, isTransitioning } = useDeferredNavigation();

    return (
        <div style={{ opacity: isTransitioning ? 0.7 : 1, transition: 'opacity 150ms' }}>
            {children}
        </div>
    );
}`}
                    language="tsx"
                />

                <Heading level={3}>Returned Values</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <code>path</code> (string): Current path being navigated to
                    </li>
                    <li>
                        <code>deferredPath</code> (string): Deferred path (may lag behind during transitions)
                    </li>
                    <li>
                        <code>isStale</code> (boolean): True when showing old content while new page renders
                    </li>
                    <li>
                        <code>isPending</code> (boolean): True when a navigation transition is in progress
                    </li>
                    <li>
                        <code>isTransitioning</code> (boolean): True when either navigating or showing stale content
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Global Loading Indicator</Heading>
                <p>Create a top loading bar that shows during navigation:</p>
                <CodeBlock
                    code={`// src/components/NavigationLoader.tsx
import { useRouter } from "heliumts/client";

export default function NavigationLoader() {
    const router = useRouter();

    if (!router.isNavigating) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-teal-500 animate-pulse" />
        </div>
    );
}`}
                    language="tsx"
                />

                <p>Use it in your root layout:</p>
                <CodeBlock
                    code={`// src/pages/_layout.tsx
import NavigationLoader from "../components/NavigationLoader";
import { PageTransition } from "heliumts/client/transitions";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <NavigationLoader />
            <header>Global Header</header>
            <PageTransition loadingClassName="opacity-60 transition-opacity duration-150">
                {children}
            </PageTransition>
            <footer>Global Footer</footer>
        </div>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Using isPending for Visual Feedback</Heading>
                <p>
                    Use <code>router.isPending</code> to show visual feedback when content is stale:
                </p>
                <CodeBlock
                    code={`import { useRouter } from "heliumts/client";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <div 
            className="transition-opacity duration-150"
            style={{ opacity: router.isPending ? 0.7 : 1 }}
        >
            {children}
        </div>
    );
}`}
                    language="tsx"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Best Practices</Heading>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>
                        <strong>Use PageTransition in root layout</strong>: Wrap your main content area for consistent transitions
                    </li>
                    <li>
                        <strong>Keep transitions subtle</strong>: 150-200ms opacity transitions work well
                    </li>
                    <li>
                        <strong>Provide a fallback</strong>: Show a loading skeleton for initial page loads
                    </li>
                    <li>
                        <strong>Don't over-animate</strong>: Simple opacity changes are usually sufficient
                    </li>
                </ol>
            </section>
        </div>
    );
}
