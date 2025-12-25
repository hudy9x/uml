import Editor, { BeforeMount } from '@monaco-editor/react';
import { useDiagramContent } from './DiagramContext';
import { setupMermaidTheme } from '@/lib/monaco-theme';

export function DiagramEditor() {
  const { content, setContent } = useDiagramContent();

  const handleBeforeMount: BeforeMount = (monaco) => {
    setupMermaidTheme(monaco);
  };

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        language="mermaid"
        value={content}
        onChange={(value) => setContent(value || '')}
        theme="mermaid-dark"
        beforeMount={handleBeforeMount}
        options={{
          minimap: { enabled: false },
          fontSize: 12,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: false,
          autoIndent: 'full',
          wordWrap: 'on',
          formatOnPaste: false,
          formatOnType: false,
        }}
      />
    </div>
  );
}
