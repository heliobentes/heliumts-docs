"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function RPC() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">RPC (Remote Procedure Calls)</h1>
            <p>
                Define server-side functions using <code>defineMethod</code> and call them from the client using <code>useCall</code> or <code>useFetch</code>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Server</h2>
            <p>
                <code>src/server/tasks.ts</code>
            </p>
            <CodeBlock
                code={`import { defineMethod } from "helium/server";

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

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Client</h2>
            <p>
                <code>src/pages/tasks.tsx</code>
            </p>
            <CodeBlock
                code={`import { useFetch, useCall } from "helium/client";
import { getTasks, createTask } from "helium/server";

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

            <h2 className="text-2xl font-semibold text-gray-900 mt-8">Real-time web APP</h2>
            <div>
                <p>
                    By changing the <code>useFetch</code> TTL setting to a low number ({"<"}2 seconds) you can convert your app into a real-time web app.
                </p>
                <p>This will make the data refresh automatically at the specified interval, providing a real-time experience if the data is updated remotely.</p>
            </div>
            <CodeBlock
                code={`// Fetch data (auto-runs on mount)
// Data is typed based on server method return type
const { data, isLoading } = useFetch(getTasks, 
    { status: "open" }, 
    { ttl: 1000 } // Refresh data every 1 second
); 
`}
                language="typescript"
            />
        </div>
    );
}
