# HeliumTS Documentation

This repository contains the source code for the official documentation of [HeliumTS](https://github.com/heliobentes/heliumts/).

## Overview

The documentation site is built using:

- **HeliumTS 0.10.2**: HTTP-only typed RPC and streaming.
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
    npm install
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
