"use ssg";

import { IconBolt, IconExternalLink, IconFileTypeTs, IconRoute, IconServer } from "@tabler/icons-react";
import { Link } from "heliumts/client";
import { useState } from "react";

import CodeBlock from "../components/CodeBlock";
import { cn } from "../utils";

const serverCode = `import { defineMethod } from "heliumts/server";

export const getTasks = defineMethod(async (args?: { status?: string }) => {
    const filter = args?.status ? { status: args.status } : {};
    const tasks = await getTasksFromDB(filter);

    return tasks;
});`;

const clientCode = `import { useFetch } from "heliumts/client";
import { getTasks } from "heliumts/server";

export default function TasksPage() {
    const { data: tasks } = useFetch(getTasks, {
        status: "open",
    });

    return (
        <div className="flex flex-col gap-2">
            {tasks?.map((task) => (
                <div key={task.id}>{task.name}</div>
            ))}
        </div>
    );
}`;

export default function Home() {
    const [file, setFile] = useState<string>("server");
    return (
        <main className="space-y-6 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16 lg:py-8">
                <div className="flex flex-col justify-center items-center lg:items-start py-10 lg:col-span-3">
                    <span className="text-teal-600 text-sm font-medium text-center lg:text-left">🚀 Up to 2x faster than HTTP</span>
                    <h1 className="text-4xl font-semibold w-full my-2 text-center lg:text-left">Blazing fast and opinionated full-stack React + Vite framework</h1>
                    <p className="text-lg text-gray-500 text-center lg:text-left">Designed for simplicity and type safety, it provides seamless RPC + pages routing.</p>
                    <Link href="/docs" className="button primary mt-6">
                        Get Started
                    </Link>
                </div>
                <div className="bg-gray-200 p-3 rounded-lg flex flex-col lg:col-span-4">
                    <div className="flex gap-2">
                        <span className="border-2 border-gray-400 rounded-full size-3" />
                        <span className="border-2 border-gray-400 rounded-full size-3" />
                        <span className="border-2 border-gray-400 rounded-full size-3" />
                    </div>
                    <div className="flex gap-3 my-4 text-sm">
                        <div
                            className={cn("text-medium rounded-full px-3 py-1 cursor-pointer  transition-all", file === "server" ? "bg-teal-600 text-white" : "hover:bg-gray-300")}
                            onClick={() => setFile("server")}
                        >
                            /server/tasks.ts
                        </div>
                        <div
                            className={cn("text-medium rounded-full px-3 py-1 cursor-pointer  transition-all", file === "pages" ? "bg-teal-600 text-white" : "hover:bg-gray-300")}
                            onClick={() => setFile("pages")}
                        >
                            /pages/tasks.tsx
                        </div>
                    </div>

                    <CodeBlock code={file === "server" ? serverCode : clientCode} language={file === "server" ? "ts" : "tsx"} />
                    <Link href="https://github.com/heliobentes/heliumts/-example-app" target="_blank" className="text-sm text-teal-600 hover:underline mt-4 ml-auto">
                        See working example <IconExternalLink className="inline-block size-4 mb-1 ml-1" />
                    </Link>
                </div>
            </div>
            <div className="pt-10 border-t border-gray-200">
                <h2 className="text-3xl font-semibold text-center my-6">🚀 Up to 2x faster than HTTP</h2>
                <p className="text-lg text-gray-500 text-center mt-2 max-w-3xl mx-auto">
                    HeliumTS replaces traditional HTTP requests with a high-performance binary protocol over WebSockets. By eliminating handshake overhead and minimizing payload
                    size, it delivers significantly lower latency and superior throughput.
                </p>

                <div className="py-10 max-w-4xl mx-auto">
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Network</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RPC Avg (ms)</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HTTP Avg (ms)</th>
                                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Improvement</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Fast Internet</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">150</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">170</td>
                                    <td className="py-4 px-6 text-sm text-green-600 font-semibold">1.1x</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Slow 4G</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">390</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">600</td>
                                    <td className="py-4 px-6 text-sm text-green-600 font-semibold">1.5x</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">3G</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">970</td>
                                    <td className="py-4 px-6 text-sm text-gray-500">2120</td>
                                    <td className="py-4 px-6 text-sm text-green-600 font-semibold">2.2x</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-gray-400 text-xs text-center mt-2">Test made by listing 1000 tasks from the database 50x</p>
                    <div className="mt-8 text-center">
                        <Link href="/speed-test" className="button primary">
                            Test it yourself
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-t border-gray-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-4 text-teal-600">
                            <IconBolt size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Zero-API Boilerplate</h3>
                        <p className="text-gray-500">Call server functions directly from your client components. No fetch, no axios, no glue code.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-4 text-teal-600">
                            <IconFileTypeTs size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">End-to-End Type Safety</h3>
                        <p className="text-gray-500">Automatic type inference from server to client. If it compiles, it works.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-4 text-teal-600">
                            <IconRoute size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">File-based Routing</h3>
                        <p className="text-gray-500">Intuitive file-system routing similar to Next.js Pages Router. Simple and effective.</p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-4 text-teal-600">
                            <IconServer size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Full-Stack Capabilities</h3>
                        <p className="text-gray-500">Built-in support for SSG, custom HTTP handlers, middleware, and more.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
