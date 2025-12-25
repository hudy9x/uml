import { createContext, useContext, useState, ReactNode, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface DiagramContextType {
  content: string;
  setContent: (content: string) => void;
  filename: string;
  filePath: string | null;
  isSaving: boolean;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

export function useDiagramContent() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagramContent must be used within DiagramContainer');
  }
  return context;
}

export function DiagramProvider({
  initialContent,
  filename,
  filePath,
  children
}: {
  initialContent: string;
  filename: string;
  filePath: string | null;
  children: ReactNode;
}) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-save with 500ms debounce
  useEffect(() => {
    if (!filePath) return;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new timeout
    saveTimeoutRef.current = setTimeout(async () => {
      setIsSaving(true);
      try {
        await invoke('write_file_content', { path: filePath, content });
        console.log('File saved:', filePath);
      } catch (error) {
        console.error('Failed to save file:', error);
      } finally {
        // Keep saving indicator visible for a brief moment
        setTimeout(() => setIsSaving(false), 300);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, filePath]);

  return (
    <DiagramContext.Provider value={{ content, setContent, filename, filePath, isSaving }}>
      {children}
    </DiagramContext.Provider>
  );
}
