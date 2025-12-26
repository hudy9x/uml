import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import mermaid from 'mermaid';
import { useDiagramContent, useSavingState } from './DiagramContext';
import { DiagramActions } from './DiagramActions';
import { Loader2 } from 'lucide-react';
import { ZoomPanContainer } from '@/components/ZoomPanContainer';

export function DiagramViewer() {
  const { content } = useDiagramContent();
  const { isSaving } = useSavingState();
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  // Update mermaid theme when app theme changes
  useEffect(() => {
    const isDark = theme === 'dark';
    mermaid.initialize({
      startOnLoad: false,
      // theme: theme === 'dark' ? 'dark' : 'default',
      theme: "base",
      themeVariables: {
        primaryColor: '#e3e3f1',
        primaryTextColor: '#000',
        primaryBorderColor: isDark ? '#646464ff' : '#323232ff',
        lineColor: isDark ? '#fff' : '#000',
        secondaryColor: '#006100',
        tertiaryColor: isDark ? '#221919ff' : '#000',
      },
      securityLevel: 'loose',
      suppressErrorRendering: true, // Prevent Mermaid from creating error elements in body
    });
  }, [theme]);

  useEffect(() => {
    if (!containerRef.current || !content.trim()) {
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div class="flex items-center justify-center h-full text-muted-foreground">Enter Mermaid syntax to see preview</div>';
      }
      return;
    }

    const renderId = `mermaid-${Date.now()}-${renderIdRef.current++}`;

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(renderId, content);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid render error:', error);

        // Clean up any error elements that Mermaid might have created
        const errorElement = document.getElementById(renderId);
        if (errorElement && errorElement.parentNode === document.body) {
          document.body.removeChild(errorElement);
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full p-4">
              <div class="text-destructive">
                <p class="font-semibold">Invalid Mermaid Syntax</p>
                <p class="text-sm mt-2">${error instanceof Error ? error.message : 'Unknown error'}</p>
              </div>
            </div>
          `;
        }
      }
    };

    renderDiagram();
  }, [content, theme]); // Re-render when theme changes

  return (
    <div className="h-full w-full relative bg-background dot-pattern">
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        {isSaving && (
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Saving...</span>
          </div>
        )}
        <DiagramActions />
      </div>
      <ZoomPanContainer className="h-full w-full">
        <div
          ref={containerRef}
          className="w-full p-4 flex items-center justify-center"
        />
      </ZoomPanContainer>
    </div>
  );
}
