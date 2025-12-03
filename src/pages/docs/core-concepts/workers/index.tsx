"use ssg";
import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function WorkersOverview() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Background Workers</Heading>

            <section className="space-y-4">
                <Heading level={2}>Overview</Heading>
                <p>
                    HeliumTS provides <code>defineWorker</code> for creating long-running background processes that start when the server starts and continue running until the
                    server shuts down. This is ideal for:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Queue consumers (Redis, RabbitMQ, SQS, etc.)</li>
                    <li>Background task processors</li>
                    <li>Scheduled jobs and cron-like tasks</li>
                    <li>Real-time data synchronization</li>
                    <li>Cache warmers and data pre-loaders</li>
                    <li>WebSocket connection managers</li>
                </ul>
                <p>
                    Workers eliminate the need for separate microservices or monorepo setups like Turborepo - everything runs in the same process, sharing the same code, services,
                    types, and models.
                </p>
            </section>

            <section className="space-y-4">
                <Heading level={2}>Basic Usage</Heading>
                <p>
                    Create a worker file in your <code>src/server</code> directory:
                </p>
                <p>
                    <strong>
                        Server (<code>src/server/workers/queueConsumer.ts</code>):
                    </strong>
                </p>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const queueConsumer = defineWorker(
    async (ctx) => {
        console.log("Queue consumer started");

        while (true) {
            // Poll for jobs
            const job = await queue.pop();

            if (job) {
                await processJob(job);
            }

            // Wait before polling again
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    },
    { name: "queueConsumer" }
);`}
                    language="typescript"
                />
                <p>When the server starts, you'll see:</p>
                <CodeBlock code={`Starting worker 'queueConsumer'`} language="text" />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Worker Options</Heading>
                <CodeBlock
                    code={`interface WorkerOptions {
    /**
     * The name of the worker, used for logging and identification.
     * If not provided, the handler function name will be used.
     */
    name?: string;

    /**
     * Whether the worker should automatically restart if it crashes.
     * Default: true
     */
    autoRestart?: boolean;

    /**
     * Delay in milliseconds before restarting the worker after a crash.
     * Default: 5000 (5 seconds)
     */
    restartDelayMs?: number;

    /**
     * Maximum number of restart attempts before giving up.
     * Set to 0 for unlimited restarts.
     * Default: 0 (unlimited)
     */
    maxRestarts?: number;

    /**
     * Whether to start the worker automatically on server startup.
     * Default: true
     */
    autoStart?: boolean;
}`}
                    language="typescript"
                />

                <Heading level={3}>Example with Options</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const dataSync = defineWorker(
    async (ctx) => {
        while (true) {
            await syncDataFromExternalAPI();
            await new Promise((resolve) => setTimeout(resolve, 30000)); // Every 30 seconds
        }
    },
    {
        name: "dataSync",
        autoRestart: true,
        restartDelayMs: 10000, // Wait 10 seconds before restarting
        maxRestarts: 5, // Give up after 5 restart attempts
    }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Context Access</Heading>
                <p>
                    Workers receive a <code>HeliumContext</code> object, similar to RPC methods:
                </p>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const contextExample = defineWorker(
    async (ctx) => {
        // Access context properties
        console.log("Worker context:", ctx);

        // You can add custom properties via middleware
        const db = ctx.db; // If set by middleware

        while (true) {
            await performTask(db);
            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    },
    { name: "contextExample" }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Error Handling</Heading>
                <p>Workers automatically handle errors with configurable restart behavior:</p>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const resilientWorker = defineWorker(
    async (ctx) => {
        while (true) {
            try {
                await riskyOperation();
            } catch (error) {
                console.error("Operation failed:", error);
                // The worker continues running
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    },
    { name: "resilientWorker" }
);

// If the entire worker crashes, it will restart automatically
export const crashingWorker = defineWorker(
    async (ctx) => {
        // This will crash and restart up to 3 times
        throw new Error("Something went wrong!");
    },
    {
        name: "crashingWorker",
        autoRestart: true,
        maxRestarts: 3,
        restartDelayMs: 5000,
    }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Graceful Shutdown</Heading>
                <p>Workers are automatically stopped when the server shuts down (SIGINT/SIGTERM):</p>
                <CodeBlock
                    code={`^C
Shutting down...
Stopped 3 worker(s)
Server closed`}
                    language="text"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Multiple Workers</Heading>
                <p>You can define multiple workers in the same file or across different files:</p>
                <p>
                    <strong>
                        Server (<code>src/server/workers/index.ts</code>):
                    </strong>
                </p>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const worker1 = defineWorker(
    async (ctx) => {
        // Worker 1 logic
    },
    { name: "worker1" }
);

export const worker2 = defineWorker(
    async (ctx) => {
        // Worker 2 logic
    },
    { name: "worker2" }
);

export const worker3 = defineWorker(
    async (ctx) => {
        // Worker 3 logic
    },
    { name: "worker3" }
);`}
                    language="typescript"
                />
                <p>Startup output:</p>
                <CodeBlock
                    code={`Starting worker 'worker1'
Starting worker 'worker2'
Starting worker 'worker3'`}
                    language="text"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Best Practices</Heading>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>
                        <strong>Use descriptive names</strong>: Give workers meaningful names for easy identification in logs
                    </li>
                    <li>
                        <strong>Handle errors gracefully</strong>: Catch errors within your worker loop to prevent unnecessary restarts
                    </li>
                    <li>
                        <strong>Use appropriate restart settings</strong>: Set <code>maxRestarts</code> to prevent infinite restart loops
                    </li>
                    <li>
                        <strong>Clean up resources</strong>: If your worker allocates resources (connections, file handles), clean them up on errors
                    </li>
                    <li>
                        <strong>Log important events</strong>: Add logging for visibility into worker behavior
                    </li>
                    <li>
                        <strong>Use long polling</strong>: For queue consumers, use long polling to reduce CPU usage
                    </li>
                    <li>
                        <strong>Monitor worker health</strong>: Use <code>getWorkerStatus()</code> to monitor worker states
                    </li>
                </ol>
            </section>

            <section className="space-y-4">
                <Heading level={2}>TypeScript Support</Heading>
                <p>Workers are fully typed:</p>
                <CodeBlock
                    code={`import { defineWorker, WorkerOptions, HeliumWorkerDef } from "heliumts/server";

const options: WorkerOptions = {
    name: "typedWorker",
    autoRestart: true,
    maxRestarts: 5,
};

export const typedWorker: HeliumWorkerDef = defineWorker(async (ctx) => {
    // Fully typed worker
}, options);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Why Workers Instead of Monorepos?</Heading>
                <p>Traditional approaches require:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Separate repositories or monorepo tools (Turborepo, Nx)</li>
                    <li>Separate deployment pipelines</li>
                    <li>Code duplication or complex package sharing</li>
                    <li>Multiple running processes</li>
                </ul>
                <p className="mt-4">With Helium workers:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>
                        <strong>Single codebase</strong>: Everything in one place
                    </li>
                    <li>
                        <strong>Shared code</strong>: Workers use the same services, types, and models as your RPC methods
                    </li>
                    <li>
                        <strong>Single deployment</strong>: Deploy once, run everything
                    </li>
                    <li>
                        <strong>Simplified architecture</strong>: No inter-service communication needed
                    </li>
                    <li>
                        <strong>Type safety</strong>: Full TypeScript support across the entire application
                    </li>
                </ul>
            </section>
        </div>
    );
}
