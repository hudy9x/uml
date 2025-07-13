import { useCategoryStore } from "@/stores/category";
import CategoryItem from "./CategoryItem";
import { useEffect } from "react";

export default function CategoriesSection() {
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return (
    <div className="mb-4">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
}
