import { ChevronDown } from "lucide-react";
import { Category } from "@/databases/_types";
import { cn } from "@/lib/utils";
import CategoryActions from "./CategoryActions";
import AddCategoryButton from "./AddCategoryButton";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import { useCollapsedCategory } from "./useCollapsedCategory";

interface CategoryItemProps {
  category: Category;
  children: React.ReactNode;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}

export default function CategoryItem({
  category,
  children,
  attributes,
  listeners,
}: CategoryItemProps) {
  const { isExpanded, toggleExpanded } = useCollapsedCategory(category.id);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleExpanded();
  };

  const categoryContent = (
    <div className="flex items-center justify-between px-2 pb-2">
      <h2
        onClick={handleClick}
        className="text-foreground hover:text-primary uppercase text-[10px] cursor-pointer flex items-center gap-1"
      >
        <span {...attributes} {...listeners}>
          # {category.name}
        </span>
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform duration-300",
            isExpanded ? "" : "-rotate-90"
          )}
        />
      </h2>
      <AddCategoryButton className="opacity-0 transition-all duration-300 hover:scale-110 group-hover/category-item:opacity-100" />
    </div>
  );

  return (
    <div className="category-item text-sm group/category-item">
      <CategoryActions category={category}>{categoryContent}</CategoryActions>
      {isExpanded && children}
    </div>
  );
}
