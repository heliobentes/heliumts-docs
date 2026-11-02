"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function ProxyConfiguration() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Proxy Configuration for IP Detection</Heading>
            <p>
                When deploying behind proxies (like Vercel, Cloudflare, AWS ALB, etc.), accurate client IP detection is crucial for rate limiting and connection limits. Without
                proper proxy configuration, the system might identify the proxy server's IP instead of the real client IP.
            </p>

            <Heading level={2} className="mt-8">
                Configuration
            </Heading>
            <p>
                Use the <code>trustProxyDepth</code> setting in your <code>helium.config.ts</code>:
            </p>
            <CodeBlock
                code={`import type { HeliumConfig } from "heliumts/server";

const config: HeliumConfig = {
    trustProxyDepth: 1, // Set based on your deployment
};

export default config;`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                How It Works
            </Heading>
            <p>
                With <code>trustProxyDepth: 0</code>, Helium ignores forwarding headers and uses the direct socket address. With proxy trust enabled, it selects the client address
                from <code>X-Forwarded-For</code> by counting trusted hops from the right, including the direct peer.
            </p>
            <CodeBlock
                code={`X-Forwarded-For: untrusted-prefix, client, proxy
trustProxyDepth: 1  -> proxy
trustProxyDepth: 2  -> client`}
                language="text"
            />
            <p>
                When <code>X-Forwarded-For</code> is absent, Helium can use <code>CF-Connecting-IP</code>, <code>True-Client-IP</code>, then <code>X-Real-IP</code>. Forwarded
                values must be valid IP addresses; an invalid or too-short chain falls back to the socket address. Your trusted proxy must overwrite provider-specific headers.
            </p>

            <Heading level={2} className="mt-8">
                Common Deployment Scenarios
            </Heading>

            <Heading level={3} className="mt-6">
                Vercel / Netlify / Railway / DigitalOcean APPs
            </Heading>
            <p>
                <code>trustProxyDepth: 1</code>
            </p>
            <p>Use 1 only when your deployment has exactly one trusted proxy hop; check the actual proxy chain for your platform.</p>

            <Heading level={3} className="mt-6">
                Cloudflare → Your Server
            </Heading>
            <p>
                <code>trustProxyDepth: 1</code>
            </p>
            <p>
                Helium uses the rightmost forwarded address when <code>X-Forwarded-For</code> is present, otherwise a valid provider-specific header.
            </p>

            <Heading level={3} className="mt-6">
                Cloudflare → Nginx → Node.js
            </Heading>
            <p>
                <code>trustProxyDepth: 2</code>
            </p>
            <p>With two proxy layers (Nginx + Cloudflare).</p>

            <Heading level={3} className="mt-6">
                Local Development
            </Heading>
            <p>
                <code>trustProxyDepth: 0</code> (Default)
            </p>
            <p>No proxies in local development.</p>

            <Heading level={2} className="mt-8">
                Security Considerations
            </Heading>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                    <strong>Setting trustProxyDepth Too Low:</strong> Rate limiting will apply to the proxy IP, affecting all users.
                </li>
                <li>
                    <strong>Setting trustProxyDepth Too High:</strong> Potential security risk if <code>X-Forwarded-For</code> is spoofed.
                </li>
            </ul>
            <p className="mt-4 font-semibold">
                Best Practice: Always set <code>trustProxyDepth</code> to match your exact proxy configuration.
            </p>
        </div>
    );
}
