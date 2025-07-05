import { Card } from "./ui/card";
import { ZoomableView } from "./ZoomableView";

interface UMLPreviewPanelProps {
  svgContent: string;
  hidden?: boolean;
}

export function UMLPreviewPanel({ svgContent, hidden }: UMLPreviewPanelProps) {
  return (
    <Card className={`h-full rounded-lg border-0 ${hidden ? "hidden" : ""}`}>
      <ZoomableView className="h-full">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="max-w-full max-h-full"
        />
      </ZoomableView>
    </Card>
  );
} 