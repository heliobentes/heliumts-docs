# HeliumTS Documentation

This repository contains the source code for the official documentation of [HeliumTS](https://github.com/heliobentes/heliumts/).

## Overview

The documentation site is built using:

- **HeliumTS**: The framework itself.
- **React**: UI library.
- **Vite**: Build tool.
- **TailwindCSS**: Styling.

## Getting Started

### Prerequisites

- Node.js (Latest LTS recommended)
- npm

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/heliobentes/heliumts/-docs.git
    cd heliumts/-docs
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
