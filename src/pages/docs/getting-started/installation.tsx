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

            <p>
                Use Node.js 20.19+ or 22.12+, React 18 or 19, and Vite 7. Use the 0.11 series of the framework and scaffolder together. These instructions target HeliumTS 0.11.1.
            </p>

            <div className="flex gap-3 my-4 text-sm">
                <button
                    type="button"
                    aria-pressed={mode === "default"}
                    className={cn(
                        "text-medium rounded-full px-3 py-1 cursor-pointer transition-all",
                        mode === "default" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    )}
                    onClick={() => setMode("default")}
                >
                    Default
                </button>
                <button
                    type="button"
                    aria-pressed={mode === "manual"}
                    className={cn(
                        "text-medium rounded-full px-3 py-1 cursor-pointer transition-all",
                        mode === "manual" ? "bg-teal-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                    )}
                    onClick={() => setMode("manual")}
                >
                    Manual
                </button>
            </div>

            {mode === "default" ? (
                <>
                    <CodeBlock code={`npm create heliumts-app@latest my-app\ncd my-app\nnpm run dev`} language="bash" />

                    <p>
                        The default template has one page, one RPC method, and plain CSS. Add <code>-- --template examples</code> to include the demo.
                    </p>
                    <p>
                        To scaffold in the current directory, use <code>.</code> as the app name and run <code>npm run dev</code> there.
                    </p>

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        Options
                    </Heading>
                    <p>
                        Pass scaffold flags after <code>--</code> when using <code>npm create</code>.
                    </p>
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
                                    <td className="px-4 py-2 font-mono text-teal-600">--template minimal | examples</td>
                                    <td className="px-4 py-2">Choose the minimal default or the larger demo</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-mono text-teal-600">--skip-install</td>
                                    <td className="px-4 py-2">
                                        Create files and run <code>npm install</code> yourself before starting the app
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-mono text-teal-600">--tailwind</td>
                                    <td className="px-4 py-2">Use Tailwind CSS</td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-2 font-mono text-teal-600">--no-tailwind</td>
                                    <td className="px-4 py-2">Use plain CSS</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <>
                    <p>If you want to understand the moving parts or integrate HeliumTS into an existing Vite app, use the manual setup flow.</p>

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        1. Install React + Vite
                    </Heading>
                    <CodeBlock code="npm create vite@7 my-helium-app -- --template react-ts" language="bash" />

                    <Heading level={3} className="text-xl font-semibold text-gray-900 mt-6">
                        2. Install HeliumTS
                    </Heading>
                    <CodeBlock
                        code={`npm install heliumts@^0.11.1
npm install --save-dev vite@^7.3.7`}
                        language="bash"
                    />

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
                            <strong>RPC imports by version</strong>
                            <p>
                                Version 0.10.2 generates <code>src/types/heliumts-server.d.ts</code> for browser RPC imports from <code>heliumts/server</code>. To upgrade to
                                0.11.0, switch browser RPC imports to <code>src/rpc.generated.ts</code>, delete the old generated declaration, and run <code>npx helium check</code>
                                .
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
