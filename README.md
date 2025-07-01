# UML Desktop Editor

A modern desktop application for creating and editing UML diagrams with real-time rendering, built using Tauri and React TypeScript.

## Features

- Real-time UML diagram rendering
- Desktop-native performance with Tauri
- Modern React TypeScript UI
- Cross-platform support

## Prerequisites

- Node.js (Latest LTS version recommended)
- pnpm (Package manager)
- Rust (for Tauri)
- System dependencies for Tauri (see [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Start development server:
```bash
pnpm tauri:dev
```

## Available Scripts

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build the application (TypeScript compilation + Vite build)
- `pnpm preview` - Preview the built application
- `pnpm tauri` - Run Tauri commands
- `pnpm tauri:dev` - Start Tauri development environment

## Building for Production

To create a production build:

```bash
pnpm build
```

## Tech Stack

- [Tauri](https://tauri.app/) - Desktop application framework
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## License

[Add your license information here]
