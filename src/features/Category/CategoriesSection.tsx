import { useCategoryStore } from "@/stores/category";
import CategoryItem from "./CategoryItem";
import { useState, useEffect } from "react";
import AddCategoryButton from "./AddCategoryButton";

export default function CategoriesSection() {
  const { 
    categories, 
    loadCategories,
    deleteExistingCategory,
    updateExistingCategory
  } = useCategoryStore();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleDeleteCategory = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteExistingCategory(id);
  };

  const handleUpdateCategory = async (id: string, name: string) => {
    await updateExistingCategory(id, { name });
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-2 pb-2">
        <h2 className="text-primary uppercase text-[10px]">
          Categories
        </h2>
        <AddCategoryButton />
      </div>
      <div>
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            isExpanded={expandedCategories.has(category.id)}
            onToggle={toggleCategory}
            onDelete={handleDeleteCategory}
            onUpdate={handleUpdateCategory}
          />
        ))}
      </div>
    </div>
  );
} 