"use ssg";
import Heading from "../../../components/Heading";

export default function Introduction() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Introduction</Heading>
            <p className="text-lg text-gray-700">
                HeliumTS is an opinionated full-stack React + Vite framework focused on type-safe RPC, file-based routing, and flexible rendering modes for modern apps.
            </p>

            <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 my-6">
                <Heading level={3} className="text-teal-900 mb-2">
                    Check out the Example App
                </Heading>
                <p className="text-teal-800 mb-4">See HeliumTS in action with a fully functional example application including authentication, database integration, and more.</p>
                <a href="https://github.com/heliobentes/heliumts-example-app" target="_blank" rel="noopener noreferrer" className="button primary">
                    View Example on GitHub &rarr;
                </a>
            </div>

            <Heading level={2} className="mt-8">
                Why HeliumTS?
            </Heading>
            <p>
                Building a full-stack React app usually means stitching together routing, data fetching, server APIs, background jobs, and deployment concerns. HeliumTS brings
                those pieces together behind one runtime and one project structure.
            </p>

            <ul className="space-y-4 mt-4">
                <li className="flex gap-3">
                    <span className="text-2xl">🔌</span>
                    <div>
                        <strong className="block text-gray-900">Seamless RPC</strong>
                        <span className="text-gray-600">
                            Call server functions directly from your React components with full type safety. No more <code>fetch</code> or <code>axios</code> boilerplate.
                        </span>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="text-2xl">📂</span>
                    <div>
                        <strong className="block text-gray-900">File-based Routing</strong>
                        <span className="text-gray-600">
                            Intuitive routing system similar to Next.js. Just create files in <code>src/pages</code> and they become routes.
                        </span>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="text-2xl">⚡</span>
                    <div>
                        <strong className="block text-gray-900">Vite Powered</strong>
                        <span className="text-gray-600">Built on top of Vite for lightning fast development server and optimized production builds.</span>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="text-2xl">🧩</span>
                    <div>
                        <strong className="block text-gray-900">Multiple Rendering Modes</strong>
                        <span className="text-gray-600">Mix SPA pages with SSG and SSR where it makes sense, instead of forcing the whole app into one rendering model.</span>
                    </div>
                </li>
                <li className="flex gap-3">
                    <span className="text-2xl">🛡️</span>
                    <div>
                        <strong className="block text-gray-900">End-to-End Type Safety</strong>
                        <span className="text-gray-600">Share types between client and server automatically. If your server code changes, your client knows about it.</span>
                    </div>
                </li>
            </ul>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                <Heading level={3} className="mb-2">
                    Core building blocks
                </Heading>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>RPC methods for type-safe server calls.</li>
                    <li>HTTP handlers for webhooks, auth flows, and REST endpoints.</li>
                    <li>Workers for long-running background processing.</li>
                    <li>Route groups and nested layouts for larger applications.</li>
                    <li>SSR and SSG when you need first-load HTML.</li>
                </ul>
            </div>
        </div>
    );
}
