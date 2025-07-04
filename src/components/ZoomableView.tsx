import { ZoomIn, ZoomOut } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button } from './ui/button';

interface ZoomableViewProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

export function ZoomableView({
  children,
  className = '',
  minScale = 0.5,
  maxScale = 4,
  initialScale = 1,
}: ZoomableViewProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          onClick={() => document.querySelector('.react-transform-wrapper')?.dispatchEvent(
            new WheelEvent('wheel', { deltaY: -100, ctrlKey: true })
          )}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          onClick={() => document.querySelector('.react-transform-wrapper')?.dispatchEvent(
            new WheelEvent('wheel', { deltaY: 100, ctrlKey: true })
          )}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        {/* <Button
          variant="secondary"
          size="icon"
          onClick={() => document.querySelector('.react-transform-wrapper')?.dispatchEvent(
            new CustomEvent('resetTransform')
          )}
        >
          <Maximize className="h-4 w-4" />
        </Button> */}
      </div>
      <TransformWrapper
        initialScale={initialScale}
        minScale={minScale}
        maxScale={maxScale}
        wheel={{ disabled: false, touchPadDisabled: false }}
        centerOnInit={true}
        limitToBounds={false}
        alignmentAnimation={{ disabled: true }}
        centerZoomedOut={false}
      >
        <TransformComponent 
          wrapperClass="!w-full !h-full" 
          contentClass="!w-full !h-full flex items-center justify-center p-4"
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
