import { Button } from '@/components/ui/button';
import { Code, Eye } from 'lucide-react';
import { useEffect, useState } from 'react';

const EDITOR_VISIBLE_KEY = 'mermaid-editor-visible';

export function DiagramActions() {
  const [isEditorVisible, setIsEditorVisible] = useState(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem(EDITOR_VISIBLE_KEY);
    return saved !== null ? saved === 'true' : true; // Default to visible
  });

  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem(EDITOR_VISIBLE_KEY, String(isEditorVisible));

    // Dispatch custom event to notify DiagramContainer
    window.dispatchEvent(new CustomEvent('editor-visibility-change', {
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
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    const handleVisibilityChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ visible: boolean }>;
      setIsVisible(customEvent.detail.visible);
    };

    window.addEventListener('editor-visibility-change', handleVisibilityChange);
    return () => window.removeEventListener('editor-visibility-change', handleVisibilityChange);
  }, []);

  return isVisible;
}
