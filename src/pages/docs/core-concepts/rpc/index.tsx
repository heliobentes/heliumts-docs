"use ssg";
import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RPCOverview() {
    return (
        <div className="space-y-6">
            <Heading level={1}>RPC (Remote Procedure Calls)</Heading>
            <p>
                Define server-side functions using <code>defineMethod</code> and call them from the client using <code>useCall</code> or <code>useFetch</code>.
            </p>

            <Heading level={2} className="mt-8">
                Choosing a Transport
            </Heading>
            <p>
                Helium supports WebSocket and HTTP RPC through the same client API. WebSocket calls share a persistent connection; HTTP/2 and HTTP/3 can also reuse connections.
                MessagePack can reduce payload size, but encoding, compression, network latency, and proxy routing all affect response time. Neither transport is always faster.
            </p>
            <p>
                Measure both on your deployment with representative payloads. The <a href="/speed-test">live benchmark</a> compares deterministic in-memory data without database
                work; its results describe the current test conditions. Browser network emulation can apply latency differently to HTTP requests and WebSocket messages, so a
                DevTools preset does not establish how either performs on a real cellular network.
            </p>

            <Heading level={2} className="mt-8">
                Server
            </Heading>
            <p>
                <code>src/server/tasks.ts</code>
            </p>
            <CodeBlock
                code={`import { defineMethod } from "heliumts/server";

// Getting tasks
export const getTasks = defineMethod(async (args: { status: string }) => {
    // Add your own database logic here
    return [{ id: 1, name: "Task 1", status: args.status }];
});

// Creating a new task
export const createTask = defineMethod(async (args: { name: string }) => {
    // Add your own create task logic
    return { id: 2, name: args.name };
});`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Client
            </Heading>
            <p>
                <code>src/pages/tasks.tsx</code>
            </p>
            <CodeBlock
                code={`import { useFetch, useCall } from "heliumts/client";
import { getTasks, createTask } from "heliumts/server";

export default function TasksPage() {
    // Fetch data (auto-runs on mount)
    // Data is typed based on server method return type
    const { data, isLoading } = useFetch(getTasks, { status: "open" });

    // Mutation (callable function)
    // The call function is typed based on server method args and return type
    const { call: add, isCalling } = useCall(createTask, {
        invalidate: [getTasks] // Auto-refresh getTasks after success everywhere it's used
    });

    return (
        <div>
            <button onClick={() => add({ name: "New Task" })}>
                {isCalling ? "Adding..." : "Add Task"}
            </button>
            {data?.map(task => <div key={task.id}>{task.name}</div>)}
        </div>
    );
}`}
                language="typescript"
            />

            <Heading level={2} className="mt-10">
                Calling Without a Hook
            </Heading>
            <p>
                Use <code>callMethod</code> in event handlers or client utilities when you want a promise without hook state. Arguments and results are inferred from the method
                stub. The response includes <code>data</code>, rate-limit <code>stats</code>, and the actual <code>transport</code> used.
            </p>
            <CodeBlock
                code={`import { callMethod } from "heliumts/client";
import { getTasks } from "heliumts/server";

const { data, stats, transport } = await callMethod(getTasks, { status: "open" });
// data is inferred from getTasks; transport is "http" or "websocket".

const websocketResult = await callMethod(
    getTasks,
    { status: "open" },
    { transport: "websocket" } // Optional: "http" is also supported.
);`}
                language="typescript"
            />
            <p>
                Omit the option to use configured transport selection and fallback. An explicit transport keeps bounded retries on that transport and never falls back to the other.
                Unlike <code>useCall</code>, this function does not update hook state or invalidate cached queries; handle those updates yourself when needed.
            </p>

            <Heading level={2} className="mt-10">
                Retries and Mutation Safety
            </Heading>
            <p>
                Connection failures and timeouts may trigger automatic retries. A mutation can finish on the server before its response is lost, so a retry can execute it again.
                Use an idempotency key or a database constraint for operations such as payments and order creation; the transport does not guarantee exactly-once execution.
            </p>

            <Heading level={2} className="mt-10">
                Public errors in production
            </Heading>
            <p>
                In production, server errors are redacted to a generic <code>Server error</code> message by default. If you want to expose a safe message to clients, throw a
                <code>PublicError</code> or an error-like object with <code>{`{ public: true }`}</code> from your RPC method.
            </p>
            <CodeBlock
                code={`import { defineMethod, PublicError } from "heliumts/server";

export const createTask = defineMethod(async (args) => {
    if (!args.name?.trim()) {
        throw new PublicError("Task name is required");
        // Or: throw { public: true, message: "Task name is required" };
    }

    return createTaskInDb(args);
});`}
                language="typescript"
            />
        </div>
    );
}
