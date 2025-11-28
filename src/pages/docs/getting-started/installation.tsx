"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function Installation() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Installation</h1>
            <p>An installation script is coming soon! Meanwhile, follow these steps to set up a new HeliumJS project.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">1. Install React + Vite</h3>
            <CodeBlock code="npm create vite@latest my-helium-app -- --template react-ts" language="bash" />

            <h3 className="text-xl font-semibold text-gray-900 mt-6">2. Install HeliumJS</h3>
            <CodeBlock code="npm install github:heliobentes/heliumjs" language="bash" />
            <p className="text-sm text-gray-500">NPM package is coming soon!</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">3. Setup Vite Config</h3>
            <p>
                Create or update <code>vite.config.ts</code> in the project root to include Helium's Vite plugin:
            </p>
            <CodeBlock
                code={`import react from '@vitejs/plugin-react';
import helium from 'helium/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), helium()]
});`}
                language="typescript"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-6">4. Delete main.tsx</h3>
            <p>
                Delete the <code>src/main.tsx</code> file created by Vite, as HeliumJS handles the client entry point automatically. Also, remove its reference from{" "}
                <code>index.html</code> if present.
            </p>
            <CodeBlock code={`<!-- Remove this from index.html -->\n<script type="module" src="/src/main.tsx"></script>`} language="html" />

            <h3 className="text-xl font-semibold text-gray-900 mt-6">5. Update src/App.tsx</h3>
            <p>
                Update the <code>src/App.tsx</code> file created by Vite, to use Helium's <code>AppShellProps</code>:
            </p>
            <CodeBlock
                code={`import { type AppShellProps } from "helium/client";
export default function App({ Component, pageProps }: AppShellProps) {
    return <Component {...pageProps} />;
}`}
                language="tsx"
            />

            <h3 className="text-xl font-semibold text-gray-900 mt-6">6. Create the server and pages folders</h3>
            <p>
                Create <code>src/server</code> and <code>src/pages</code> folders to hold your server-side logic and client-side pages, respectively.
            </p>

            <div className="prose prose-teal max-w-none">
                <div className="bg-yellow-50 border border-yellow-600 text-yellow-900 rounded-lg px-4 py-3 mb-6 text-sm">
                    <strong>Note:</strong>
                    <p>
                        For your RPC methods to be type-safe and your IDE recognize Helium imports, make sure you are running the development server with{" "}
                        <code>npx helium dev</code> as described below.
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Running the Development Server</h2>
            <CodeBlock code="npx helium dev" language="bash" />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Building for Production</h2>
            <CodeBlock code="npx helium build" language="bash" />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Starting the Production Server</h2>
            <CodeBlock code="npx helium start" language="bash" />
        </div>
    );
}
