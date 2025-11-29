"use ssg";
import CodeBlock from "../../../components/CodeBlock";

export default function OpenAIGuide() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Using OpenAI API</h1>

            <p>This guide shows how to integrate OpenAI's API with HeliumTS for both streaming and non-streaming completions.</p>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Setup</h2>
                <p>First, install the OpenAI SDK:</p>
                <CodeBlock code={`npm install openai`} language="bash" />
                <p>Add your API key to your environment variables:</p>
                <CodeBlock code={`OPENAI_API_KEY=sk-...`} language="bash" />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Non-Streaming Example (RPC)</h2>
                <p>For simple request-response patterns, use RPC:</p>
                <CodeBlock
                    code={`import { defineRPC } from "heliumts/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletion = defineRPC(async (data: { message: string }, ctx) => {
    if (!data.message) {
        throw new Error("Message is required");
    }
    
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: data.message }],
        });
        
        const response = completion.choices[0]?.message?.content || "";
        
        return {
            response,
            usage: completion.usage,
        };
    } catch (error) {
        console.error("OpenAI API error:", error);
        throw new Error("Failed to get completion");
    }
});`}
                    language="typescript"
                />
                <p className="mt-4">Client-side usage:</p>
                <CodeBlock
                    code={`import { useCall } from "heliumts/client";
import { chatCompletion } from "heliumts/server";

export default function ChatPage() {
    const { call, data, loading, error } = useCall(chatCompletion);
    
    const handleSendMessage = async (message: string) => {
        const result = await call({ message });
        console.log(result.response);
    };
    
    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            {data && <p>{data.response}</p>}
        </div>
    );
}`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Streaming Example (HTTP)</h2>
                <p>For real-time chat interfaces with token-by-token streaming, use HTTP handlers:</p>
                <CodeBlock
                    code={`import { defineHTTPRequest } from "heliumts/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export const chatCompletionStream = defineHTTPRequest("POST", "/api/chat/stream", async (req, ctx) => {
    const { message } = (await req.json()) as { message: string };
    
    if (!message) {
        return new Response(JSON.stringify({ error: "Message is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }
    
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: message }],
            stream: true,
        });
        
        // Create a ReadableStream from the OpenAI stream
        const readableStream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of stream) {
                        const content = chunk.choices[0]?.delta?.content || "";
                        if (content) {
                            // Send as SSE format
                            const data = \`data: \${JSON.stringify({ content })}\\n\\n\`;
                            controller.enqueue(new TextEncoder().encode(data));
                        }
                    }
                    controller.enqueue(new TextEncoder().encode("data: [DONE]\\n\\n"));
                    controller.close();
                } catch (error) {
                    controller.error(error);
                }
            },
        });
        
        return new Response(readableStream, {
            status: 200,
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("OpenAI API error:", error);
        
        return new Response(
            JSON.stringify({ error: "Failed to get completion" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
});`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Client-Side Usage</h2>
                <p>Example of consuming the streaming endpoint from the client:</p>
                <CodeBlock
                    code={`async function streamChat(message: string) {
    const response = await fetch("/api/chat/stream", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });
    
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
        const { done, value } = await reader!.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\\n");
        
        for (const line of lines) {
            if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") {
                    console.log("Stream complete");
                    return;
                }
                
                const parsed = JSON.parse(data);
                console.log(parsed.content); // Display token
            }
        }
    }
}`}
                    language="typescript"
                />
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">Best Practices</h2>
                <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Always validate user input before sending to OpenAI</li>
                    <li>Implement rate limiting to prevent API abuse</li>
                    <li>Use environment variables for API keys</li>
                    <li>Handle errors gracefully and provide user feedback</li>
                    <li>Consider adding authentication to protect your endpoints</li>
                    <li>Monitor API usage and costs</li>
                    <li>Use streaming for better user experience in chat interfaces</li>
                </ul>
            </div>
        </div>
    );
}
