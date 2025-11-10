AGENTS.md — Repo agent guidance

Build / dev / app commands
- Run dev UI: `pnpm dev` (runs `vite`).
- Build web: `pnpm build` (runs `tsc && vite build`).
- Preview build: `pnpm preview`.
- Tauri app dev: `pnpm run app-dev`.
- Tauri app build: `pnpm run app-build`.

Tests & lint
- This repo has no test runner or linter configured by default.
- Recommended single-test workflow (Vitest): `pnpm add -D vitest @testing-library/react` then `pnpm vitest -t "Your test name"` to run a single test by name.
- Recommended lint command (ESLint): `pnpm add -D eslint` then `pnpm eslint "src/**/*.{ts,tsx}" --fix`.

Code style (agents must follow)
- Imports: group and order imports as: external packages → UI/lib → features/stores → relative imports; keep them sorted within groups.
- Formatting: use Prettier (or `prettier --write`) and TypeScript formatting rules; keep 2-space indent.
- Types: prefer explicit return types for exported functions/components; avoid `any` — use `unknown` and narrow instead.
- React components: `PascalCase` filenames and component names (e.g. `MyComponent.tsx`).
- Other files/variables: `camelCase` for functions/vars, `UPPER_SNAKE` for constants.
- Exports: prefer named exports; avoid default exports for shared modules.
- Error handling: do not swallow errors; log with `console.error` and return meaningful error objects or throw with context.
- Side effects: keep components pure where possible; push side effects to hooks or stores (`stores/`).

Tooling rules
- Cursor / Copilot rules: no `.cursor` or `.cursorrules` and no `.github/copilot-instructions.md` were found in repo — none to enforce.

Scope
- This file applies to the entire repository. Follow these rules when making edits, running commands, or authoring changes.