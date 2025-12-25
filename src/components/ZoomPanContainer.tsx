import { useRef, useState, useCallback, useEffect, ReactNode } from 'react';
import { ZoomConfig, defaultZoomConfig } from './zoomConfig';

interface ZoomPanContainerProps {
  children: ReactNode;
  config?: Partial<ZoomConfig>;
  className?: string;
}

export function ZoomPanContainer({
  children,
  config: userConfig,
  className = ''
}: ZoomPanContainerProps) {
  const config = { ...defaultZoomConfig, ...userConfig };

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(config.initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Clamp zoom value within min/max bounds
  const clampZoom = useCallback((value: number) => {
    return Math.min(Math.max(value, config.minZoom), config.maxZoom);
  }, [config.minZoom, config.maxZoom]);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();

    const delta = -e.deltaY * config.wheelZoomSpeed;
    const newZoom = clampZoom(zoom + delta);

    if (newZoom !== zoom) {
      // Zoom towards mouse cursor position
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate the point under the mouse in content coordinates
        const contentX = (mouseX - pan.x) / zoom;
        const contentY = (mouseY - pan.y) / zoom;

        // Calculate new pan to keep the same point under the mouse
        const newPan = {
          x: mouseX - contentX * newZoom,
          y: mouseY - contentY * newZoom,
        };

        setPan(newPan);
      }

      setZoom(newZoom);
    }
  }, [zoom, pan, config.wheelZoomSpeed, clampZoom]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only start dragging on left mouse button
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  }, [pan]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  // Handle mouse up to stop panning
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Programmatic zoom controls
  const zoomIn = useCallback(() => {
    setZoom(prev => clampZoom(prev + config.zoomStep));
  }, [config.zoomStep, clampZoom]);

  const zoomOut = useCallback(() => {
    setZoom(prev => clampZoom(prev - config.zoomStep));
  }, [config.zoomStep, clampZoom]);

  const resetZoom = useCallback(() => {
    setZoom(config.initialZoom);
    setPan({ x: 0, y: 0 });
  }, [config.initialZoom]);

  // Attach wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

  // Attach mouse move and up listeners when dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        }}
      >
        {children}
      </div>

      {/* Zoom controls overlay */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
        <button
          onClick={zoomIn}
          className="w-10 h-10 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border hover:bg-accent flex items-center justify-center"
          title="Zoom In"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <line x1="11" x2="11" y1="8" y2="14" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </button>
        <button
          onClick={zoomOut}
          className="w-10 h-10 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border hover:bg-accent flex items-center justify-center"
          title="Zoom Out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
            <line x1="8" x2="14" y1="11" y2="11" />
          </svg>
        </button>
        <button
          onClick={resetZoom}
          className="w-10 h-10 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border hover:bg-accent flex items-center justify-center"
          title="Reset Zoom"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
        </button>
        <div className="w-10 h-10 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border flex items-center justify-center text-xs font-medium">
          {Math.round(zoom * 100)}%
        </div>
      </div>
    </div>
  );
}
