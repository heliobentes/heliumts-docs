"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function ProductionDeployment() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Production Deployment</h1>
            <p>
                When deploying your Helium application, the framework needs to load your <code>helium.config</code> file. The build process automatically handles TypeScript config
                files for you.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Configuration Files in Production</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Automatic Config Transpilation</h3>
            <p>
                During <code>helium build</code>, the framework:
            </p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                    If <code>helium.config.ts</code> exists: Automatically transpiles it to <code>dist/helium.config.js</code>
                </li>
                <li>
                    If <code>helium.config.js</code> exists: Copies it to <code>dist/helium.config.js</code>
                </li>
                <li>
                    If <code>helium.config.mjs</code> exists: Copies it to <code>dist/helium.config.mjs</code>
                </li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Deployment Structure</h3>
            <p>
                After running <code>helium build</code>, your deployment should include:
            </p>
            <CodeBlock
                code={`your-app/
├── dist/
│   ├── server.js              # Bundled server code
│   ├── helium.config.js       # Transpiled config (if you had .ts)
│   ├── index.html             # Client entry
│   └── assets/                # Client bundles
├── package.json
└── node_modules/`}
                language="plaintext"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Platform-Specific Instructions</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Digital Ocean App Platform</h3>
            <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>
                    Set build command: <code>npm run build</code>
                </li>
                <li>
                    Set run command: <code>npm run start</code> (or directly: <code>helium start</code>)
                </li>
                <li>
                    Ensure <code>node_modules</code> is included in the deployment
                </li>
                <li>Add environment variables in Settings → App-Level Environment Variables</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Docker</h3>
            <CodeBlock
                code={`FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY dist ./dist

# The config file should be in dist/ after build
EXPOSE 3000

CMD ["node", "dist/server.js"]`}
                language="dockerfile"
            />

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Environment Variables</h2>

            <h3 className="text-xl font-semibold text-gray-900 mt-6">Client-Side Environment Variables</h3>
            <p>
                To expose environment variables to the browser, prefix them with <code>HELIUM_PUBLIC_</code>:
            </p>
            <CodeBlock
                code={`HELIUM_PUBLIC_APP_NAME=MyApp
HELIUM_PUBLIC_API_URL=https://api.example.com`}
                language="plaintext"
            />
            <p className="mt-2">
                Access them in your React components using <code>import.meta.env</code>:
            </p>
            <CodeBlock code={`const appName = import.meta.env.HELIUM_PUBLIC_APP_NAME;`} language="typescript" />
        </div>
    );
}
