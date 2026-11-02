import { defineHTTPRequest, defineMethod } from "heliumts/server";

type Task = {
    name: string;
    status: "open" | "closed";
    description: string;
    date: string;
    priority: number;
};

const generateTasks = () => {
    const tasks = [];
    for (let i = 1; i <= 1000; i++) {
        tasks.push({
            name: `Task name ${i}`,
            status: i % 2 === 0 ? "open" : "closed",
            description: `This is a very detailed description for task ${i}. It contains all the information you need to know about this task.`,
            date: "2026-01-01T00:00:00.000Z",
            priority: ((i - 1) % 5) + 1,
        });
    }
    return tasks as Task[];
};
const tasks = generateTasks();

// Both benchmark paths return the same deterministic payload, including across replicas.
export const getTasks = defineMethod(() => tasks);

export const getTasksByHttp = defineHTTPRequest("GET", "/api/get-tasks", () => {
    return Response.json(tasks, {
        headers: { "Cache-Control": "no-store" },
    });
});
