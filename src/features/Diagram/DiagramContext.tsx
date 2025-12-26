import { createContext, useContext, useState, ReactNode, useCallback, useMemo, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface DiagramContextType {
  content: string;
  setContent: (content: string) => void;
  filename: string;
  filePath: string | null;
  saveFile: (content: string) => Promise<void>;
}

interface SavingContextType {
  isSaving: boolean;
}

const DiagramContext = createContext<DiagramContextType | null>(null);
const SavingContext = createContext<SavingContextType>({ isSaving: false });

export function useDiagramContent() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagramContent must be used within DiagramContainer');
  }
  return context;
}

export function useSavingState() {
  return useContext(SavingContext);
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

  // Sync content when initialContent prop changes (e.g., when file is loaded)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Save file function that can be called manually
  const saveFile = useCallback(async (contentToSave: string) => {
    if (!filePath) return;

    setIsSaving(true);
    try {
      await invoke('write_file_content', { path: filePath, content: contentToSave });
      console.log('File saved:', filePath);
    } catch (error) {
      console.error('Failed to save file:', error);
    } finally {
      // Keep saving indicator visible for a brief moment
      setTimeout(() => setIsSaving(false), 300);
    }
  }, [filePath]);

  // Memoize main context value (doesn't include isSaving)
  const contextValue = useMemo(() => ({
    content,
    setContent,
    filename,
    filePath,
    saveFile
  }), [content, filename, filePath, saveFile]);

  // Separate saving state context
  const savingValue = useMemo(() => ({ isSaving }), [isSaving]);

  return (
    <DiagramContext.Provider value={contextValue}>
      <SavingContext.Provider value={savingValue}>
        {children}
      </SavingContext.Provider>
    </DiagramContext.Provider>
  );
}
