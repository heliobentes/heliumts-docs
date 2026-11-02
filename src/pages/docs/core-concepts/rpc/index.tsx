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
                HTTP RPC
            </Heading>
            <p>
                Helium handles HTTP requests, MessagePack serialization, batching, and typed responses. Use <code>useFetch</code> for cached reads, <code>useCall</code> for
                mutations, and <code>callMethod</code> for promises outside hooks. For incremental replies, define an async generator and use{" "}
                <a href="/docs/core-concepts/rpc/streaming" className="text-teal-600 underline">
                    useStreaming
                </a>
                .
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
                stub. The response includes <code>data</code> and rate-limit <code>stats</code>.
            </p>
            <CodeBlock
                code={`import { callMethod } from "heliumts/client";
import { getTasks } from "heliumts/server";

const { data, stats } = await callMethod(getTasks, { status: "open" });
// Arguments and data are inferred from getTasks. No hook state is updated.`}
                language="typescript"
            />
            <p>
                Unlike <code>useCall</code>, this function does not update hook state or invalidate cached queries. Handle those updates yourself when needed.
            </p>

            <Heading level={2} className="mt-10">
                Retries and Mutation Safety
            </Heading>
            <p>
                Network failures and server errors are not automatically replayed. An expired request token may be refreshed after an authorization rejection before retrying. If
                you choose to retry a mutation yourself after a lost response, use an idempotency key or database constraint for operations such as payments and order creation.
                Streams are never replayed automatically.
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
