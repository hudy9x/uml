import { createContext, useContext, useState, useCallback, useEffect, ReactNode, useMemo } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface MarkdownContextType {
  content: string;
  setContent: (content: string) => void;
  filename: string;
  filePath: string | null;
  saveFile: (content: string) => Promise<void>;
  reloadFile: () => Promise<void>;
}

interface SavingStateContextType {
  isSaving: boolean;
}

const MarkdownContext = createContext<MarkdownContextType | undefined>(undefined);
const SavingStateContext = createContext<SavingStateContextType>({ isSaving: false });

export function useMarkdownContent() {
  const context = useContext(MarkdownContext);
  if (!context) {
    throw new Error('useMarkdownContent must be used within MarkdownProvider');
  }
  return context;
}

export function useSavingState() {
  return useContext(SavingStateContext);
}

interface MarkdownProviderProps {
  children: ReactNode;
  initialContent?: string;
  filename?: string;
  filePath?: string | null;
}

export function MarkdownProvider({
  children,
  initialContent = '',
  filename = 'untitled.md',
  filePath = null
}: MarkdownProviderProps) {
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
      console.log('[MarkdownContext] ✅ File saved:', filePath);
    } catch (error) {
      console.error('[MarkdownContext] ❌ Failed to save file:', error);
    } finally {
      // Keep saving indicator visible for a brief moment
      setTimeout(() => setIsSaving(false), 300);
    }
  }, [filePath]);

  // Reload file function to refresh content from disk
  const reloadFile = useCallback(async () => {
    if (!filePath) return;

    try {
      const fileContent = await invoke<string>('read_file_content', { path: filePath });
      setContent(fileContent);
      console.log('[MarkdownContext] ✅ File reloaded:', filePath);
    } catch (error) {
      console.error('[MarkdownContext] ❌ Failed to reload file:', error);
    }
  }, [filePath]);

  // Memoize main context value (doesn't include isSaving)
  const contextValue = useMemo(() => ({
    content,
    setContent,
    filename,
    filePath,
    saveFile,
    reloadFile
  }), [content, filename, filePath, saveFile, reloadFile]);

  // Separate saving state context
  const savingValue = useMemo(() => ({ isSaving }), [isSaving]);

  return (
    <MarkdownContext.Provider value={contextValue}>
      <SavingStateContext.Provider value={savingValue}>
        {children}
      </SavingStateContext.Provider>
    </MarkdownContext.Provider>
  );
}
