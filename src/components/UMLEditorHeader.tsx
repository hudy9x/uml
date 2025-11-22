import { DiagramActionsDropdown } from "./DiagramActionsDropdown";
import { cn } from "../lib/utils";
import { useBackground } from "../hooks/useBackground";

interface UMLEditorHeaderProps {
  projectName: string;
  umlCode: string;
  onOpenPreview: () => void;
}

export function UMLEditorHeader({
  projectName,
  umlCode,
  onOpenPreview,
}: UMLEditorHeaderProps) {
  const { editorBackground } = useBackground();

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2 justify-end")}
      style={{
        backgroundColor: editorBackground
      }} >
      <DiagramActionsDropdown
        umlCode={umlCode}
        projectName={projectName}
        onOpenPreview={onOpenPreview}
      />
    </div>
  );
}
