"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function SSG() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Static Site Generation (SSG)</h1>
            <p>HeliumTS supports Static Site Generation (SSG) through pre-rendering pages at build time.</p>
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
            <p>During build, Helium validates SSG pages and generates optimized static HTML files.</p>
        </div>
    );
}
