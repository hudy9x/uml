import { Maximize2, ZoomIn, ZoomOut } from "lucide-react";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";
import { Button } from "./ui/button";
import { ErrorBoundary } from "./ErrorBoundary";

interface ZoomableViewProps {
  children: React.ReactNode;
  className?: string;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
}

// Separate component for controls to ensure useControls is used within context
function Controls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();

  return (
    <div className="absolute -bottom-4 left-2 flex gap-2 z-10">
      <div className="flex flex-col gap-2">
        <Button variant="outline" size="icon" onClick={() => zoomIn()}>
          <ZoomIn />
        </Button>
        <Button variant="outline" size="icon" onClick={() => zoomOut()}>
          <ZoomOut />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => resetTransform()}
        >
          <Maximize2 />
        </Button>
      </div>
    </div>
  );
}

function ZoomableViewContent({
  children,
  className = "",
  minScale = 0.5,
  maxScale = 4,
  initialScale = 1,
}: ZoomableViewProps) {
  return (
    <div className={`relative ${className}`}>
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
        {/* Controls must be inside TransformWrapper to access context */}
        <Controls />
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

export function ZoomableView(props: ZoomableViewProps) {
  return (
    <ErrorBoundary>
      <ZoomableViewContent {...props} />
    </ErrorBoundary>
  );
}
