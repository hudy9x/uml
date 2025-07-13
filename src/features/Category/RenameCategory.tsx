import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Category } from "@/databases/_types";
import { useCategoryStore } from "@/stores/category";

interface RenameCategoryProps {
  category: Category;
  isEditing: boolean;
  onEditEnd: () => void;
}

export default function RenameCategory({
  category,
  isEditing,
  onEditEnd,
}: RenameCategoryProps) {
  const { updateExistingCategory } = useCategoryStore();
  const [editedName, setEditedName] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (editedName.trim() && editedName !== category.name) {
      await updateExistingCategory(category.id, { name: editedName.trim() });
    }
    onEditEnd();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      onEditEnd();
      setEditedName(category.name);
    }
  };

  const handleBlur = () => {
    onEditEnd();
    setEditedName(category.name);
  };

  return (
    <div className="flex items-center gap-1 flex-1" onClick={e => e.stopPropagation()}>
      <Input
        ref={inputRef}
        value={editedName}
        onChange={(e) => setEditedName(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="h-6 text-xs"
      />
      <Button
        variant="ghost"
        size="sm"
        className="h-6 px-2"
        onClick={handleSave}
      >
        OK
      </Button>
    </div>
  );
} 