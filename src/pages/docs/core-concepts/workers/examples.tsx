"use ssg";
import CodeBlock from "../../../../components/CodeBlock";
import Heading from "../../../../components/Heading";

export default function WorkerExamples() {
    return (
        <div className="space-y-6">
            <Heading level={1}>Worker Examples</Heading>

            <section className="space-y-4">
                <Heading level={2}>Queue Consumer (Redis/BullMQ)</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";
import { Queue, Worker } from "bullmq";
import { redis } from "../lib/redis";

export const emailQueueConsumer = defineWorker(
    async (ctx) => {
        const worker = new Worker(
            "email-queue",
            async (job) => {
                const { to, subject, body } = job.data;
                await sendEmail(to, subject, body);
            },
            { connection: redis }
        );

        worker.on("completed", (job) => {
            console.log(\`Email job \${job.id} completed\`);
        });

        worker.on("failed", (job, err) => {
            console.error(\`Email job \${job?.id} failed:\`, err);
        });

        // Keep the worker running
        await new Promise(() => {});
    },
    { name: "emailQueueConsumer" }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Scheduled Tasks (Cron-like)</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const dailyCleanup = defineWorker(
    async (ctx) => {
        while (true) {
            const now = new Date();

            // Run at midnight
            if (now.getHours() === 0 && now.getMinutes() === 0) {
                console.log("Running daily cleanup...");
                await cleanupOldRecords();
                await pruneExpiredSessions();
                await generateDailyReport();
            }

            // Check every minute
            await new Promise((resolve) => setTimeout(resolve, 60000));
        }
    },
    { name: "dailyCleanup" }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Real-time Data Sync</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const priceSync = defineWorker(
    async (ctx) => {
        const ws = new WebSocket("wss://api.exchange.com/prices");

        ws.on("message", async (data) => {
            const prices = JSON.parse(data.toString());
            await updatePricesInDatabase(prices);
            await notifySubscribers(prices);
        });

        ws.on("close", () => {
            throw new Error("WebSocket connection closed");
        });

        // Keep the connection alive
        await new Promise(() => {});
    },
    {
        name: "priceSync",
        autoRestart: true,
        restartDelayMs: 5000,
    }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Cache Warmer</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";

export const cacheWarmer = defineWorker(
    async (ctx) => {
        // Initial warm-up
        console.log("Warming up cache...");
        await warmupProductCache();
        await warmupUserCache();
        await warmupConfigCache();

        // Periodic refresh
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 300000)); // Every 5 minutes
            await refreshHotCache();
        }
    },
    { name: "cacheWarmer" }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>SQS Consumer (AWS)</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });
const queueUrl = process.env.SQS_QUEUE_URL!;

export const sqsConsumer = defineWorker(
    async (ctx) => {
        while (true) {
            const { Messages } = await sqs.send(
                new ReceiveMessageCommand({
                    QueueUrl: queueUrl,
                    MaxNumberOfMessages: 10,
                    WaitTimeSeconds: 20, // Long polling
                })
            );

            if (Messages) {
                for (const message of Messages) {
                    try {
                        await processMessage(JSON.parse(message.Body!));
                        await sqs.send(
                            new DeleteMessageCommand({
                                QueueUrl: queueUrl,
                                ReceiptHandle: message.ReceiptHandle,
                            })
                        );
                    } catch (error) {
                        console.error("Failed to process message:", error);
                    }
                }
            }
        }
    },
    { name: "sqsConsumer" }
);`}
                    language="typescript"
                />
            </section>

            <section className="space-y-4">
                <Heading level={2}>Pub/Sub Subscriber (Redis)</Heading>
                <CodeBlock
                    code={`import { defineWorker } from "heliumts/server";
import Redis from "ioredis";

export const pubsubSubscriber = defineWorker(
    async (ctx) => {
        const subscriber = new Redis(process.env.REDIS_URL);

        subscriber.subscribe("notifications", "updates");

        subscriber.on("message", async (channel, message) => {
            const data = JSON.parse(message);

            switch (channel) {
                case "notifications":
                    await handleNotification(data);
                    break;
                case "updates":
                    await handleUpdate(data);
                    break;
            }
        });

        // Keep the subscriber running
        await new Promise(() => {});
    },
    { name: "pubsubSubscriber" }
);`}
                    language="typescript"
                />
            </section>
        </div>
    );
}
