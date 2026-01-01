import Editor from '@monaco-editor/react';
import { useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { useMarkdownContent } from './MarkdownContext';

export function MarkdownEditor() {
  const { content, setContent, saveFile } = useMarkdownContent();
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
    <div className="h-[calc(100vh-90px)] w-full flex flex-col">
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
