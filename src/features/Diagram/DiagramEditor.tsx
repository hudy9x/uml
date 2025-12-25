import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import { useDiagramContent } from './DiagramContext';
import { setupMermaidTheme, formatMermaidCode } from '@/lib/monaco-theme';
import type * as Monaco from 'monaco-editor';

export function DiagramEditor() {
  const { content, setContent } = useDiagramContent();
  const editorRef = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleBeforeMount: BeforeMount = (monaco) => {
    setupMermaidTheme(monaco);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register format command with Shift+Alt+F
    editor.addAction({
      id: 'format-mermaid',
      label: 'Format Mermaid Code',
      keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
      run: (ed) => {
        const currentContent = ed.getValue();
        const formatted = formatMermaidCode(currentContent);

        // Get current cursor position
        const position = ed.getPosition();

        // Update content
        ed.setValue(formatted);
        setContent(formatted);

        // Restore cursor position (approximately)
        if (position) {
          ed.setPosition(position);
        }
      },
    });
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
        onMount={handleEditorDidMount}
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
