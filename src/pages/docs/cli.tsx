"use ssg";
import CodeBlock from "../../components/CodeBlock";

export default function CLI() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">CLI Reference</h1>

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
