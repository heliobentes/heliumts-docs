"use ssg";

import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RouteGroups() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Route Groups</Heading>
            <p>
                Route groups let you organize pages into logical sections without changing the final URL. Any folder wrapped in parentheses is stripped from the route path but
                still participates in layout resolution.
            </p>

            <section className="space-y-4">
                <Heading level={2}>Basic Structure</Heading>
                <CodeBlock
                    code={`src/pages/
├── (website)/
│   ├── _layout.tsx
│   ├── index.tsx        → /
│   ├── about.tsx        → /about
│   └── contact.tsx      → /contact
├── (portal)/
│   ├── _layout.tsx
│   ├── dashboard.tsx    → /dashboard
│   └── tasks.tsx        → /tasks
└── (auth)/
    ├── _layout.tsx
    ├── login.tsx        → /login
    └── register.tsx     → /register`}
                    language="plaintext"
                />
                <p>
                    In the example above, <code>(website)</code>, <code>(portal)</code>, and <code>(auth)</code> are organizational folders only. They never appear in the
                    browser URL.
                </p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Why Use Route Groups</Heading>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Split marketing, application, admin, or auth flows without polluting URLs.</li>
                    <li>Attach different layouts to different parts of the app.</li>
                    <li>Keep feature areas isolated while preserving file-based routing.</li>
                    <li>Group future SSR or SSG pages by concern instead of by URL shape.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Layouts and Hierarchy</Heading>
                <p>Layouts are resolved using the real folder structure, including route groups. That means group layouts stay isolated, while the root layout still wraps everything.</p>
                <CodeBlock
                    code={`src/pages/
├── _layout.tsx                    # RootLayout - all pages
├── (portal)/
│   ├── _layout.tsx                # PortalLayout - only portal pages
│   ├── dashboard.tsx              # [RootLayout → PortalLayout]
│   └── settings/
│       ├── _layout.tsx            # SettingsLayout - only settings pages
│       └── profile.tsx            # [RootLayout → PortalLayout → SettingsLayout]
└── (website)/
    ├── _layout.tsx                # WebsiteLayout - only website pages
    └── about.tsx                  # [RootLayout → WebsiteLayout]`}
                    language="plaintext"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Dynamic Routes Inside Groups</Heading>
                <p>Route groups work the same way with dynamic and catch-all routes. Only the folder name in parentheses is removed.</p>
                <CodeBlock
                    code={`src/pages/
└── (portal)/
    ├── tasks/
    │   ├── index.tsx      → /tasks
    │   └── [id].tsx       → /tasks/:id
    └── docs/
        └── [...slug].tsx  → /docs/*`}
                    language="plaintext"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Collision Detection</Heading>
                <p>If two files resolve to the same public route, HeliumTS warns and only the first file wins.</p>
                <CodeBlock
                    code={`❌ Route collision detected! Multiple files resolve to the same path "/":
   - /src/pages/index.tsx
   - /src/pages/(website)/index.tsx
Only the first file will be used.`}
                    language="plaintext"
                />
                <p>Common collision sources are duplicate <code>index.tsx</code> files, repeated filenames across groups, or mixing grouped and non-grouped pages for the same URL.</p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Best Practices</Heading>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Use the root layout for global providers and chrome.</li>
                    <li>Use group layouts for section-specific navigation, auth gates, or themes.</li>
                    <li>Choose descriptive group names like <code>(marketing)</code>, <code>(app)</code>, or <code>(admin)</code>.</li>
                    <li>Avoid deep nesting unless the UI hierarchy genuinely needs it.</li>
                </ol>
            </section>
        </div>
    );
}