import { DiagramActionsDropdown } from "./DiagramActionsDropdown";
import { cn } from "../lib/utils";
import { useBackground } from "../hooks/useBackground";
import { File, PanelLeft } from "lucide-react";
import { Button } from "./ui/button";

interface UMLEditorHeaderProps {
  projectName: string;
  umlCode: string;
  currentFilePath: string | null;
  isExplorerVisible: boolean;
  onToggleExplorer: () => void;
  onOpenPreview: () => void;
}

export function UMLEditorHeader({
  projectName,
  umlCode,
  currentFilePath,
  isExplorerVisible,
  onToggleExplorer,
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
      </div>

      {/* Actions on the right */}
      <DiagramActionsDropdown
        umlCode={umlCode}
        projectName={projectName}
        onOpenPreview={onOpenPreview}
      />
    </div>
  );
}
