import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const temporaryDirectory = await mkdtemp(path.join(tmpdir(), "helium-streaming-test-"));
const source = await readFile(new URL("../src/server/streaming.ts", import.meta.url), "utf8");
const compiled = ts
    .transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    })
    .outputText.replaceAll('"heliumts/server"', JSON.stringify(import.meta.resolve("heliumts/server")));
const modulePath = path.join(temporaryDirectory, "streaming.mjs");
await writeFile(modulePath, compiled);
const { streamText } = await import(pathToFileURL(modulePath).href);
test.after(() => rm(temporaryDirectory, { recursive: true, force: true }));

function run(args, signal = new AbortController().signal) {
    return streamText.handler(args, { signal });
}

test("the demo streams typed words without a provider or database", async () => {
    const chunks = [];
    for await (const chunk of run({ prompt: "  How does streaming work?  " })) chunks.push(chunk);
    assert.ok(chunks.length > 5);
    assert.ok(chunks.every((chunk) => typeof chunk === "string"));
    assert.equal(
        chunks.join(""),
        "You sent this message.\n\n“How does streaming work?”\n\nThis reply arrives one chunk at a time over HTTP. If you stop it midway, the text received so far stays on screen."
    );
});

test("cancelling pending work stops future chunks and closes the generator", async () => {
    const controller = new AbortController();
    const stream = run({ prompt: "Helium" }, controller.signal);
    assert.deepEqual(await stream.next(), { value: "You ", done: false });
    const pending = stream.next();
    controller.abort();
    assert.deepEqual(await pending, { value: undefined, done: true });
    assert.deepEqual(await stream.next(), { value: undefined, done: true });
});

test("a simulated error preserves the previously emitted chunk", async () => {
    const stream = run({ prompt: "Helium", failAfterFirstChunk: true });
    const first = await stream.next();
    assert.deepEqual(first, { value: "You ", done: false });
    await assert.rejects(stream.next(), /Demo error after the first chunk/);
});

test("empty prompts fail before emitting a chunk", async () => {
    await assert.rejects(run({ prompt: "   " }).next(), /Enter a short prompt/);
});
