import { Button } from '@/components/ui/button';
import { Code, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

const EDITOR_VISIBLE_KEY = 'markdown-editor-visible';

export function MarkdownActions() {
  const [isEditorVisible, setIsEditorVisible] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(EDITOR_VISIBLE_KEY);
    return saved !== null ? saved === 'true' : false; // Default to hidden (preview only)
  });

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem(EDITOR_VISIBLE_KEY, String(isEditorVisible));

    // Dispatch custom event to notify MarkdownContainer
    window.dispatchEvent(new CustomEvent('markdown-editor-visibility-change', {
      detail: { visible: isEditorVisible }
    }));
  }, [isEditorVisible]);

  const toggleEditor = () => {
    setIsEditorVisible(prev => !prev);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleEditor}
      className="h-8 gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      title={isEditorVisible ? 'Hide Editor' : 'Show Editor'}
    >
      {isEditorVisible ? (
        <>
          <Eye className="h-4 w-4" />
          <span className="text-xs">Preview Only</span>
        </>
      ) : (
        <>
          <Code className="h-4 w-4" />
          <span className="text-xs">Show Editor</span>
        </>
      )}
    </Button>
  );
}

// Hook to use editor visibility state
export function useEditorVisibility() {
  const [isVisible, setIsVisible] = useState(() => {
    const saved = localStorage.getItem(EDITOR_VISIBLE_KEY);
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    const handleVisibilityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setIsVisible(customEvent.detail.visible);
    };

    window.addEventListener('markdown-editor-visibility-change', handleVisibilityChange);
    return () => window.removeEventListener('markdown-editor-visibility-change', handleVisibilityChange);
  }, []);

  return isVisible;
}
