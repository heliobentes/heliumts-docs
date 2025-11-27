"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function ProxyConfiguration() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Proxy Configuration for IP Detection</h1>
            <p>
                When deploying behind proxies (like Vercel, Cloudflare, AWS ALB, etc.), accurate client IP detection is crucial for rate limiting and connection limits. Without
                proper proxy configuration, the system might identify the proxy server's IP instead of the real client IP.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Configuration</h2>
            <p>
                Use the <code>trustProxyDepth</code> setting in your <code>helium.config.ts</code>:
            </p>
            <CodeBlock
                code={`import type { HeliumConfig } from "helium/server";

const config: HeliumConfig = {
    trustProxyDepth: 1, // Set based on your deployment
};

export default config;`}
                language="typescript"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">How It Works</h2>
            <p>Helium checks multiple headers to extract the client IP, in order of reliability:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                    <code>CF-Connecting-IP</code> - Cloudflare's guaranteed client IP
                </li>
                <li>
                    <code>True-Client-IP</code> - Cloudflare Enterprise and Akamai
                </li>
                <li>
                    <code>X-Real-IP</code> - Set by Nginx and other proxies
                </li>
                <li>
                    <code>X-Forwarded-For</code> - Standard header containing IP chain
                </li>
                <li>
                    <code>req.socket.remoteAddress</code> - Direct connection IP (fallback)
                </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Common Deployment Scenarios</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Vercel / Netlify / Railway / DigitalOcean APPs</h3>
            <p>
                <code>trustProxyDepth: 1</code>
            </p>
            <p>These platforms add one proxy layer.</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Cloudflare → Your Server</h3>
            <p>
                <code>trustProxyDepth: 1</code>
            </p>
            <p>
                Helium automatically uses the <code>CF-Connecting-IP</code> header.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Cloudflare → Nginx → Node.js</h3>
            <p>
                <code>trustProxyDepth: 2</code>
            </p>
            <p>With two proxy layers (Nginx + Cloudflare).</p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Local Development</h3>
            <p>
                <code>trustProxyDepth: 0</code> (Default)
            </p>
            <p>No proxies in local development.</p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Security Considerations</h2>
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
