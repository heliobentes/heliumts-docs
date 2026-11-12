import { setTimeout as delay } from "node:timers/promises";

import { defineMethod, PublicError } from "heliumts/server";

/** A deterministic demo: no provider, credentials, or database required. */
export const streamText = defineMethod(async function* (args: { prompt: string; failAfterFirstChunk?: boolean }, ctx) {
    const prompt = typeof args?.prompt === "string" ? args.prompt.trim().slice(0, 200) : "";
    if (!prompt) {
        throw new PublicError("Enter a short prompt to start the demo.");
    }
    const reply = `You sent this message.\n\n“${prompt}”\n\nThis reply arrives one chunk at a time over HTTP. If you stop it midway, the text received so far stays on screen.`;
    const words = reply.match(/\S+\s*/g) ?? [];
    for (let index = 0; index < words.length; index++) {
        if (ctx.signal.aborted) {
            return;
        }
        try {
            await delay(60, undefined, { signal: ctx.signal });
        } catch (error) {
            if (ctx.signal.aborted) {
                return;
            }
            throw error;
        }
        yield words[index];
        if (args.failAfterFirstChunk && index === 0) {
            throw new PublicError("Demo error after the first chunk. The partial reply is preserved.");
        }
    }
});
