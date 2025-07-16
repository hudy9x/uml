import { useCategoryStore } from "@/stores/category";
import CategoryItem from "./CategoryItem";
import { useEffect, useCallback, memo } from "react";
import DiagramList from "../Diagram/DiagramList";
import CategoryDndContext from "../CategoryDnd/CategoryDndContext";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

const CategoryItemWithDiagrams = memo(
  ({
    catId,
    attributes,
    listeners,
  }: {
    catId: string;
    attributes: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  }) => {
    const categories = useCategoryStore((state) => state.categories);
    const category = categories.find((c) => c.id === catId)!;

    return (
      <CategoryItem
        key={category.id}
        category={category}
        attributes={attributes}
        listeners={listeners}
      >
        <DiagramList categoryId={category.id} />
      </CategoryItem>
    );
  }
);

CategoryItemWithDiagrams.displayName = "CategoryItemWithDiagrams";

export default function CategoriesSectionDnd() {
  const categories = useCategoryStore((state) => state.categories);
  // const loadCategories = useCategoryStore((state) => state.loadCategories);

  // const initializeCategories = useCallback(() => {
  //   // console.log("called loadCategories");
  //   loadCategories();
  // }, []); // loadCategories is stable from jotai

  // useEffect(() => {
  //   initializeCategories();
  // }, [initializeCategories]);

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-4 space-y-4">
      <CategoryDndContext>
        {(catId, attributes, listeners) => (
          <CategoryItemWithDiagrams
            key={catId}
            catId={catId}
            attributes={attributes}
            listeners={listeners}
          />
        )}
      </CategoryDndContext>
    </div>
  );
}
