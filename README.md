# HeliumTS Documentation

This repository contains the source code for the official documentation of [HeliumTS](https://github.com/heliobentes/heliumts/).

## Overview

The documentation site is built using:

- **HeliumTS 0.11.0 release**: generated typed HTTP RPC references and length-prefixed MessagePack streaming over HTTP.
- **React**: UI library.
- **Vite**: Build tool.
- **TailwindCSS**: Styling.

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/heliobentes/heliumts-docs.git
    cd heliumts-docs
    ```

2. Install dependencies:
    ```bash
    npm ci
    ```

### Development

To start the development server:

```bash
npm run dev
```

This will start the Helium development server. Open your browser to the address shown in the terminal.

### Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Project Structure

- `src/pages/`: Contains the application routes and documentation pages.
    - `docs/`: Documentation content pages (CLI, Configuration, Routing, etc.).
- `src/components/`: Reusable UI components.
- `helium.config.ts`: Configuration for the Helium server.

## Streaming and migration

Open `/streaming` for the deterministic streaming demo. It uses `defineMethod(async function*)` and `useStreaming` without a provider SDK or credentials. The guide is at `/docs/core-concepts/rpc/streaming`; `/docs/getting-started/migration-0-10` explains removed connection APIs and config.

Run `npm test` for the deterministic streaming, cancellation, and partial-error regressions.

## Compact agent reference

The framework's `docs/agent-guide.md` is the single source for `/docs/ai`, `/agent-guide.md` and `/llms.txt`. Run `npm run docs:sync` from a sibling checkout or `npm run docs:sync -- --source=/path/to/agent-guide.md`. `npm run docs:check` detects drift; without a sibling checkout it checks internal consistency against the committed Markdown copy. The full long-form documentation has not been migrated.

## Release and deployment

The website targets HeliumTS 0.11.1. Install the published dependency with `npm ci` and verify `npm test`, `npm run lint`, `npx tsc --noEmit` and `npm run build` before release. The existing DigitalOcean App Platform service `helium-docs` deploys this repository’s `main` branch automatically, builds with `npm run build`, and runs with `npm start`. Preserve that deployment target and verify the deployed commit after pushing.

The homepage and agent workflow describe typed RPC, explicit loading/error/refresh, server input validation and related-read invalidation. Agent guides remain generated from the framework source.
