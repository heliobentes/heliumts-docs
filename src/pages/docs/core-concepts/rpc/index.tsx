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
