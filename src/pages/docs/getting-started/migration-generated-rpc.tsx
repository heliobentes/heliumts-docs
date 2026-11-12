"use ssg";
import { Link } from "heliumts/client";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function GeneratedRpcMigration() {
    return (
        <article className="space-y-6">
            <Heading level={1}>Migrate from 0.10.2</Heading>
            <p>
                The 0.11.0 release replaces browser RPC imports from <code>heliumts/server</code> with a generated module in your application. Use matching framework and scaffolder
                versions when upgrading.
            </p>
            <Heading level={2}>Update browser imports</Heading>
            <CodeBlock
                language="tsx"
                code={`// src/pages/tasks.tsx
import { useFetch, useCall } from "heliumts/client";
import { getTasks, saveTask } from "../rpc.generated";

// Server implementations stay in src/server.
// Keep importing defineMethod from "heliumts/server" there.`}
            />
            <p>
                Delete the obsolete generated <code>src/types/heliumts-server.d.ts</code>. Do not edit the new generated module by hand or import application server implementations
                into browser components.
            </p>
            <CodeBlock
                language="bash"
                code={`npx helium typegen
npx helium check
npm run build`}
            />
            <p>
                <code>typegen</code> discovers explicit server exports without executing application modules. It supports aliases and relative server re-exports; arbitrary wrapper
                factories, computed calls and tsconfig path aliases are not inferred. Keep an explicit <code>defineMethod</code> export at the discovery boundary.
            </p>
            <Heading level={2}>Verify behavior, not just types</Heading>
            <ul className="list-disc space-y-2 pl-6">
                <li>Keep server input parsers, authentication, ownership checks and rate limits. TypeScript alone cannot validate a network request.</li>
                <li>Catch rejected mutation promises in event handlers and render the hook’s error state.</li>
                <li>Invalidate detail, lists and summaries affected by a successful mutation. Test returning to a cached page.</li>
                <li>Retain streaming cancellation and cleanup. Rebuild and deploy matching clients and servers.</li>
            </ul>
            <Heading level={2}>Scaffolding and compatibility</Heading>
            <p>
                The new scaffolder defaults to a minimal app. Add <code>-- --template examples</code> for the larger demonstration template. Normal Helium commands retain Node 20
                support subject to your Vite version’s requirements.
            </p>
            <p>
                Coming from 0.9? Apply the{" "}
                <Link href="/docs/getting-started/migration-0-10" className="text-teal-700 underline">
                    HTTP transport migration
                </Link>{" "}
                too.
            </p>
        </article>
    );
}
