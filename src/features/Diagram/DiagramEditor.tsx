import Editor from '@monaco-editor/react';
import { useDiagramContent } from './DiagramContext';

export function DiagramEditor() {
  const { content, setContent } = useDiagramContent();

  return (
    <div className="h-full w-full">
      <Editor
        height="100%"
        defaultLanguage="markdown"
        value={content}
        onChange={(value) => setContent(value || '')}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 12,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
        }}
      />
    </div>
  );
}
