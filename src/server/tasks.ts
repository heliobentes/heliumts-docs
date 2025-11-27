import { defineHTTPRequest, defineMethod } from "helium/server";

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
            date: new Date().toISOString(),
            priority: Math.ceil(Math.random() * 5),
        });
    }
    return tasks as Task[];
};
const tasks = generateTasks();

export const getTasks = defineMethod(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return tasks;
});

export const getTasksByHttp = defineHTTPRequest("GET", "/api/get-tasks", async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));

    return tasks;
});
