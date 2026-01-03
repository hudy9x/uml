import type { Monaco } from '@monaco-editor/react';

export function registerMermaidThemes(monaco: Monaco) {
  // Dark theme
  monaco.editor.defineTheme('mermaid-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.diagram', foreground: '4EC9B0', fontStyle: 'bold' },
      { token: 'keyword.direction', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'keyword.block', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'keyword.sequence', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'keyword.class', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'keyword.state', foreground: 'C586C0', fontStyle: 'bold' },
      { token: 'keyword.style', foreground: '9CDCFE' },
      { token: 'operator.arrow', foreground: '569CD6', fontStyle: 'bold' },
      { token: 'string', foreground: 'CE9178' },
      { token: 'string.link', foreground: 'CE9178' },
      { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
      { token: 'constant.color', foreground: '4FC1FF' },
      { token: 'number', foreground: 'B5CEA8' },
      { token: 'type.identifier', foreground: 'DCDCAA' },
      { token: 'identifier', foreground: 'D4D4D4' },
      { token: 'delimiter.bracket', foreground: 'FFD700' },
      { token: 'delimiter.angle', foreground: '808080' },
    ],
    colors: {
      'editor.background': '#1E1E1E',
      'editor.foreground': '#D4D4D4',
      'editorLineNumber.foreground': '#858585',
      'editor.selectionBackground': '#264F78',
      'editor.inactiveSelectionBackground': '#3A3D41',
    },
  });

  // Light theme
  monaco.editor.defineTheme('mermaid-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword.diagram', foreground: '008080', fontStyle: 'bold' },
      { token: 'keyword.direction', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'keyword.block', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'keyword.sequence', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'keyword.class', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'keyword.state', foreground: 'AF00DB', fontStyle: 'bold' },
      { token: 'keyword.style', foreground: '001080' },
      { token: 'operator.arrow', foreground: '0000FF', fontStyle: 'bold' },
      { token: 'string', foreground: 'A31515' },
      { token: 'string.link', foreground: 'A31515' },
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'constant.color', foreground: '0070C1' },
      { token: 'number', foreground: '098658' },
      { token: 'type.identifier', foreground: '795E26' },
      { token: 'identifier', foreground: '000000' },
      { token: 'delimiter.bracket', foreground: 'C88400' },
      { token: 'delimiter.angle', foreground: '808080' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
      'editorLineNumber.foreground': '#237893',
      'editor.selectionBackground': '#ADD6FF',
      'editor.inactiveSelectionBackground': '#E5EBF1',
    },
  });
}
