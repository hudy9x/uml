# UML Desktop Editor

![Uml editor](./public/uml-editor.png)

[![GitHub stars](https://img.shields.io/github/stars/hudy9x/uml?style=flat-square)](https://github.com/hudy9x/uml/stargazers)
[![GitHub commits](https://img.shields.io/github/commit-activity/m/hudy9x/uml?style=flat-square)](https://github.com/hudy9x/uml/commits/main)
[![GitHub release](https://img.shields.io/github/v/release/hudy9x/uml?style=flat-square)](https://github.com/hudy9x/uml/releases)
[![License](https://img.shields.io/github/license/hudy9x/uml?style=flat-square)](LICENSE)

A modern, intuitive desktop application for creating and editing UML diagrams with real-time rendering. Built using Tauri and React TypeScript, it combines native performance with a beautiful, modern UI powered by shadcn/ui components.

## ✨ Features

### Core Features
- 🚀 Real-time UML diagram rendering and preview
- 💻 Desktop-native performance with Tauri
- 🎨 Modern UI with shadcn/ui components
- 🌐 Cross-platform support (macOS, Windows, Linux)
- 📝 Code-based UML editing with syntax highlighting
- 🔄 Live preview updates
- 💾 Local project management and storage
- 🎯 Zoom and pan controls for diagram viewing
- 🌙 Light/Dark theme support

### Interactive Features
- 🎯 **Click-to-Jump**: Click any message in the preview to jump to the exact line in the code editor
- 🗑️ **Quick Delete**: Remove messages directly from the preview with a single click
- ✏️ **Inline Editing**: Edit message content directly from the preview without navigating to code
- 👁️ **Toggle Panels**: Show/hide explorer or code editor panels for focused workflow
- 📁 **File Explorer**: Browse and open UML files from your local folder structure


## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (Latest LTS version recommended)
- [pnpm](https://pnpm.io/) (Package manager)
- [Rust](https://www.rust-lang.org/) (for Tauri development)
- System dependencies for Tauri (see [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites))

## 🛠️ Development Setup

1. Clone the repository:
```bash
git clone https://github.com/hudy9x/uml.git
cd uml
```

2. Install dependencies:
```bash
pnpm install
```

3. Start development server:
```bash
pnpm tauri:dev
```

## 📜 Available Scripts

- `pnpm dev` - Start Vite development server
- `pnpm build` - Build the application (TypeScript compilation + Vite build)
- `pnpm preview` - Preview the built application
- `pnpm tauri` - Run Tauri commands
- `pnpm tauri:dev` - Start Tauri development environment

## 🏗️ Building for Production

To create a production build:

```bash
pnpm build
```

This will generate platform-specific binaries in the `src-tauri/target/release` directory.

## 🔧 Tech Stack

- [Tauri](https://tauri.app/) - Desktop application framework
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [CodeMirror](https://codemirror.net/) - Code editor component

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PlantUML](https://plantuml.com/) - UML diagram generation
- [Tauri](https://tauri.app/) - For making desktop development with web technologies amazing
- All our contributors and users who make this project better every day
