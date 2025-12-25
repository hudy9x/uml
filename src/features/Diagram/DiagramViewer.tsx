import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { useDiagramContent } from './DiagramContext';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
});

export function DiagramViewer() {
  const { content } = useDiagramContent();
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

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
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-auto bg-background p-4 flex items-center justify-center"
    />
  );
}
