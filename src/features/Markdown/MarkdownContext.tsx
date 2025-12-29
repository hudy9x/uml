import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { invoke } from '@tauri-apps/api/core';

interface MarkdownContextType {
  content: string;
  setContent: (content: string) => void;
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
  filePath?: string | null;
}

export function MarkdownProvider({ children, initialContent = '', filePath }: MarkdownProviderProps) {
  const [content, setContentState] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);

  // Update content when initialContent changes
  useEffect(() => {
    setContentState(initialContent);
  }, [initialContent]);

  const setContent = useCallback(
    (newContent: string) => {
      setContentState(newContent);

      // Auto-save logic (debounced)
      if (filePath) {
        // Clear existing timeout
        if (saveTimeout) {
          clearTimeout(saveTimeout);
        }

        // Set new timeout for saving
        const timeout = setTimeout(async () => {
          setIsSaving(true);
          try {
            await invoke('write_file_content', {
              path: filePath,
              content: newContent,
            });
            console.log('[MarkdownContext] ✅ File saved:', filePath);
          } catch (error) {
            console.error('[MarkdownContext] ❌ Failed to save file:', error);
          } finally {
            setIsSaving(false);
          }
        }, 500);

        setSaveTimeout(timeout);
      }
    },
    [filePath, saveTimeout]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [saveTimeout]);

  return (
    <MarkdownContext.Provider value={{ content, setContent }}>
      <SavingStateContext.Provider value={{ isSaving }}>
        {children}
      </SavingStateContext.Provider>
    </MarkdownContext.Provider>
  );
}
