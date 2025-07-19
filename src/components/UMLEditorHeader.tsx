import { useState } from "react";
import { Input } from "./ui/input";
import { DiagramActionsDropdown } from "./DiagramActionsDropdown";
import { cn } from "../lib/utils";
import { useBackground } from "../hooks/useBackground";
import { useProjectStore } from "@/stores/project";
import { useParams } from "react-router-dom";

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
  const updateProjectName = useProjectStore((state) => state.updateProjectName);
  const { umlId } = useParams();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(projectName);

  const handleNameSave = async () => {
    if (editedName === projectName || !umlId) {
      setIsEditingName(false);
      return;
    }
    await updateProjectName(umlId, editedName);
    setIsEditingName(false);
  };

  const handleInputClick = () => {
    setIsEditingName(true);
    setEditedName(projectName);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
      setEditedName(projectName);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = () => {
    handleNameSave();
  };

  return (
    <div className={cn("flex items-center gap-2 px-3 py-2")} 
    style={{
      backgroundColor: editorBackground
    }} >
      <Input
        value={isEditingName ? editedName : projectName}
        readOnly={!isEditingName}
        onChange={(e) => setEditedName(e.target.value)}
        onKeyDown={handleNameKeyDown}
        onBlur={handleBlur}
        onClick={handleInputClick}
        className="max-w-[300px] bg-transparent cursor-pointer"
      />
      <DiagramActionsDropdown
        umlCode={umlCode}
        projectName={projectName}
        onOpenPreview={onOpenPreview}
      />
    </div>
  );
}
