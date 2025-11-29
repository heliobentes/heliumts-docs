import {
    IconAppWindow,
    IconArrowsShuffle,
    IconBolt,
    IconChevronDown,
    IconChevronRight,
    IconCloud,
    IconCloudDollar,
    IconCode,
    IconCursorText,
    IconDatabase,
    IconDeviceDesktopCode,
    IconExternalLink,
    IconFileCode,
    IconFolder,
    IconKeyframeAlignCenter,
    IconLink,
    IconMenu2,
    IconRoute,
    IconServer,
    IconSettings,
    IconShield,
    IconSparkles,
    IconTerminal,
    IconWorld,
    IconX,
} from "@tabler/icons-react";
import type { LayoutProps } from "heliumts/client";
import { Link, useRouter } from "heliumts/client";
import { useEffect, useState } from "react";

import { cn } from "../../utils";

interface MenuItem {
    title: React.ReactNode;
    icon: React.ComponentType<{ size: number }>;
    href: string;
    target?: string;
    subItems?: MenuItem[];
}

interface MenuSection {
    title: string;
    items?: MenuItem[];
    icon?: React.ComponentType<{ size: number }>;
    href?: string;
}

const menuItems: MenuSection[] = [
    {
        title: "Getting Started",
        items: [
            {
                title: "Introduction",
                icon: IconBolt,
                href: "/docs/getting-started",
            },
            {
                title: "Installation",
                icon: IconDeviceDesktopCode,
                href: "/docs/getting-started/installation",
            },
            {
                title: "Project Structure",
                icon: IconFolder,
                href: "/docs/getting-started/project-structure",
            },
            {
                title: (
                    <>
                        Example App <IconExternalLink size={16} />
                    </>
                ),
                icon: IconAppWindow,
                href: "https://github.com/heliobentes/heliumts-example-app",
                target: "_blank",
            },
        ],
    },
    {
        title: "Core Concepts",
        items: [
            { title: "RPC", icon: IconServer, href: "/docs/core-concepts/rpc" },
            {
                title: "Routing",
                icon: IconRoute,
                href: "/docs/core-concepts/routing",
                subItems: [
                    { title: "Overview", icon: IconRoute, href: "/docs/core-concepts/routing" },
                    { title: "Navigation", icon: IconLink, href: "/docs/core-concepts/routing/navigation" },
                    { title: "useRouter Hook", icon: IconCursorText, href: "/docs/core-concepts/routing/use-router" },
                    { title: "Layouts", icon: IconAppWindow, href: "/docs/core-concepts/routing/layouts" },
                    { title: "Page Transitions", icon: IconArrowsShuffle, href: "/docs/core-concepts/routing/transitions" },
                    { title: "Examples", icon: IconCode, href: "/docs/core-concepts/routing/examples" },
                ],
            },
            {
                title: "HTTP Handlers",
                icon: IconWorld,
                href: "/docs/core-concepts/http-handlers",
                subItems: [
                    { title: "Overview", icon: IconWorld, href: "/docs/core-concepts/http-handlers" },
                    { title: "Examples", icon: IconCode, href: "/docs/core-concepts/http-handlers/examples" },
                ],
            },
            { title: "Middleware", icon: IconKeyframeAlignCenter, href: "/docs/core-concepts/middleware" },
            { title: "Configuration", icon: IconSettings, href: "/docs/core-concepts/configuration" },
            { title: "SSG", icon: IconFileCode, href: "/docs/core-concepts/ssg" },
        ],
    },
    {
        title: "Guides",
        items: [
            { title: "Authentication", icon: IconShield, href: "/docs/guides/authentication" },
            { title: "Stripe Integration", icon: IconCloudDollar, href: "/docs/guides/stripe" },
            { title: "OpenAI API", icon: IconSparkles, href: "/docs/guides/openai" },
        ],
    },
    {
        title: "Advanced",
        items: [
            { title: "Context API", icon: IconDatabase, href: "/docs/advanced/context-api" },
            { title: "Proxy Config", icon: IconShield, href: "/docs/advanced/proxy-configuration" },
            { title: "Deployment", icon: IconCloud, href: "/docs/advanced/production-deployment" },
        ],
    },
    {
        title: "CLI Reference",
        icon: IconTerminal,
        href: "/docs/cli",
    },
];

export default function DocsLayout({ children }: LayoutProps) {
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(() => {
        // Auto-expand menus if on a subpage
        const expanded = new Set<string>();
        if (router.path.startsWith("/docs/core-concepts/routing")) {
            expanded.add("/docs/core-concepts/routing");
        }
        if (router.path.startsWith("/docs/core-concepts/http-handlers")) {
            expanded.add("/docs/core-concepts/http-handlers");
        }
        return expanded;
    });

    useEffect(() => {
        setIsMobileMenuOpen(false);
        // Auto-expand parent when navigating to a subpage
        if (router.path.startsWith("/docs/core-concepts/routing")) {
            setExpandedItems((prev) => new Set([...prev, "/docs/core-concepts/routing"]));
        }
        if (router.path.startsWith("/docs/core-concepts/http-handlers")) {
            setExpandedItems((prev) => new Set([...prev, "/docs/core-concepts/http-handlers"]));
        }
    }, [router.path]);

    const toggleExpanded = (href: string) => {
        setExpandedItems((prev) => {
            const next = new Set(prev);
            if (next.has(href)) {
                next.delete(href);
            } else {
                next.add(href);
            }
            return next;
        });
    };

    const isActive = (href: string) => router.path === href;
    const isActiveParent = (href: string) => router.path.startsWith(href + "/") || router.path === href;

    const renderMenuItem = (item: MenuItem) => {
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedItems.has(item.href);

        return (
            <div key={item.href}>
                <div className="flex items-center gap-1">
                    <Link
                        href={item.href}
                        target={item.target}
                        className={cn(
                            "flex-1 flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                            !hasSubItems && isActive(item.href)
                                ? "bg-teal-50 text-teal-700"
                                : isActiveParent(item.href) && hasSubItems
                                  ? "text-teal-600"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                    >
                        <item.icon size={18} />
                        {item.title}
                    </Link>
                    {hasSubItems && (
                        <button
                            onClick={() => toggleExpanded(item.href)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-teal-50 rounded-md cursor-pointer"
                            aria-label={isExpanded ? "Collapse submenu" : "Expand submenu"}
                        >
                            {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                        </button>
                    )}
                </div>
                {hasSubItems && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-2">
                        {item.subItems!.map((subItem) => (
                            <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors",
                                    isActive(subItem.href) ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                                )}
                            >
                                <subItem.icon size={16} />
                                {subItem.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 py-8 px-4">
            <div className="lg:hidden mb-4">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    {isMobileMenuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
                    {isMobileMenuOpen ? "Close Menu" : "Menu"}
                </button>
            </div>

            <aside className={cn("w-full lg:w-56 shrink-0", isMobileMenuOpen ? "block" : "hidden lg:block")}>
                <nav className="sticky top-24 space-y-8">
                    {menuItems.map((section, i) => (
                        <div key={i}>
                            {section.items ? (
                                <>
                                    <h3 className="font-semibold text-gray-900 mb-3 px-3">{section.title}</h3>
                                    <div className="space-y-1">{section.items.map((item) => renderMenuItem(item))}</div>
                                </>
                            ) : (
                                <Link
                                    href={section.href!}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        router.path === section.href ? "bg-teal-50 text-teal-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    {section.icon && <section.icon size={18} />}
                                    {section.title}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </aside>
            <div className="flex-1 min-w-0">
                <div className="prose prose-teal max-w-none">
                    <div className="bg-yellow-50 border border-yellow-600 text-yellow-900 rounded-lg px-4 py-3 mb-6 text-sm">
                        <strong>Note:</strong>
                        <p>
                            HeliumTS is under pre-beta and active development. Expect bugs and breaking changes. If you find any issues, please report them in{" "}
                            <a href="https://github.com/heliobentes/heliumts//issues" target="_blank" className="underline hover:text-yellow-900">
                                our GitHub <IconExternalLink className="inline-block size-4 mb-1 ml-1" />
                            </a>
                        </p>
                        <p>
                            <i>A stable release is planned for early December 2025.</i>
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
