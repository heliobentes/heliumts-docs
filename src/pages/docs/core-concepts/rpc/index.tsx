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
            <p>
                The client examples use <code>src/rpc.generated.ts</code> from the 0.11.0 release. The dev server and production build generate it automatically. Run{" "}
                <code>npx helium typegen</code> to generate it on demand.
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

function taskInput(value: unknown): { name: string } {
    if (!value || typeof value !== "object" ||
        !("name" in value) || typeof value.name !== "string") {
        throw new Error("Expected a task name");
    }
    const name = value.name.trim();
    if (!name || name.length > 120) throw new Error("Invalid name");
    return { name };
}

export const getTasks = defineMethod(() => [
    { id: 1, name: "Ship the app" },
]);

export const createTask = defineMethod(
    async ({ name }: { name: string }) => {
        // Enforce authorization and persist with your own database here.
        return { id: 2, name };
    },
    { input: taskInput }
);`}
                language="typescript"
            />

            <p>
                The parser receives unknown network input, validates it and returns the handler arguments. TypeScript types alone do not validate requests. Keep authentication and
                ownership checks in the handler or middleware; parser errors are returned safely without exposing submitted values.
            </p>

            <Heading level={2} className="mt-8">
                Client
            </Heading>
            <p>
                <code>src/pages/tasks.tsx</code>
            </p>
            <CodeBlock
                code={`import { useFetch, useCall } from "heliumts/client";
import { getTasks, createTask } from "../rpc.generated";

export default function TasksPage() {
    const { data, isLoading, error, refetch } = useFetch(getTasks);
    const save = useCall(createTask, { invalidate: [getTasks] });

    async function addTask() {
        const result = await save.submit({ name: "New Task" });
        if (result.status === "success") console.log(result.data.id);
    }

    if (isLoading) return <p role="status">Loading...</p>;
    if (error) return <p role="alert">{error}</p>;
    return (
        <div>
            <button onClick={() => void refetch()}>Refresh</button>
            <button onClick={() => void addTask()} disabled={save.isCalling}>
                {save.isCalling ? "Adding..." : "Add Task"}
            </button>
            {save.error && <p role="alert">{save.error}</p>}
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
                reference. The response includes <code>data</code> and rate-limit <code>stats</code>.
            </p>
            <CodeBlock
                code={`// src/components/loadTasks.ts
import { callMethod } from "heliumts/client";
import { getTasks } from "../rpc.generated";

const { data, stats } = await callMethod(getTasks);
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
