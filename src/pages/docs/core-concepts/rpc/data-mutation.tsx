"use ssg";
import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function RPCDataMutation() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Data Mutation</Heading>
            <p>
                HeliumTS provides the <code>useCall</code> hook for performing mutations (create, update, delete operations). Unlike <code>useFetch</code>, it doesn't automatically
                execute — you call it manually when needed.
            </p>

            <Heading level={2} className="mt-8">
                useCall
            </Heading>
            <p>
                The <code>useCall</code> hook is designed for <strong>writing/modifying data</strong>. It provides a function to trigger the server method and tracks the execution
                state.
            </p>

            <Heading level={3} className="mt-6">
                Basic Usage
            </Heading>
            <CodeBlock
                code={`import { useCall } from "heliumts/client";
import { createTask } from "heliumts/server";

function CreateTaskForm() {
    const { call, isCalling, error } = useCall(createTask);

    const handleSubmit = async (name: string) => {
        const result = await call({ name });
        if (result) {
            console.log("Task created:", result);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e.target.taskName.value);
            }}
        >
            <input name="taskName" placeholder="Task name" />
            <button type="submit" disabled={isCalling}>
                {isCalling ? "Creating..." : "Create Task"}
            </button>
            {error && <p className="error">{error}</p>}
        </form>
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
                                <code>call</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>
                                    (args: TArgs) ={">"} Promise{"<"}TResult | undefined{">"}
                                </code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Function to execute the server method</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>isCalling</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>boolean</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Whether a call is in progress</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>error</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>string | null</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Error message if the call failed</td>
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
                    </tbody>
                </table>
            </div>

            <Heading level={3} className="mt-6">
                Options
            </Heading>
            <CodeBlock
                code={`const { call } = useCall(method, {
    invalidate: [getTasks, getTaskCount],
    onSuccess: (result) => console.log("Success:", result),
    onError: (error) => console.error("Error:", error),
});`}
                language="typescript"
            />
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm mt-4">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>invalidate</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>MethodStub[]</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                Array of methods whose cached data should be invalidated after a successful call. This triggers automatic refetch for all <code>useFetch</code>{" "}
                                hooks using those methods.
                            </td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>onSuccess</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>(result: TResult) ={">"} void</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Callback fired after a successful call</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">
                                <code>onError</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                                <code>(error: string) ={">"} void</code>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">Callback fired when the call fails</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
