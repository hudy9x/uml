import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft } from "lucide-react";
import { DiagramActionsDropdown } from "./DiagramActionsDropdown";

interface UMLEditorHeaderProps {
  projectName: string;
  umlCode: string;
  onProjectNameChange: (name: string) => Promise<void>;
  onOpenPreview: () => void;
}

export function UMLEditorHeader({
  projectName,
  umlCode,
  onProjectNameChange,
  onOpenPreview,
}: UMLEditorHeaderProps) {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(projectName);

  const handleNameSave = async () => {
    if (editedName === projectName) {
      setIsEditingName(false);
      return;
    }
    await onProjectNameChange(editedName);
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
    <div className="flex items-center gap-2 px-3 py-2">
      <Input
        value={isEditingName ? editedName : projectName}
        readOnly={!isEditingName}
        onChange={(e) => setEditedName(e.target.value)}
        onKeyDown={handleNameKeyDown}
        onBlur={handleBlur}
        onClick={handleInputClick}
        className="max-w-[300px]  bg-transparent cursor-pointer"
      />
      <DiagramActionsDropdown
        umlCode={umlCode}
        projectName={projectName}
        onOpenPreview={onOpenPreview}
      />
    </div>
  );
}
