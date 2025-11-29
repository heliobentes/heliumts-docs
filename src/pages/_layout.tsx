import { IconBrandGithubFilled, IconBrandNpm } from "@tabler/icons-react";
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
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
            <header className="border-b border-gray-300 bg-white sticky top-0 z-10 ">
                <div className="container mx-auto px-4 flex items-stretch lg:gap-8 flex-col lg:flex-row h-full ">
                    <div className="py-2 flex items-center text-2xl font-medium gap-3 cursor-pointer hover:opacity-70" onClick={() => router.push("/")}>
                        <HeliumLogo />
                        HeliumTS
                    </div>

                    <nav className="lg:ml-auto flex items-center h-16">
                        <Link
                            href="/"
                            className={cn(
                                "px-4 hover:bg-gray-50 h-full flex items-center transition-all border-b-3 hover:border-teal-600",
                                router.path === "/" ? "text-teal-600 font-semibold border-teal-600" : "text-gray-700 hover:text-teal-600 border-transparent"
                            )}
                        >
                            Home
                        </Link>
                        <Link
                            href="/docs"
                            className={cn(
                                "px-4 hover:bg-gray-50 h-full flex items-center transition-all border-b-3 hover:border-teal-600",
                                router.path.startsWith("/docs") ? "text-teal-600 font-semibold border-teal-600" : "text-gray-700 hover:text-teal-600 border-transparent"
                            )}
                        >
                            Docs
                        </Link>
                        <Link
                            href="https://github.com/heliobentes/heliumts/"
                            target="_blank"
                            className={cn(
                                "px-4 hover:bg-gray-50 h-full flex items-center transition-all border-b-3 hover:border-teal-600 text-gray-700 hover:text-teal-600 border-transparent"
                            )}
                        >
                            <IconBrandGithubFilled className="inline-block size-6 mr-1 -mt-1" />
                        </Link>

                        <Link
                            href="https://www.npmjs.com/package/heliumts"
                            target="_blank"
                            className={cn(
                                "px-4 hover:bg-gray-50 h-full flex items-center transition-all border-b-3 hover:border-teal-600 text-gray-700 hover:text-teal-600 border-transparent"
                            )}
                        >
                            <IconBrandNpm className="inline-block size-6 mr-1 -mt-1" />
                        </Link>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto flex-1">
                <ErrorBoundary>
                    <PageTransition loadingClassName="animate-pulse" fallback={<PageLoader />}>
                        {children}
                    </PageTransition>
                </ErrorBoundary>
            </main>
            <footer className="bg-white border-t border-gray-300 mt-10">
                <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm">
                    <div className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} HeliumTS. Released under the MIT License.</div>
                    <div className="flex gap-6">
                        <Link href="https://github.com/heliobentes/heliumts/" className="hover:text-teal-600 transition-colors">
                            GitHub
                        </Link>
                        <Link href="https://www.npmjs.com/package/heliumts" className="hover:text-teal-600 transition-colors" target="_blank" rel="noopener noreferrer">
                            NPM
                        </Link>
                        <Link href="/docs" className="hover:text-teal-600 transition-colors">
                            Documentation
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
