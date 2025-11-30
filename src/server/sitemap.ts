import { defineHTTPRequest } from "heliumts/server";

import { type MenuItem, menuItems, type MenuSection } from "../config/docs";

const BASE_URL = "https://heliumjs.com";

function getUrls(items: (MenuItem | MenuSection)[]): string[] {
    const urls: string[] = [];

    for (const item of items) {
        // Check if item has href and it's internal
        if ("href" in item && item.href && !item.href.startsWith("http")) {
            urls.push(item.href);
        }

        // Check for items (MenuSection)
        if ("items" in item && item.items) {
            urls.push(...getUrls(item.items));
        }

        // Check for subItems (MenuItem)
        if ("subItems" in item && item.subItems) {
            urls.push(...getUrls(item.subItems));
        }
    }

    return urls;
}

export const sitemap = defineHTTPRequest("GET", "/sitemap.xml", async () => {
    const urls = getUrls(menuItems);
    // Add home page if not in menu
    if (!urls.includes("/")) {
        urls.unshift("/");
    }

    // Remove duplicates
    const uniqueUrls = [...new Set(urls)];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${uniqueUrls
        .map(
            (url) => `
    <url>
        <loc>${BASE_URL}${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>${url === "/" ? "1.0" : "0.8"}</priority>
    </url>
    `
        )
        .join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
        },
    });
});
