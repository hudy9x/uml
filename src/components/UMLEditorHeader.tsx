import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft } from "lucide-react";
import { ExportActionsDropdown } from "./ExportActionsDropdown";

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
    <div className="flex items-center gap-4 pr-3">
      <Button variant="default" size="icon" onClick={() => navigate("/")}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 flex-1">
        <div className="flex items-center gap-2 flex-1">
          <Input
            value={isEditingName ? editedName : projectName}
            readOnly={!isEditingName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleNameKeyDown}
            onBlur={handleBlur}
            onClick={handleInputClick}
            className="max-w-[300px] text-white bg-transparent border-none cursor-pointer hover:border-white focus:border-white"
          />
          <ExportActionsDropdown
            umlCode={umlCode}
            projectName={projectName}
            onOpenPreview={onOpenPreview}
          />
        </div>
      </div>
    </div>
  );
} 