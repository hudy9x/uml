import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "@/databases/_types";
import { cn } from "@/lib/utils";
import CategoryActions from "./CategoryActions";
import AddCategoryButton from "./AddCategoryButton";

interface CategoryItemProps {
  category: Category;
  children: React.ReactNode;
}

export default function CategoryItem({
  category,
  children,
}: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleClick = (e: React.MouseEvent) => {
    setIsExpanded((prev) => !prev);
  };

  const categoryContent = (
    <div className="flex items-center justify-between px-2 pb-2">
      <h2
        onClick={handleClick}
        className="text-primary/50 hover:text-primary uppercase text-[10px] cursor-pointer flex items-center gap-1"
      >
        <span># {category.name}</span>
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
      {isExpanded && <nav className="flex flex-col gap-0.5">{children}</nav>}
    </div>
  );
}
