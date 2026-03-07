"use ssg";
import { useState } from "react";

import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";
import { cn } from "../../../utils";

export default function Installation() {
    const [mode, setMode] = useState<"default" | "manual">("default");

    return (
        <div className="space-y-6">
            <Heading level={1} className="text-3xl font-bold text-gray-900">
                Installation
            </Heading>

            <div className="flex gap-3 my-4 text-sm">
                <div
                    className={cn(
                        "text-medium rounded-full px-3 py-1 cursor-pointer transition-all",
                        mode === "default" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    )}
                    onClick={() => setMode("default")}
                >
                    Default
                </div>
                <div
                    className={cn(
                        "text-medium rounded-full px-3 py-1 cursor-pointer transition-all",
                        mode === "manual" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    )}
                    onClick={() => setMode("manual")}
                >
                    Manual
                </div>
            </div>

            {mode === "default" ? (
                <>
                    <p>
                        The fastest way to start is with the official scaffolding tool. It creates a working HeliumTS project with the runtime, routing, and build setup already
                        wired up.
                    </p>

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        Usage
                    </Heading>
                    <CodeBlock code="npm create heliumts-app@latest my-app" language="bash" />

                    <p className="mt-4">Or to scaffold in the current directory:</p>
                    <CodeBlock code="npm create heliumts-app@latest ." language="bash" />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        Options
                    </Heading>
                    <p>You can use flags to skip prompts:</p>
                    <div className="overflow-x-auto my-4 border border-gray-200 rounded-lg">
                        <table className="min-w-full text-sm text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-2 font-medium text-gray-900">Flag</th>
                                    <th className="px-4 py-2 font-medium text-gray-900">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                <tr>
                                    <td className="px-4 py-2 font-mono text-teal-600">--tailwind</td>
                                    <td className="px-4 py-2">Use Tailwind CSS template (skips prompt)</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-mono text-teal-600">--no-tailwind</td>
                                    <td className="px-4 py-2">Use basic template without Tailwind (skips prompt)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <CodeBlock
                        code={`# Use Tailwind CSS (default, skips prompt)
npm create heliumts-app@latest my-app -- --tailwind

# Use basic template without Tailwind (skips prompt)
npm create heliumts-app@latest my-app -- --no-tailwind`}
                        language="bash"
                    />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        What it does
                    </Heading>
                    <ul className="list-disc list-inside space-y-2 ml-2 text-gray-700">
                        <li>
                            Asks if you want to use <strong>Tailwind CSS</strong> (defaults to Yes)
                        </li>
                        <li>
                            Scaffolds a complete HeliumTS project with one of two templates:
                            <ul className="list-disc list-inside ml-6 mt-1 text-gray-600">
                                <li>
                                    <code>tailwind</code> - HeliumTS with Tailwind CSS pre-configured (default)
                                </li>
                                <li>
                                    <code>basic</code> - Standard HeliumTS setup
                                </li>
                            </ul>
                        </li>
                        <li>
                            Automatically runs <code>npm install</code>
                        </li>
                        <li>Leaves you with a project ready for RPC methods, file-based routing, and optional SSR or SSG pages.</li>
                    </ul>

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        After Installation
                    </Heading>
                    <CodeBlock code={`cd my-app\nnpm run dev`} language="bash" />
                </>
            ) : (
                <>
                    <p>If you want to understand the moving parts or integrate HeliumTS into an existing Vite app, use the manual setup flow.</p>

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        1. Install React + Vite
                    </Heading>
                    <CodeBlock code="npm create vite@latest my-helium-app -- --template react-ts" language="bash" />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        2. Install HeliumTS
                    </Heading>
                    <CodeBlock code="npm install heliumts" language="bash" />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        3. Setup Vite Config
                    </Heading>
                    <p>
                        Create or update <code>vite.config.ts</code> in the project root to include Helium's Vite plugin:
                    </p>
                    <CodeBlock
                        code={`import react from '@vitejs/plugin-react';
import helium from 'heliumts/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react(), helium()]
});`}
                        language="typescript"
                    />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        4. Delete main.tsx
                    </Heading>
                    <p>
                        Delete the <code>src/main.tsx</code> file created by Vite, as HeliumTS handles the client entry point automatically. Also, remove its reference from{" "}
                        <code>index.html</code> if present.
                    </p>
                    <CodeBlock code={`<!-- Remove this from index.html -->\n<script type="module" src="/src/main.tsx"></script>`} language="html" />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        5. Update src/App.tsx
                    </Heading>
                    <p>
                        Update the <code>src/App.tsx</code> file created by Vite, to use Helium's <code>AppShellProps</code>:
                    </p>
                    <CodeBlock
                        code={`import { type AppShellProps } from "heliumts/client";
export default function App({ Component, pageProps }: AppShellProps) {
    return <Component {...pageProps} />;
}`}
                        language="tsx"
                    />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        6. Create the server and pages folders
                    </Heading>
                    <p>
                        Create <code>src/server</code> and <code>src/pages</code> folders to hold your server-side logic and your file-based routes.
                    </p>

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        7. Add your first page
                    </Heading>
                    <CodeBlock
                        code={`export default function HomePage() {
    return (
        <div>
            <h1>Welcome to HeliumTS</h1>
            <p>Start building your app.</p>
        </div>
    );
}`}
                        language="tsx"
                    />

                    <div className="prose prose-teal max-w-none">
                        <div className="bg-yellow-50 border border-yellow-600 text-yellow-900 rounded-lg px-4 py-3 mb-6 text-sm">
                            <strong>Note:</strong>
                            <p>
                                For your RPC methods to be type-safe and your IDE recognize Helium imports, make sure you are running the development server with{" "}
                                <code>npx helium dev</code> as described below.
                            </p>
                        </div>
                    </div>

                    <Heading level={2} className="text-2xl font-semibold text-gray-900 mt-8">
                        Running the Development Server
                    </Heading>
                    <CodeBlock code="npx helium dev" language="bash" />

                    <Heading level={2} className="text-2xl font-semibold text-gray-900 mt-8">
                        Building for Production
                    </Heading>
                    <CodeBlock code="npx helium build" language="bash" />

                    <Heading level={2} className="text-2xl font-semibold text-gray-900 mt-8">
                        Starting the Production Server
                    </Heading>
                    <CodeBlock code="npx helium start" language="bash" />
                </>
            )}
        </div>
    );
}
