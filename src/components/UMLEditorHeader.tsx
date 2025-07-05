import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ChevronLeft, ExternalLink, FileDown } from "lucide-react";
import { DownloadDiagramButton } from "./DownloadDiagramButton";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { toast } from "sonner";

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

  const handleSaveUMLCode = async () => {
    if (!umlCode) {
      toast.error('No UML code to save');
      return;
    }

    try {
      const filePath = await save({
        defaultPath: `${projectName || 'diagram'}.pu`,
        filters: [{
          name: 'PlantUML',
          extensions: ['pu']
        }]
      });

      if (filePath) {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(umlCode);
        await writeFile(filePath, uint8Array);
        toast.success('UML code saved successfully!');
      }
    } catch (error) {
      console.error('Error saving UML code:', error);
      toast.error('Failed to save UML code');
    }
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
          <DownloadDiagramButton umlCode={umlCode} projectName={projectName} />
          <Button
            variant="default"
            size="icon"
            onClick={handleSaveUMLCode}
            disabled={!umlCode}
            title="Save as PlantUML file"
          >
            <FileDown className="h-4 w-4" />
          </Button>
          <Button
            variant="default"
            size="icon"
            onClick={onOpenPreview}
            disabled={!umlCode}
            title="Open in new window"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 