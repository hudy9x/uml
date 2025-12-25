import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { useRef } from 'react';
import { useTheme } from 'next-themes';
import { useDiagramContent } from './DiagramContext';
import { setupMermaidTheme } from '@/lib/monaco-theme';
import { registerFormatAction } from '@/lib/monaco-actions';
import { FileText } from 'lucide-react';

export function DiagramEditor() {
  const { content, setContent, filename } = useDiagramContent();
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);

  const handleBeforeMount: BeforeMount = (monaco) => {
    setupMermaidTheme(monaco);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register format action with Shift+Alt+F
    const handleFormat = (formattedCode: string) => {
      setContent(formattedCode);
    };

    registerFormatAction(editor, monaco, handleFormat);
  };

  // Determine Monaco theme based on app theme
  const monacoTheme = theme === 'dark' ? 'mermaid-dark' : 'mermaid-light';

  return (
    <div className="h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{filename}</span>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language="mermaid"
          value={content}
          onChange={(value) => setContent(value || '')}
          theme={monacoTheme}
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
    </div>
  );
}
