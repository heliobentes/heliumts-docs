"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function ProjectStructure() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Project Structure</Heading>
            <p>A typical HeliumTS project keeps routes, server code, and rendering concerns close together in one app:</p>
            <CodeBlock
                code={`src/
  pages/             # File-based routes
    index.tsx
    [id].tsx         # Dynamic routes
    [...slug].tsx    # Catch-all routes
    _layout.tsx      # Root layout
    (protected)/     # Route group (e.g., auth or app shell)
      dashboard.tsx
    profile.tsx      # Can opt into "use ssr"
    marketing.tsx    # Can opt into "use ssg"
  server/            # Server-side logic
    tasks.ts         # RPC methods for tasks
    auth.ts          # Auth-related methods
    webhooks.ts      # Webhook HTTP handlers
    workers/         # Background workers
      queueConsumer.ts
    _middleware.ts   # Server middleware
  components/        # React components
  types/             # Shared types
helium.config.ts     # Helium configuration
package.json         # NPM package file
vite.config.ts       # Vite configuration`}
                language="plaintext"
            />

            <p>
                The important distinction is that <code>src/pages</code> defines the UI and route tree, while <code>src/server</code> holds RPC methods, HTTP handlers, middleware,
                and workers.
            </p>
        </div>
    );
}
