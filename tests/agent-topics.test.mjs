import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { generateTopics } from "../scripts/agent-topics.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
test("published topics exactly match canonical guide sections", async () => {
    const source = await readFile(path.join(root, "public/agent-guide.md"), "utf8");
    for (const [name, expected] of generateTopics(source)) {
        assert.equal(await readFile(path.join(root, "public/ai", name), "utf8"), expected);
    }
});

test("standalone check works without framework checkout and rejects topic drift", async () => {
    const temp = await mkdtemp(path.join(os.tmpdir(), "helium-doc-topics-"));
    try {
        for (const name of ["scripts/sync-agent-guide.mjs", "scripts/agent-topics.mjs", "public/agent-guide.md", "public/llms.txt", "public/ai", "src/content/agent-guide.json"]) {
            const destination = path.join(temp, name);
            await mkdir(path.dirname(destination), { recursive: true });
            await cp(path.join(root, name), destination, { recursive: true });
        }
        const run = () => execFileSync(process.execPath, [path.join(temp, "scripts/sync-agent-guide.mjs"), "--check"], { encoding: "utf8", stdio: "pipe" });
        assert.match(run(), /copies match/);
        const index = path.join(temp, "public/ai/index.md");
        await writeFile(index, (await readFile(index, "utf8")) + "drift\n");
        assert.throws(run, /public\/ai\/index.md is stale/);
    } finally {
        await rm(temp, { recursive: true, force: true });
    }
});

test("web discovery stays compact and links the short-guide index and full reference", async () => {
    const index = await readFile(path.join(root, "public/llms.txt"), "utf8");
    assert.ok(Buffer.byteLength(index) <= 900, "llms.txt must remain a compact navigation index");
    assert.ok(index.includes("https://heliumts.com/ai/index.md"));
    assert.ok(!index.includes("https://heliumts.com/ai/index.json"));
    assert.ok(index.includes("https://heliumts.com/agent-guide.md"));
    assert.ok(index.includes("https://heliumts.com/docs/ai"));
    assert.ok(index.includes("version and compatibility notes"));
});
