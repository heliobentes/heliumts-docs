import { IconChevronDown, IconChevronRight, IconExternalLink, IconMenu2, IconX } from "@tabler/icons-react";
import { type LayoutProps, Link, useRouter } from "heliumts/client";
import { useEffect, useState } from "react";

import { Search } from "../../components/Search";
import type { MenuItem } from "../../config/docs";
import { menuItems } from "../../config/docs";
import { cn } from "../../utils";

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
        if (router.path.startsWith("/docs/core-concepts/rpc")) {
            expanded.add("/docs/core-concepts/rpc");
        }
        if (router.path.startsWith("/docs/core-concepts/workers")) {
            expanded.add("/docs/core-concepts/workers");
        }
        return expanded;
    });

    const [expandedSections, setExpandedSections] = useState<Set<string>>(() => {
        const expanded = new Set<string>();
        // Expand section if it contains the current route
        menuItems.forEach((section) => {
            if (section.items) {
                const hasActiveItem = section.items.some((item) => {
                    if (router.path === item.href) return true;
                    if (item.subItems) {
                        return item.subItems.some((sub) => router.path === sub.href);
                    }
                    return false;
                });
                if (hasActiveItem) {
                    expanded.add(section.title);
                }
            }
        });
        // Default expand "Getting Started" if nothing else is active
        if (expanded.size === 0) {
            expanded.add("Getting Started");
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
        if (router.path.startsWith("/docs/core-concepts/rpc")) {
            setExpandedItems((prev) => new Set([...prev, "/docs/core-concepts/rpc"]));
        }
        if (router.path.startsWith("/docs/core-concepts/workers")) {
            setExpandedItems((prev) => new Set([...prev, "/docs/core-concepts/workers"]));
        }

        // Auto-expand section when navigating
        menuItems.forEach((section) => {
            if (section.items) {
                const hasActiveItem = section.items.some((item) => {
                    if (router.path === item.href) return true;
                    if (item.subItems) {
                        return item.subItems.some((sub) => router.path === sub.href);
                    }
                    return false;
                });
                if (hasActiveItem) {
                    setExpandedSections((prev) => new Set([...prev, section.title]));
                }
            }
        });

        // Handle scroll to hash
        if (window.location.hash) {
            const id = window.location.hash.substring(1);
            // Small timeout to ensure content is rendered
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                }
            }, 100);
        } else {
            // Scroll to top if no hash
            window.scrollTo({ top: 0, behavior: "smooth" });
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

    const toggleSection = (title: string) => {
        setExpandedSections((prev) => {
            const next = new Set(prev);
            if (next.has(title)) {
                next.delete(title);
            } else {
                next.add(title);
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
                            "flex-1 flex items-center gap-3 py-3 lg:py-1.5 rounded-md text-sm font-medium transition-colors",
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
                            className="p-3 lg:p-1.5 text-gray-500 hover:text-gray-700 hover:bg-teal-50 rounded-md cursor-pointer"
                            aria-label={isExpanded ? "Collapse submenu" : "Expand submenu"}
                        >
                            {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                        </button>
                    )}
                </div>
                {hasSubItems && isExpanded && (
                    <div className="ml-6 mt-0.5 space-y-0.5 border-l border-gray-200 pl-2">
                        {item.subItems!.map((subItem) => (
                            <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 lg:py-1 rounded-md text-sm transition-colors",
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
        <div className="flex flex-col lg:flex-row gap-8 py-6 px-4">
            <div className="lg:hidden mb-4 space-y-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                        {isMobileMenuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
                        {isMobileMenuOpen ? "Close Menu" : "Menu"}
                    </button>
                    <div className="flex-1">
                        <Search />
                    </div>
                </div>
            </div>

            <aside className={cn("w-full lg:w-56 shrink-0", isMobileMenuOpen ? "block" : "hidden lg:block")}>
                <div className="sticky top-24">
                    <div className="mb-4 px-3 lg:px-0 hidden lg:block">
                        <Search />
                    </div>
                    <nav className="space-y-2 pb-10 pr-1">
                        <div className=" mb-4">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Version</div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">v0.4.3</span>
                        </div>
                        {menuItems.map((section, i) => (
                            <div key={i}>
                                {section.items ? (
                                    <div className="mb-1">
                                        <button
                                            onClick={() => toggleSection(section.title)}
                                            className="flex items-center justify-between w-full py-3 lg:py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 rounded-md transition-colors group cursor-pointer"
                                        >
                                            {section.title}
                                            {expandedSections.has(section.title) ? (
                                                <IconChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
                                            ) : (
                                                <IconChevronRight size={16} className="text-gray-400 group-hover:text-gray-600" />
                                            )}
                                        </button>
                                        {expandedSections.has(section.title) && <div className="mt-1 space-y-0.5">{section.items.map((item) => renderMenuItem(item))}</div>}
                                    </div>
                                ) : (
                                    <Link
                                        href={section.href!}
                                        className={cn(
                                            "flex items-center gap-3 py-3 lg:py-1.5 rounded-md text-sm font-medium transition-colors",
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
                </div>
            </aside>
            <div className="flex-1 min-w-0">
                <div className="prose prose-teal max-w-none">
                    <div className="bg-yellow-50 border border-yellow-600 text-yellow-900 rounded-lg px-4 py-3 mb-6 text-sm">
                        <strong>Note:</strong>
                        <p>
                            HeliumTS is under active development. Expect bugs and breaking changes. If you find any issues, please report them in{" "}
                            <a href="https://github.com/heliobentes/heliumts//issues" target="_blank" className="underline hover:text-yellow-900">
                                our GitHub <IconExternalLink className="inline-block size-4 mb-1 ml-1" />
                            </a>
                        </p>
                        <p>
                            <i>A stable release is planned for early 2026.</i>
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
