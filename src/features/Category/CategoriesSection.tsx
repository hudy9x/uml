import { useCategoryStore } from "@/stores/category";
import CategoryItem from "./CategoryItem";
import { useEffect, useMemo } from "react";
import DiagramList from "../Diagram/DiagramList";
import { Category } from "@/databases/_types";

export default function CategoriesSection() {
  const categories = useCategoryStore((state) => state.categories);
  const loadCategories = useCategoryStore((state) => state.loadCategories);

  useEffect(() => {
    console.log("called loadCategories");
    loadCategories();
  }, []);

  if (!categories) {
    return null;
  }

  console.trace("categories", categories);

  // const renderCategory = useMemo(() => {
  //   console.log("renderCategory", categories);
  //   return categories.map((category) => {
  //     return (
  //       <CategoryItem key={category.id} category={category}>
  //         <DiagramList categoryId={category.id} />
  //       </CategoryItem>
  //     );
  //   });
  // }, [categories]);

  return (
    <div className="mt-4 mb-4 space-y-4">
      {/* {renderCategory} */}

      {categories.map((category) => (
        <CategoryItem key={category.id} category={category}>
          <DiagramList categoryId={category.id} />
        </CategoryItem>
      ))}
    </div>
  );
}
