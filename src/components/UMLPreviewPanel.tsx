import { useBackground } from "@/hooks/useBackground";
import { ZoomableView } from "./ZoomableView";

interface UMLPreviewPanelProps {
  svgContent: string;
  hidden?: boolean;
}

export function UMLPreviewPanel({ svgContent, hidden }: UMLPreviewPanelProps) {
  const { previewBackground } = useBackground();
  return (
    <div className={`uml-preview-card ${hidden ? "hidden" : ""}`} style={{ height: "100%", backgroundColor: previewBackground }}>
      <ZoomableView className="h-full">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="max-w-full h-[calc(100vh - 34px)] uml-preview"
        />
      </ZoomableView>
    </div>
  );
} 