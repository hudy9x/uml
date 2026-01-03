import { Button } from '@/components/ui/button';
import { Code, Eye, Columns2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const EDITOR_MODE_KEY = 'markdown-editor-mode';

export type EditorMode = 'preview' | 'split' | 'code';

export function MarkdownActions() {
  const [mode, setMode] = useState<EditorMode>(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(EDITOR_MODE_KEY);
    return (saved as EditorMode) || 'preview'; // Default to preview
  });

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem(EDITOR_MODE_KEY, mode);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent('markdown-editor-mode-change', {
      detail: { mode }
    }));
  }, [mode]);

  const modes: { value: EditorMode; icon: typeof Eye; label: string }[] = [
    { value: 'preview', icon: Eye, label: 'Preview' },
    { value: 'split', icon: Columns2, label: 'Split' },
    { value: 'code', icon: Code, label: 'Code' },
  ];

  return (
    <div className="flex items-center gap-1 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-md p-1">
      {modes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={mode === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setMode(value)}
          className="h-7 px-2 gap-1.5"
          title={label}
        >
          <Icon className="h-3.5 w-3.5" />
          {/* <span className="text-xs">{label}</span> */}
        </Button>
      ))}
    </div>
  );
}

// Hook to use editor mode state
export function useEditorMode() {
  const [mode, setMode] = useState<EditorMode>(() => {
    const saved = localStorage.getItem(EDITOR_MODE_KEY);
    return (saved as EditorMode) || 'preview';
  });

  useEffect(() => {
    const handleModeChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ mode: EditorMode }>;
      setMode(customEvent.detail.mode);
    };

    window.addEventListener('markdown-editor-mode-change', handleModeChange);
    return () => window.removeEventListener('markdown-editor-mode-change', handleModeChange);
  }, []);

  return mode;
}

// Legacy hook for backward compatibility - maps to boolean
export function useEditorVisibility() {
  const mode = useEditorMode();
  return mode === 'split' || mode === 'code';
}
