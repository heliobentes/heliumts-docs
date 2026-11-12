"use ssg";

import {
    IconArrowDown,
    IconArrowRight,
    IconArrowUpRight,
    IconBook2,
    IconBrandGithub,
    IconCode,
    IconLayoutGrid,
    IconRoute,
    IconSparkles,
    IconTerminal,
    IconWaveSine,
} from "@tabler/icons-react";
import { Link } from "heliumts/client";

import CodeBlock from "../components/CodeBlock";

const serverCode = `import { defineMethod } from "heliumts/server";

export const getTask = defineMethod(() => ({
    title: "Ship the app",
}));`;

const clientCode = `import { useFetch } from "heliumts/client";
import { getTask } from "../rpc.generated";

export default function TasksPage() {
    const { data, isLoading, error, refetch } = useFetch(getTask);
    if (isLoading) return <p role="status">Loading…</p>;
    if (error) return <p role="alert">{error}</p>;
    return <>
        <h1>{data?.title}</h1>
        <button onClick={() => void refetch()}>Refresh</button>
    </>;
}`;

const features = [
    {
        title: "One typed contract",
        description: "Define the method on the server. Generated references preserve argument and result types; hooks expose loading, errors, refresh and invalidation.",
        href: "/docs/core-concepts/rpc",
        link: "Explore RPC",
        icon: IconCode,
    },
    {
        title: "Routes from files",
        description: "Add a page under src/pages to create a route. Organize growing apps with nested layouts and route groups.",
        href: "/docs/core-concepts/routing",
        link: "Explore routing",
        icon: IconRoute,
    },
    {
        title: "Rendering per page",
        description: "Use client rendering for interactive pages, prebuild static pages, or render fresh HTML on the server.",
        href: "/docs/core-concepts/ssr",
        link: "Explore server rendering",
        icon: IconLayoutGrid,
    },
];

export default function Home() {
    return (
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-8 sm:pt-10">
            <section
                aria-labelledby="home-title"
                className="relative isolate overflow-hidden rounded-3xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16"
            >
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(var(--color-teal-200)_1px,transparent_1px)] bg-size-[20px_20px] [mask-image:radial-gradient(ellipse_at_center,transparent_35%,black)]"
                />
                <p className="mb-5 flex items-center justify-center gap-2 text-xs font-semibold tracking-widest text-teal-700 uppercase">
                    <span aria-hidden="true" className="size-2 rounded-full bg-teal-500" />
                    React · Vite · TypeScript
                </p>
                <h1 id="home-title" className="text-4xl leading-[1.06] font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl lg:text-6xl">
                    Build React apps
                    <br className="hidden sm:block" /> <span className="text-teal-700">with your AI agent</span>
                </h1>
                <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-pretty text-gray-600 sm:text-lg">
                    One React + Vite project. Typed server methods, generated RPC references and file routes give you and your coding agent a direct path from a feature to working
                    code.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
                    <Link href="/docs/getting-started/installation" className="button primary">
                        <span className="inline-flex items-center gap-2">
                            Create an app <IconArrowRight size={16} aria-hidden="true" />
                        </span>
                    </Link>
                    <a href="#example" className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline">
                        See the example <IconArrowDown size={16} aria-hidden="true" />
                    </a>
                </div>
            </section>

            <section id="example" aria-labelledby="example-title" className="mt-12 scroll-mt-36 sm:mt-16 lg:scroll-mt-24">
                <div className="max-w-2xl">
                    <h2 id="example-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        A server method. A React page.
                    </h2>
                    <p className="mt-3 text-gray-600">
                        Call a generated reference with the built-in hook. For normal application reads and mutations, you do not author an HTTP endpoint, fetch wrapper or TanStack
                        Query setup. HeliumTS sends the RPC over HTTP. This example targets the 0.11.0 release.
                    </p>
                </div>
                <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="grid divide-y divide-gray-200 md:grid-cols-2 md:divide-x md:divide-y-0">
                        <div className="min-w-0 p-4 lg:p-5">
                            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                <h3 className="text-sm font-semibold">
                                    <span className="mr-1.5 font-mono text-xs text-teal-700">01</span> Define a method
                                </h3>
                                <span className="font-mono text-xs text-gray-600">src/server/tasks.ts</span>
                            </div>
                            <CodeBlock code={serverCode} language="ts" compact />
                        </div>
                        <div className="min-w-0 p-4 lg:p-5">
                            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                                <h3 className="text-sm font-semibold">
                                    <span className="mr-1.5 font-mono text-xs text-teal-700">02</span> Create the React page
                                </h3>
                                <span className="inline-flex flex-wrap items-center gap-1.5 font-mono text-xs text-gray-600">
                                    <span>src/pages/tasks.tsx</span>
                                    <IconArrowRight size={14} aria-hidden="true" />
                                    <span className="sr-only"> becomes </span>
                                    <span className="rounded bg-teal-50 px-1.5 py-0.5 font-semibold text-teal-800">/tasks</span>
                                </span>
                            </div>
                            <CodeBlock code={clientCode} language="tsx" compact />
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-teal-100 bg-teal-50 px-4 py-3 text-sm lg:px-5">
                        <span className="text-xs font-medium text-gray-600">
                            Output at <span className="font-mono">/tasks</span>
                        </span>
                        <span className="font-mono text-teal-800">Ship the app</span>
                    </div>
                </div>
            </section>

            <section aria-labelledby="features-title" className="mt-14 sm:mt-18">
                <div className="max-w-2xl">
                    <h2 id="features-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        What comes with HeliumTS
                    </h2>
                    <p className="mt-3 text-gray-600">The pieces you need to connect a React interface to your server and ship it as one app.</p>
                </div>
                <div className="mt-6 grid divide-y divide-gray-200 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                    {features.map(({ title, description, href, link, icon: Icon }) => (
                        <div key={href} className="flex flex-col items-start p-5 lg:p-6">
                            <span className="mb-4 rounded-xl bg-teal-100 p-2.5 text-teal-700">
                                <Icon size={22} aria-hidden="true" />
                            </span>
                            <h3 className="text-lg font-semibold">{title}</h3>
                            <p className="mt-2 mb-4 text-sm leading-relaxed text-gray-600">{description}</p>
                            <Link href={href} className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 underline-offset-4 hover:underline">
                                {link} <IconArrowRight size={16} className="shrink-0" aria-hidden="true" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            <section aria-labelledby="agent-workflow-title" className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
                <div className="flex items-center gap-2 text-sm font-semibold text-teal-700">
                    <IconSparkles size={20} aria-hidden="true" /> Built for agent-assisted development
                </div>
                <h2 id="agent-workflow-title" className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                    Read the task. Inspect the contract. Verify the change.
                </h2>
                <p className="mt-3 max-w-3xl text-gray-600">
                    Short, source-synced guides cover one job at a time. The CLI locates application methods and routes without executing their modules, and returns precise public
                    API declarations.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-teal-700">
                    <Link href="/docs/ai" className="underline underline-offset-4">
                        Agent workflow
                    </Link>
                    <a href="/ai/index.md" className="underline underline-offset-4">
                        Task guide index
                    </a>
                    <Link href="/docs/cli" className="underline underline-offset-4">
                        CLI reference
                    </Link>
                </div>
                <p className="mt-5 text-sm text-gray-600">Types help with edits; server-side validation and authorization still protect your data.</p>
            </section>

            <section
                aria-labelledby="streaming-title"
                className="mt-10 grid gap-6 rounded-2xl border border-teal-200 bg-teal-50 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"
            >
                <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-widest text-teal-700 uppercase">
                        <IconWaveSine size={20} aria-hidden="true" /> Live demo
                    </div>
                    <h2 id="streaming-title" className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        Stream replies and progress
                    </h2>
                    <p className="mt-2 max-w-xl text-gray-700">Stream typed updates over HTTP to show chat replies as they’re generated and agent progress as it happens.</p>
                </div>
                <Link href="/streaming" className="button primary justify-self-start">
                    <span className="inline-flex items-center gap-2">
                        Open streaming demo <IconArrowRight size={16} aria-hidden="true" />
                    </span>
                </Link>
            </section>

            <section aria-labelledby="start-title" className="mt-14 grid gap-6 border-t border-gray-300 pt-8 sm:mt-18 lg:grid-cols-[1fr_0.85fr] lg:gap-12">
                <div className="min-w-0">
                    <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-teal-700">
                        <IconTerminal size={20} aria-hidden="true" /> Quick start
                    </div>
                    <h2 id="start-title" className="text-3xl font-semibold tracking-tight sm:text-4xl">
                        Create your first app
                    </h2>
                    <p className="mt-3 mb-4 text-gray-600">
                        Start from the minimal template in the 0.11.0 release, then add only the pages and methods your app needs. Use matching 0.11.0 framework and scaffolder
                        versions.
                    </p>
                    <CodeBlock code={`npm create heliumts-app@latest my-app\ncd my-app\nnpx helium typegen\nnpx helium check\nnpm run dev`} language="bash" compact />
                </div>
                <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white px-4 sm:px-5">
                    <Link href="/docs/getting-started/installation" className="group flex items-center gap-3 py-4 text-sm">
                        <IconBook2 size={20} className="shrink-0 text-teal-700" aria-hidden="true" />
                        <span className="flex-1">
                            <strong className="block font-semibold group-hover:text-teal-700">Installation guide</strong>
                            <span className="text-gray-600">Set up and run your project.</span>
                        </span>
                        <IconArrowRight size={18} className="shrink-0 text-teal-700" aria-hidden="true" />
                    </Link>
                    <a
                        href="https://github.com/heliobentes/create-heliumts-app/tree/main/templates/starters/examples"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 py-4 text-sm"
                    >
                        <IconBrandGithub size={20} className="shrink-0 text-teal-700" aria-hidden="true" />
                        <span className="flex-1">
                            <strong className="block font-semibold group-hover:text-teal-700">Example starter</strong>
                            <span className="text-gray-600">Explore the matching scaffolded example.</span>
                        </span>
                        <IconArrowUpRight size={18} className="shrink-0 text-teal-700" aria-hidden="true" />
                    </a>
                    <Link href="/docs/ai" className="group flex items-center gap-3 py-4 text-sm">
                        <IconSparkles size={20} className="shrink-0 text-teal-700" aria-hidden="true" />
                        <span className="flex-1">
                            <strong className="block font-semibold group-hover:text-teal-700">For AI Agents</strong>
                            <span className="text-gray-600">Start with a task guide and inspect the exact API.</span>
                        </span>
                        <IconArrowRight size={18} className="shrink-0 text-teal-700" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
