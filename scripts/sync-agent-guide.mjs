import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const check = process.argv.includes("--check");
const sourceArg = process.argv.find((arg) => arg.startsWith("--source="));
const sourcePath = sourceArg ? path.resolve(sourceArg.slice(9)) : path.resolve(root, "../heliumts/docs/agent-guide.md");
let source;
try {
    source = await readFile(sourcePath, "utf8");
} catch (error) {
    if (!check || error.code !== "ENOENT") throw new Error(`Cannot read canonical guide at ${sourcePath}. Pass --source=/path/to/heliumts/docs/agent-guide.md.`, { cause: error });
    source = await readFile(path.join(root, "public/agent-guide.md"), "utf8");
}

// The source-side generator is authoritative; retain an exact copy for standalone checks.
const generatorPath = path.resolve(path.dirname(sourcePath), "../scripts/agent-topics.mjs");
const localGeneratorPath = path.join(root, "scripts/agent-topics.mjs");
let generator;
try {
    generator = await readFile(generatorPath, "utf8");
} catch (error) {
    if (!check || error.code !== "ENOENT" || sourceArg) throw error;
    generator = await readFile(localGeneratorPath, "utf8");
}
if (check) {
    if (await readFile(localGeneratorPath, "utf8") !== generator) throw new Error("Topic generator copy is stale. Run npm run docs:sync.");
} else await writeFile(localGeneratorPath, generator);
const { generateTopics } = await import("./agent-topics.mjs");
const topicFiles = generateTopics(source);
const topicDirectory = path.join(root, "public/ai");
if (!check) await mkdir(topicDirectory, { recursive: true });
for (const name of await readdir(topicDirectory)) {
    if (!topicFiles.has(name)) throw new Error(`Unexpected generated topic: ${name}. Remove obsolete topics explicitly.`);
}

const data = JSON.stringify({ source: "heliumts/docs/agent-guide.md", sha256: createHash("sha256").update(source).digest("hex"), markdown: source }, null, 2) + "\n";
const index = `# HeliumTS\n\nReact/Vite framework: typed server methods, generated HTTP RPC references, routing, SSR and SSG.\nRead only the needed short task guide; each includes version and compatibility notes.\n\n- [Short task guide index](https://heliumts.com/ai/index.md)\n\nFull reference: [Markdown](https://heliumts.com/agent-guide.md) | [Human docs](https://heliumts.com/docs/ai)\n`;

for (const [relative, content] of [
    ["public/agent-guide.md", source],
    ...Array.from(topicFiles, ([name, content]) => [`public/ai/${name}`, content]),
    ["src/content/agent-guide.json", data],
    ["public/llms.txt", index],
]) {
    const destination = path.join(root, relative);
    if (check) {
        if ((await readFile(destination, "utf8")) !== content) throw new Error(`${relative} is stale. Run npm run docs:sync.`);
    } else {
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, content);
    }
}
console.log(check ? "Canonical guide copies match." : "Synced canonical guide, task references, site content and llms.txt.");
