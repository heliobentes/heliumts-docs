import {
    IconAppWindow,
    IconArrowsShuffle,
    IconBolt,
    IconCloud,
    IconCloudDollar,
    IconCode,
    IconCursorText,
    IconDatabase,
    IconDatabaseEdit,
    IconDatabaseSearch,
    IconDeviceDesktopCode,
    IconFileCode,
    IconFolder,
    IconKeyframeAlignCenter,
    IconLink,
    IconRoute,
    IconServer,
    IconSettings,
    IconShield,
    IconSparkles,
    IconTerminal,
    IconWorld,
} from "@tabler/icons-react";
import React from "react";

export interface MenuItem {
    title: React.ReactNode;
    icon: React.ComponentType<{ size: number }>;
    href: string;
    target?: string;
    subItems?: MenuItem[];
}

export interface MenuSection {
    title: string;
    items?: MenuItem[];
    icon?: React.ComponentType<{ size: number }>;
    href?: string;
}

export const menuItems: MenuSection[] = [
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
                title: "Example App",
                icon: IconAppWindow,
                href: "https://github.com/heliobentes/heliumts-example-app",
                target: "_blank",
            },
        ],
    },
    {
        title: "Core Concepts",
        items: [
            {
                title: "RPC",
                icon: IconServer,
                href: "/docs/core-concepts/rpc",
                subItems: [
                    { title: "Overview", icon: IconServer, href: "/docs/core-concepts/rpc" },
                    { title: "Data Fetching", icon: IconDatabaseSearch, href: "/docs/core-concepts/rpc/data-fetching" },
                    { title: "Data Mutation", icon: IconDatabaseEdit, href: "/docs/core-concepts/rpc/data-mutation" },
                    { title: "Examples", icon: IconCode, href: "/docs/core-concepts/rpc/examples" },
                ],
            },
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
