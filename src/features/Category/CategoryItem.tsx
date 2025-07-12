import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight, X, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/databases/_types";
import { cn } from "@/lib/utils";

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  onToggle: (categoryId: string) => void;
  onDelete: (e: React.MouseEvent, categoryId: string) => void;
  onUpdate: (categoryId: string, name: string) => Promise<void>;
}

export default function CategoryItem({
  category,
  isExpanded,
  onToggle,
  onDelete,
  onUpdate,
}: CategoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditedName(category.name);
  };

  const handleSave = async () => {
    if (editedName.trim() && editedName !== category.name) {
      await onUpdate(category.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditedName(category.name);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditedName(category.name);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isEditing) {
      onToggle(category.id);
    }
  };

  return (
    <div className="text-sm">
      <div
        className={cn(
          "flex items-center px-2 py-1 hover:bg-background/70 rounded-sm group",
          !isEditing && "cursor-pointer"
        )}
        onClick={handleClick}
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3 mr-1 shrink-0" />
        ) : (
          <ChevronRight className="h-3 w-3 mr-1 shrink-0" />
        )}

        {isEditing ? (
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
        ) : (
          <>
            <span className="text-xs truncate flex-1">{category.name} {category.position}</span>
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-secondary hover:text-primary"
                onClick={handleEdit}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-secondary hover:text-destructive"
                onClick={(e) => onDelete(e, category.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </>
        )}
      </div>
      {isExpanded && (
        <div className="pl-6">
          {/* TODO: Add projects belonging to this category */}
        </div>
      )}
    </div>
  );
} 