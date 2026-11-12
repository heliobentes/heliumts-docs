"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function Introduction() {
    return (
        <article className="space-y-6">
            <Heading level={1}>Build with HeliumTS</Heading>
            <p className="text-lg text-gray-700">
                HeliumTS connects React pages to TypeScript server methods in one Vite project. File routes, generated RPC references and built-in hooks give people and coding
                agents the same explicit application structure.
            </p>
            <Heading level={2}>The everyday workflow</Heading>
            <ol className="list-decimal space-y-3 pl-6">
                <li>
                    Define a server method with <code>defineMethod</code>. Validate unknown inputs and enforce authorization on the server.
                </li>
                <li>
                    Import its reference from <code>src/rpc.generated.ts</code> in the browser. Import hooks and routing from <code>heliumts/client</code>.
                </li>
                <li>
                    Read with <code>useFetch</code>, mutate with <code>useCall</code>, and invalidate every affected read. Render loading and error states; expose refresh when
                    users need it.
                </li>
                <li>
                    Add a file under <code>src/pages</code> for the URL. Choose client rendering, SSR or SSG per page.
                </li>
            </ol>
            <p>
                Normal application RPC needs no handwritten HTTP endpoint, fetch wrapper or separate TanStack Query setup. HTTP handlers remain available for webhooks, downloads
                and integrations that need an explicit HTTP contract. RPC uses HTTP; streaming uses length-prefixed MessagePack frames.
            </p>
            <div className="rounded-xl border border-teal-200 bg-teal-50 p-5">
                <Heading level={2}>Start small</Heading>
                <p className="mt-2">The 0.11.0 release starts with one page, one RPC method and plain CSS. Use matching 0.11.0 framework and scaffolder versions.</p>
                <CodeBlock
                    code={`npm create heliumts-app@latest my-app
cd my-app
npx helium typegen
npx helium check
npm run dev`}
                    language="bash"
                />
                <Link href="/docs/getting-started/installation" className="font-semibold text-teal-700 underline">
                    Installation and version compatibility
                </Link>
            </div>
            <Heading level={2}>Give your agent a precise starting point</Heading>
            <p>
                Read the project’s AGENTS.md, then one relevant task guide. Use <code>helium inspect</code> to locate app code and <code>helium api</code> for a framework
                signature. Run type checks and the behavior tests after edits. Type safety does not replace validation, permissions or cancellation.
            </p>
            <div className="flex flex-wrap gap-4 text-teal-700 underline">
                <Link href="/docs/ai">Agent workflow</Link>
                <Link href="/docs/core-concepts/rpc">RPC guide</Link>
                <Link href="/docs/cli">CLI reference</Link>
                <Link href="/docs/getting-started/migration-generated-rpc">Migrate from 0.10.2</Link>
            </div>
            <Heading level={2}>Use the rendering mode your page needs</Heading>
            <p>
                Interactive pages render in the browser by default. Add <code>"use ssr"</code> for request-time HTML or <code>"use ssg"</code> for build-time HTML. Use server-side
                or static props for initial data; browser RPC hooks do not fetch during server rendering.
            </p>
        </article>
    );
}
