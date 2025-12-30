import Editor from '@monaco-editor/react';
import { useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useMarkdownContent } from './MarkdownContext';
import { FileText } from 'lucide-react';

export function MarkdownEditor() {
  const { content, setContent, filename, saveFile } = useMarkdownContent();
  const { theme } = useTheme();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced save handler with 500ms delay
  const handleContentChange = useCallback((value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout for 500ms
    saveTimeoutRef.current = setTimeout(() => {
      saveFile(newContent);
    }, 500);
  }, [setContent, saveFile]);

  // Determine Monaco theme based on app theme
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs-light';

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
          language="markdown"
          value={content}
          onChange={handleContentChange}
          theme={monacoTheme}
          options={{
            padding: { top: 10, bottom: 10 },
            minimap: { enabled: false },
            fontSize: 14,
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
