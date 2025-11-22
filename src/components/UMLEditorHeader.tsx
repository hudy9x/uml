import { DiagramActionsDropdown } from "./DiagramActionsDropdown";
import { cn } from "../lib/utils";
import { useBackground } from "../hooks/useBackground";
import { File } from "lucide-react";

interface UMLEditorHeaderProps {
  projectName: string;
  umlCode: string;
  currentFilePath: string | null;
  onOpenPreview: () => void;
}

export function UMLEditorHeader({
  projectName,
  umlCode,
  currentFilePath,
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
      {/* Filename on the left */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <File size={14} className="opacity-70" />
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
