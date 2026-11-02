import { IconBrandGithub } from "@tabler/icons-react";
import type { LayoutProps } from "heliumts/client";
import { Link, useRouter } from "heliumts/client";
import { PageTransition } from "heliumts/client/transitions";

import ErrorBoundary from "../components/ErrorBoundary";
import HeliumLogo from "../components/Logo";
import PageLoader from "../components/PageLoader";
import { cn } from "../utils";

export default function RootLayout({ children }: LayoutProps) {
    const router = useRouter();

    return (
        <div className="flex min-h-screen flex-col bg-white text-slate-900">
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm">
                <div className="mx-auto flex h-17 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
                    <Link
                        href="/"
                        aria-label="HeliumTS home"
                        className="inline-flex shrink-0 items-center gap-2.5 rounded-md text-lg font-semibold tracking-tight text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                    >
                        <HeliumLogo />
                        HeliumTS
                    </Link>
                    <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium sm:gap-7">
                        <Link
                            href="/docs"
                            className={cn(
                                "rounded-sm transition-colors hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600",
                                router.path.startsWith("/docs") ? "text-teal-700" : "text-slate-500"
                            )}
                        >
                            Docs
                        </Link>
                        <Link
                            href="/streaming"
                            className={cn(
                                "rounded-sm transition-colors hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600",
                                router.path === "/streaming" ? "text-teal-700" : "text-slate-500"
                            )}
                        >
                            Playground
                        </Link>
                        <Link
                            href="https://github.com/heliobentes/heliumts"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="HeliumTS on GitHub"
                            className="hidden rounded-sm text-slate-500 transition-colors hover:text-slate-950 sm:inline-flex focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-600"
                        >
                            <IconBrandGithub size={21} aria-hidden="true" />
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="mx-auto w-full max-w-7xl flex-1">
                <ErrorBoundary>
                    <PageTransition loadingClassName="animate-pulse" fallback={<PageLoader />}>
                        {children}
                    </PageTransition>
                </ErrorBoundary>
            </main>
            <footer className="border-t border-slate-200/80">
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p>© {new Date().getFullYear()} HeliumTS · MIT License</p>
                    <nav aria-label="Footer navigation" className="flex gap-5">
                        <Link href="/docs" className="transition-colors hover:text-slate-700">
                            Documentation
                        </Link>
                        <Link href="https://github.com/heliobentes/heliumts" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-700">
                            GitHub
                        </Link>
                        <Link href="https://www.npmjs.com/package/heliumts" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-slate-700">
                            npm
                        </Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
