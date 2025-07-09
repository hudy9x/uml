import { useBackground } from "@/hooks/useBackground";
import { ZoomableView } from "./ZoomableView";
import { Badge } from "./ui/badge";
import { Check, RefreshCcw } from "lucide-react";

interface UMLPreviewPanelProps {
  svgContent: string;
  hidden?: boolean;
}

export function UMLPreviewPanel({ svgContent, hidden }: UMLPreviewPanelProps) {
  const { previewBackground } = useBackground();
  return (
    <div className={`uml-preview-card relative ${hidden ? "hidden" : ""}`} 
      style={{ height: "100%", backgroundColor: previewBackground }}>
      
      <div className="absolute top-2 right-2">
        <Badge variant="outline" id="status-badge">
          <Check className="w-4 h-4" id="stt-icon-save" />
          <RefreshCcw className="w-4 h-4 animate-spin hidden" id="stt-icon-loading" />
          <span id="stt-text">Saved</span>
        </Badge>
      </div>
      <ZoomableView className="h-full">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="max-w-full h-[calc(100vh - 34px)] uml-preview"
        />
      </ZoomableView>
    </div>
  );
} 