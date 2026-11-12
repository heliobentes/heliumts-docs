"use ssg";
import CodeBlock from "../../../components/CodeBlock";
import Heading from "../../../components/Heading";

export default function CLI() {
    return (
        <div className="space-y-6">
            <Heading level={1}>CLI Reference</Heading>

            <p>These commands target the 0.11.0 release. Use matching 0.11.0 framework and scaffolder versions.</p>
            <CodeBlock
                code={`helium typegen
helium inspect --rpc getTasks --json
helium inspect --route '/tasks/:id' --json
helium api useCall --from client --json
helium api --list --match define --from server
helium check`}
                language="bash"
            />
            <p>
                Typegen refreshes <code>src/rpc.generated.ts</code> without starting a server. Inspect reports routes, rendering modes, methods and middleware as JSON. Check
                regenerates declarations, validates discovery and runs TypeScript. It does not replace application tests or a production build.
            </p>

            <p>
                Start with <code>inspect</code> for an application method or route and <code>api</code> for the exact framework declaration. Source discovery does not execute
                application modules. Read one focused{" "}
                <a href="/ai/index.md" className="text-teal-700 underline">
                    task guide
                </a>{" "}
                rather than loading the whole reference for every edit.
            </p>
            <div className="space-y-4">
                <div>
                    <CodeBlock code="helium dev" language="bash" />
                    <p className="text-gray-600 mt-2">Starts the project in development mode.</p>
                </div>

                <div className="mt-8">
                    <CodeBlock code="helium build" language="bash" />
                    <p className="text-gray-600 mt-2">
                        i. Builds the client.
                        <br />
                        ii. Scans <code>src/server</code> for exports.
                        <br />
                        iii. Bundles the server using esbuild.
                        <br />
                        iv. Transpiles <code>helium.config.ts</code> to <code>dist/helium.config.js</code> (if present).
                    </p>
                </div>

                <div className="mt-8">
                    <CodeBlock code="helium start" language="bash" />
                    <p className="text-gray-600 mt-2">
                        Runs the bundled server (<code>dist/server.js</code>).
                    </p>
                </div>
            </div>
        </div>
    );
}
