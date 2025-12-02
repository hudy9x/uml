import { DiagramActionsDropdown } from "./DiagramActionsDropdown";
import { cn } from "../lib/utils";
import { useBackground } from "../hooks/useBackground";
import { File, PanelLeft, AlertCircle, ExternalLink, PanelBottomClose, PanelBottomOpen } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface UMLEditorHeaderProps {
  projectName: string;
  umlCode: string;
  currentFilePath: string | null;
  isExplorerVisible: boolean;
  isEditorVisible: boolean;
  errorCount?: number;
  onToggleExplorer: () => void;
  onToggleEditor: () => void;
  onOpenPreview: () => void;
}

export function UMLEditorHeader({
  projectName,
  umlCode,
  currentFilePath,
  isExplorerVisible,
  isEditorVisible,
  errorCount = 0,
  onToggleExplorer,
  onToggleEditor,
  onOpenPreview,
}: UMLEditorHeaderProps) {
  const { editorBackground } = useBackground();

  // Extract filename from path
  const filename = currentFilePath
    ? currentFilePath.split(/[/\\]/).pop()
    : "No file selected";

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 justify-between border-b")}
      style={{
        backgroundColor: editorBackground
      }} >
      {/* Filename on the left with toggle button when explorer is hidden */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {isExplorerVisible ? (
          <File size={14} className="opacity-70" />
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 -ml-1"
            onClick={onToggleExplorer}
            title="Show Explorer"
          >
            <PanelLeft size={14} />
          </Button>
        )}
        <span className="font-medium">{filename}</span>

        {/* Error count badge */}
        {errorCount > 0 && (
          <Badge variant="destructive" className="h-5 px-1.5 text-xs flex items-center gap-1">
            <AlertCircle size={12} />
            {errorCount}
          </Badge>
        )}
      </div>

      {/* Actions on the right */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onToggleEditor}
          title={isEditorVisible ? "Hide Editor" : "Show Editor"}
        >
          {isEditorVisible ? <PanelBottomClose size={14} /> : <PanelBottomOpen size={14} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={onOpenPreview}
          title="Open in new window"
        >
          <ExternalLink size={14} />
        </Button>
        <DiagramActionsDropdown
          umlCode={umlCode}
          projectName={projectName}
        />
      </div>
    </div>
  );
}
