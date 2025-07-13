import { useCategoryStore } from "@/stores/category";
import CategoryItem from "./CategoryItem";
import { useEffect, useCallback, memo } from "react";
import DiagramList from "../Diagram/DiagramList";
import { Category } from "@/databases/_types";

const CategoryItemWithDiagrams = memo(({ category }: { category: Category }) => (
  <CategoryItem key={category.id} category={category}>
    <DiagramList categoryId={category.id} />
  </CategoryItem>
));

CategoryItemWithDiagrams.displayName = 'CategoryItemWithDiagrams';

export default function CategoriesSection() {
  const categories = useCategoryStore((state) => state.categories);
  const loadCategories = useCategoryStore((state) => state.loadCategories);

  const initializeCategories = useCallback(() => {
    console.log("called loadCategories");
    loadCategories();
  }, []); // loadCategories is stable from jotai

  useEffect(() => {
    initializeCategories();
  }, [initializeCategories]);

  if (!categories || categories.length === 0) {
    return null;
  }

  console.log("categories", categories);

  return (
    <div className="mt-4 mb-4 space-y-4">
      {categories.map((category) => (
        <CategoryItemWithDiagrams 
          key={category.id} 
          category={category} 
        />
      ))}
    </div>
  );
}
