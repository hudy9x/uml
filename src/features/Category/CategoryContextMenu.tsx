import { Pencil, Trash2 } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Category } from "@/databases/_types";
import { useCategoryStore } from "@/stores/category";

interface CategoryContextMenuProps {
  category: Category;
  onStartEdit: () => void;
  children: React.ReactNode;
}

export default function CategoryContextMenu({
  category,
  onStartEdit,
  children,
}: CategoryContextMenuProps) {
  const deleteExistingCategory = useCategoryStore(state => state.deleteExistingCategory);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteExistingCategory(category.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onStartEdit}>
          <Pencil className="mr-2 h-3.5 w-3.5" />
          <span>Rename</span>
        </ContextMenuItem>
        <ContextMenuItem 
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash2 className="mr-2 h-3.5 w-3.5" />
          <span>Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
} 