"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function SSG() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Static Site Generation (SSG)</Heading>
            <p>
                HeliumTS supports Static Site Generation by pre-rendering pages at build time. It is the right fit for pages that should ship real HTML but do not need request-time
                data.
            </p>
            <p>
                Add a <code>"use ssg";</code> directive at the top of your page component to enable SSG:
            </p>

            <p>
                <code>src/pages/about.tsx</code>
            </p>
            <CodeBlock
                code={`"use ssg";

import React from "react";

export default function AboutPage() {
    return (
        <div>
            <h1>About Us</h1>
            <p>This page is statically generated at build time.</p>
        </div>
    );
}`}
                language="typescript"
            />
            <p>During build, Helium validates SSG pages, renders them ahead of time, and writes static HTML into the build output.</p>

            <section className="space-y-4">
                <Heading level={2}>When to Use SSG</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Documentation, marketing pages, and other mostly static content.</li>
                    <li>Pages where SEO matters but the content changes infrequently.</li>
                    <li>Hybrid pages where the shell is static and dynamic data loads after hydration.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>How It Works</Heading>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>
                        Helium scans <code>src/pages</code> for files containing <code>"use ssg";</code>.
                    </li>
                    <li>Each page is checked for SSG compatibility.</li>
                    <li>The page is rendered at build time and written to the final output as HTML.</li>
                </ol>
            </section>

            <section className="space-y-4">
                <Heading level={2}>SSG vs SSR</Heading>
                <p>
                    Use SSG when the HTML can be generated once at build time. Use <code>"use ssr";</code> when the markup depends on per-request data such as authenticated users,
                    headers, or database lookups.
                </p>
            </section>
        </div>
    );
}
