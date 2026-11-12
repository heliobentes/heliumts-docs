# HeliumTS documentation

This site uses HeliumTS with HTTP RPC, length-prefixed MessagePack streaming over HTTP and file routes. Keep examples compatible with their stated package version. Mark new framework/scaffolder commands unreleased until a coordinated release. Keep feature descriptions factual and compatible with the documented version.

The compact reference is authored in the framework repository at docs/agent-guide.md. Run npm run docs:sync with the sibling heliumts checkout, or pass --source=/absolute/path/to/agent-guide.md. Do not edit public/agent-guide.md, public/ai/*.md, src/content/agent-guide.json or scripts/agent-topics.mjs by hand. The framework owns the canonical guide and topic generator; docs:sync copies the generator and derives the small topic index and every topic directly from guide sections. npm run docs:check verifies copies and generated topics, including source and generator drift when the sibling is available; without that checkout it verifies against the checked-in guide and generator. Read public/ai/index.md first and only the relevant topic when helping with an app. Focused long-form pages remain maintained separately.

Verify npm test, npm run lint, TypeScript and npm run build. Build/test new commands against a local framework package before release. Do not edit generated RPC declarations.
