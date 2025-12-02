"use ssg";
import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RPCExamples() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Examples</Heading>

            <Heading level={2} className="mt-8">
                Conditional Fetching
            </Heading>
            <p>Only fetch when a required value is available:</p>
            <CodeBlock
                code={`function UserProfile({ userId }: { userId?: string }) {
    const { data: user } = useFetch(
        getUser,
        { id: userId! },
        {
            enabled: !!userId, // Only fetch when userId exists
        }
    );

    if (!userId) return <div>Select a user</div>;
    return <div>{user?.name}</div>;
}`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Custom Cache TTL
            </Heading>
            <p>Set a shorter cache duration for frequently changing data:</p>
            <CodeBlock
                code={`const { data: notifications } = useFetch(getNotifications, undefined, {
    ttl: 10000, // Refresh every 10 seconds
});`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Silent Background Refetch (Default)
            </Heading>
            <p>By default, when the user returns to the tab, data refetches silently without showing a loader:</p>
            <CodeBlock
                code={`// Data updates in the background when tab regains focus
// No loading spinner shown - seamless UX
const { data, isLoading } = useFetch(getPosts);`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Show Loader on Refocus
            </Heading>
            <p>If you want to show a loading indicator when refetching on focus:</p>
            <CodeBlock
                code={`const { data, isLoading } = useFetch(getPosts, undefined, {
    showLoaderOnRefocus: true, // Show loader when refetching on tab focus
});`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Disable Refetch on Window Focus
            </Heading>
            <p>For data that doesn't need to be fresh on every tab switch:</p>
            <CodeBlock
                code={`const { data: settings } = useFetch(getUserSettings, undefined, {
    refetchOnWindowFocus: false, // Don't refetch when tab becomes visible
});`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Manual Refetch
            </Heading>
            <p>Trigger a refetch programmatically:</p>
            <CodeBlock
                code={`function DataWithRefresh() {
    const { data, refetch, isLoading } = useFetch(getData);

    return (
        <div>
            <button onClick={() => refetch()} disabled={isLoading}>
                Refresh
            </button>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}`}
                language="typescript"
            />
            <p>You can also control whether the loader is shown during manual refetch:</p>
            <CodeBlock
                code={`// Silent refetch (no loader)
await refetch(false);

// Refetch with loader (default)
await refetch(true);`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Cache Invalidation
            </Heading>
            <p>Automatically refresh related data after a mutation:</p>
            <CodeBlock
                code={`import { useCall, useFetch } from "heliumts/client";
import { getTasks, createTask, deleteTask } from "heliumts/server";

function TaskManager() {
    const { data: tasks } = useFetch(getTasks);

    const { call: addTask } = useCall(createTask, {
        invalidate: [getTasks], // Refetch getTasks after success
    });

    const { call: removeTask } = useCall(deleteTask, {
        invalidate: [getTasks],
    });

    return (
        <div>
            <button onClick={() => addTask({ name: "New Task" })}>Add Task</button>
            {tasks?.map((task) => (
                <div key={task.id}>
                    {task.name}
                    <button onClick={() => removeTask({ id: task.id })}>Delete</button>
                </div>
            ))}
        </div>
    );
}`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                With Callbacks
            </Heading>
            <p>Handle success and error states:</p>
            <CodeBlock
                code={`const { call } = useCall(updateUser, {
    onSuccess: (user) => {
        toast.success(\`User \${user.name} updated!\`);
        router.push("/users");
    },
    onError: (error) => {
        toast.error(\`Failed to update: \${error}\`);
    },
});`}
                language="typescript"
            />

            <Heading level={2} className="mt-8">
                Optimistic Updates
            </Heading>
            <p>For instant UI feedback, combine with local state:</p>
            <CodeBlock
                code={`function LikeButton({ postId, initialLikes }: { postId: string; initialLikes: number }) {
    const [likes, setLikes] = useState(initialLikes);

    const { call: likePost } = useCall(addLike, {
        onError: () => setLikes(likes), // Revert on error
    });

    const handleLike = () => {
        setLikes(likes + 1); // Optimistic update
        likePost({ postId });
    };

    return <button onClick={handleLike}>❤️ {likes}</button>;
}`}
                language="typescript"
            />

            <hr className="my-8 border-gray-700" />

            <Heading level={1} className="mt-8">
                Best Practices
            </Heading>

            <Heading level={2} className="mt-6">
                When to Use Which Hook
            </Heading>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Use Case</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hook</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Fetching data on page load</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useFetch</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Displaying a list of items</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useFetch</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Creating a new record</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useCall</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Updating existing data</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useCall</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Deleting records</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useCall</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Search with user input</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useFetch</code> with <code>enabled</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Form submissions</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useCall</code>
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">Sending an email</td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>useCall</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Heading level={2} className="mt-6">
                Error Handling
            </Heading>
            <p>Both hooks provide error states. Always handle errors gracefully:</p>
            <CodeBlock
                code={`function MyComponent() {
    const { data, error, isLoading } = useFetch(getData);

    if (error) {
        return (
            <div className="error">
                <p>Something went wrong: {error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    // ... rest of component
}`}
                language="typescript"
            />

            <Heading level={2} className="mt-6">
                Loading States
            </Heading>
            <p>Provide feedback during loading:</p>
            <CodeBlock
                code={`function DataDisplay() {
    const { data, isLoading } = useFetch(getData);

    return (
        <div>
            {isLoading ? (
                <Skeleton /> // Show placeholder
            ) : (
                <Content data={data} />
            )}
        </div>
    );
}`}
                language="typescript"
            />

            <Heading level={2} className="mt-6">
                Type Safety
            </Heading>
            <p>Both hooks are fully typed based on your server method definitions:</p>
            <CodeBlock
                code={`// Server
export const getUser = defineMethod(async (args: { id: string }) => {
    return { id: args.id, name: "John", email: "john@example.com" };
});

// Client - types are inferred automatically
const { data } = useFetch(getUser, { id: "123" });
// data is typed as { id: string; name: string; email: string } | undefined`}
                language="typescript"
            />
        </div>
    );
}
