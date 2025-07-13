import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Category } from "@/databases/_types";
import { cn } from "@/lib/utils";
import CategoryActions from "./CategoryActions";
import AddCategoryButton from "./AddCategoryButton";

interface CategoryItemProps {
  category: Category;
}

export default function CategoryItem({ category }: CategoryItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    setIsExpanded((prev) => !prev);
  };

  const categoryContent = (
    <div className="flex items-center justify-between px-2 pb-2">
      <h2 className="text-primary uppercase text-[10px]">{category.name}</h2>
      <AddCategoryButton />
    </div>
  );

  return (
    <div className="text-sm">
      <CategoryActions category={category}>{categoryContent}</CategoryActions>
      {isExpanded && (
        <div className="pl-6">
          {/* TODO: Add projects belonging to this category */}
        </div>
      )}
    </div>
  );
}
