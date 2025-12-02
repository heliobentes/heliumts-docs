"use ssg";
import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RPCDataFetching() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Data Fetching</Heading>
            <p>
                HeliumTS provides the <code>useFetch</code> hook for data fetching. It communicates with the server over WebSocket RPC, providing real-time, type-safe data
                operations.
            </p>

            <Heading level={2} className="mt-8">
                useFetch
            </Heading>
            <p>
                The <code>useFetch</code> hook automatically fetches data from a server method and caches the result. It's designed for <strong>reading/querying data</strong>.
            </p>

            <Heading level={3} className="mt-6">
                Basic Usage
            </Heading>
            <CodeBlock
                code={`import { useFetch } from "heliumts/client";
import { getTasks } from "heliumts/server";

function TaskList() {
    const { data, isLoading, error } = useFetch(getTasks, { status: "open" });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <ul>
            {data?.map((task) => (
                <li key={task.id}>{task.name}</li>
            ))}
        </ul>
    );
}`}
                language="typescript"
            />

            <Heading level={3} className="mt-6">
                Return Values
            </Heading>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>data</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>TResult | undefined</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">The fetched data (typed based on server method return type)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>isLoading</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>boolean</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Whether a fetch is in progress</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>error</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>string | null</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Error message if the fetch failed</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>stats</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>RpcStats | null</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">RPC statistics (timing, etc.)</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>refetch</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>
                                    (showLoader?: boolean) ={">"} Promise{"<"}TResult | undefined{">"}
                                </code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Function to manually trigger a refetch</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <Heading level={3} className="mt-6">
                Options
            </Heading>
            <p>
                The <code>useFetch</code> hook accepts an optional third parameter for controlling caching and refetch behavior:
            </p>
            <CodeBlock
                code={`const { data, isLoading } = useFetch(method, args, {
    ttl: 30000,
    refetchOnWindowFocus: true,
    showLoaderOnRefocus: false,
    enabled: true,
});`}
                language="typescript"
            />
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Default</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>ttl</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>number</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>300000</code> (5 min)
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Time-to-live for cached data in milliseconds. After TTL expires, data is automatically refetched.</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>refetchOnWindowFocus</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>boolean</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>true</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Automatically refetch when the browser tab becomes visible or window regains focus.</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>showLoaderOnRefocus</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>boolean</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>false</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                Whether to show loading state during focus-triggered refetches. When <code>false</code>, data updates silently in the background without showing a
                                loader.
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>enabled</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>boolean</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>true</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                Set to <code>false</code> to disable automatic fetching. Useful for conditional fetching when a required value isn't available yet.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
