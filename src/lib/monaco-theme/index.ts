import type { Monaco } from '@monaco-editor/react';
import { registerMermaidLanguage } from './mermaid-language';
import { registerMermaidThemes } from './mermaid-themes';

export function setupMermaidTheme(monaco: Monaco) {
  registerMermaidLanguage(monaco);
  registerMermaidThemes(monaco);
}

export { registerMermaidLanguage, registerMermaidThemes };
export { formatMermaidCode } from './mermaid-formatter';
