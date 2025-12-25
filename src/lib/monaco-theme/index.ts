import type { Monaco } from '@monaco-editor/react';
import { registerMermaidLanguage } from './mermaid-language';
import { registerMermaidThemes } from './mermaid-themes';

export function setupMermaidEditor(monaco: Monaco) {
  registerMermaidLanguage(monaco);
  registerMermaidThemes(monaco);
}

export { registerMermaidLanguage, registerMermaidThemes };
