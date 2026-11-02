"use ssg";

import { IconArrowRight, IconBrandGithub, IconCheck, IconCopy, IconFileTypeTs, IconRoute, IconServer } from "@tabler/icons-react";
import { Link } from "heliumts/client";
import { useState } from "react";

import CodeBlock from "../components/CodeBlock";

const installCommand = "npx create-heliumts-app my-app";
const serverCode = `import { defineMethod } from "heliumts/server";

export const greet = defineMethod(
    async ({ name }: { name: string }) =>
        \`Hello, \${name}!\`
);`;
const clientCode = `import { useFetch } from "heliumts/client";
import { greet } from "heliumts/server";

export default function Page() {
    const { data } = useFetch(greet, { name: "Helium" });
    return <h1>{data}</h1>;
}`;

const features = [
    { icon: IconFileTypeTs, title: "Typed calls", description: "Arguments and results stay in sync." },
    { icon: IconRoute, title: "Routes from files", description: "Pages and layouts follow your project." },
    { icon: IconServer, title: "SSR and static pages", description: "Choose how each page is rendered." },
];

export default function Home() {
    const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");

    const copyInstallCommand = async () => {
        try {
            await navigator.clipboard.writeText(installCommand);
            setCopyState("copied");
        } catch {
            setCopyState("failed");
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pb-20 lg:pt-20">
            <section className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
                <div className="min-w-0">
                    <p className="mb-5 flex items-center gap-2 text-sm font-medium text-teal-700">
                        <span className="size-1.5 rounded-full bg-teal-600" aria-hidden="true" />
                        Built on React + Vite
                    </p>
                    <h1 className="text-[2.65rem] leading-[1.08] font-semibold tracking-[-0.045em] text-slate-950 sm:text-6xl">
                        Call your server
                        <br />
                        from React.
                    </h1>
                    <p className="mt-5 max-w-sm text-lg leading-7 text-slate-500">Typed methods, file routes, and streamed responses. One Vite app.</p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link href="/docs/getting-started" className="button primary">
                            Get started <IconArrowRight size={16} aria-hidden="true" />
                        </Link>
                        <Link href="https://github.com/heliobentes/heliumts" target="_blank" rel="noopener noreferrer" className="button secondary">
                            <IconBrandGithub size={17} aria-hidden="true" /> GitHub
                        </Link>
                    </div>
                    <div className="mt-7 flex max-w-sm items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-3.5 pr-2">
                        <code className="min-w-0 flex-1 overflow-x-auto rounded-none bg-transparent p-0 text-[11px] whitespace-nowrap text-slate-600 sm:text-xs">
                            {installCommand}
                        </code>
                        <button
                            type="button"
                            onClick={() => void copyInstallCommand()}
                            aria-label={copyState === "copied" ? "Install command copied" : "Copy install command"}
                            className="shrink-0 cursor-pointer rounded-md p-2 text-slate-500 transition-colors hover:bg-white hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                        >
                            {copyState === "copied" ? <IconCheck size={16} aria-hidden="true" /> : <IconCopy size={16} aria-hidden="true" />}
                        </button>
                    </div>
                    <p role="status" className="mt-2 min-h-5 text-xs text-slate-500">
                        {copyState === "copied" ? "Copied. Paste it in your terminal." : copyState === "failed" ? "Select the command to copy it." : ""}
                    </p>
                </div>

                <div className="min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-[#282c34] shadow-sm">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
                        <span className="font-mono text-xs text-slate-300">src/server/hello.ts</span>
                        <span className="text-[10px] font-medium tracking-wider text-teal-300 uppercase">Server</span>
                    </div>
                    <div className="[&_pre]:rounded-none [&_pre]:bg-transparent [&_pre]:text-[11px] sm:[&_pre]:text-xs">
                        <CodeBlock code={serverCode} language="typescript" />
                    </div>
                    <div className="flex items-center justify-between border-y border-white/10 bg-white/[0.025] px-5 py-3">
                        <span className="font-mono text-xs text-slate-300">src/pages/index.tsx</span>
                        <span className="text-[10px] font-medium tracking-wider text-slate-400 uppercase">Client</span>
                    </div>
                    <div className="[&_pre]:rounded-none [&_pre]:bg-transparent [&_pre]:text-[11px] sm:[&_pre]:text-xs">
                        <CodeBlock code={clientCode} language="tsx" />
                    </div>
                    <div className="border-t border-white/10 px-5 py-3 font-mono text-xs text-teal-300">→ Hello, Helium!</div>
                </div>
            </section>

            <section aria-label="Framework features" className="mt-14 grid gap-7 border-t border-slate-200 pt-8 sm:grid-cols-3 sm:gap-8 lg:mt-16">
                {features.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex items-start gap-3">
                        <Icon size={20} stroke={1.7} className="mt-0.5 shrink-0 text-teal-700" aria-hidden="true" />
                        <div>
                            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
                        </div>
                    </div>
                ))}
            </section>

            <section className="mt-12 flex flex-col gap-6 rounded-xl bg-slate-950 px-6 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <div>
                    <p className="mb-2 flex items-center gap-2 text-xs font-medium text-teal-300">
                        <span className="size-1.5 rounded-full bg-teal-400" aria-hidden="true" /> Live playground
                    </p>
                    <h2 className="text-xl font-medium tracking-tight text-white">See streaming in action.</h2>
                    <p className="mt-1.5 text-sm text-slate-400">Start a reply. Stop it midway. Keep what arrived.</p>
                </div>
                <Link
                    href="/streaming"
                    className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-lg bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-400 sm:self-auto"
                >
                    Try streaming <IconArrowRight size={16} aria-hidden="true" />
                </Link>
            </section>
        </div>
    );
}
