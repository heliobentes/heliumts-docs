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
                    <span className="text-teal-600 text-sm font-medium text-center lg:text-left">Type-safe server methods for React</span>
                    <h1 className="text-4xl font-semibold w-full my-2 text-center lg:text-left">Build full stack React apps with Vite and typed RPC</h1>
                    <p className="text-lg text-gray-500 text-center lg:text-left">
                        Designed for simplicity and type safety, it provides seamless RPC, file-based routing, SSR, and SSG.
                    </p>
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
                        <button
                            type="button"
                            aria-pressed={file === "server"}
                            className={cn("text-medium rounded-full px-3 py-1 cursor-pointer  transition-all", file === "server" ? "bg-teal-600 text-white" : "hover:bg-gray-300")}
                            onClick={() => setFile("server")}
                        >
                            /server/tasks.ts
                        </button>
                        <button
                            type="button"
                            aria-pressed={file === "pages"}
                            className={cn("text-medium rounded-full px-3 py-1 cursor-pointer  transition-all", file === "pages" ? "bg-teal-600 text-white" : "hover:bg-gray-300")}
                            onClick={() => setFile("pages")}
                        >
                            /pages/tasks.tsx
                        </button>
                    </div>

                    <CodeBlock code={file === "server" ? serverCode : clientCode} language={file === "server" ? "ts" : "tsx"} />
                    <Link href="https://github.com/heliobentes/heliumts-example-app" target="_blank" className="text-sm text-teal-600 hover:underline mt-4 ml-auto">
                        See working example <IconExternalLink className="inline-block size-4 mb-1 ml-1" />
                    </Link>
                </div>
            </div>
            <div className="pt-10 border-t border-gray-200">
                <h2 className="text-3xl font-semibold text-center my-6">Typed calls and streaming over HTTP</h2>
                <p className="text-lg text-gray-500 text-center mt-2 max-w-3xl mx-auto">
                    Use one server-method API for queries, mutations, and incremental replies. Helium handles HTTP requests, MessagePack, batching, and typed chunks so your React
                    components can focus on the interface.
                </p>
                <div className="py-10 max-w-4xl mx-auto">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 text-center">
                        <h3 className="text-xl font-semibold mb-3">Stream a reply with useStreaming</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Define an async generator with defineMethod, then start, cancel, and restart it from a typed React hook. Try a deterministic demo with no API key or
                            database.
                        </p>
                        <div className="mt-6">
                            <Link href="/streaming" className="button primary">
                                Try streaming
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 border-t border-gray-200">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-4 text-teal-600">
                            <IconBolt size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Zero-API Boilerplate</h3>
                        <p className="text-gray-500">
                            Call typed server methods from your components with useFetch, useCall, and useStreaming, without writing custom request plumbing.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-teal-100 p-3 rounded-full mb-4 text-teal-600">
                            <IconFileTypeTs size={32} />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">End-to-End Type Safety</h3>
                        <p className="text-gray-500">Infer method arguments and results from server to client while keeping runtime validation in your server handlers.</p>
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
                        <p className="text-gray-500">Built-in support for SSR, SSG, custom HTTP handlers, middleware, and more.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
