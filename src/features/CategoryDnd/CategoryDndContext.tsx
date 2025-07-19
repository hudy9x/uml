import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { useMemo } from "react";
import CategoryDndContextMain from "./CategoryDndContextMain";
import useConvertCategoryNDiagram from "./useConvertCategoryNDiagram";
import { CategoryNDiagramDnDProvider } from "./CategoryNDiagramDndContext";

export default function CategoryDndContext({
  children,
}: {
  // This children here is CategoryItem
  children: (
    catId: string,
    attributes: DraggableAttributes,
    listeners?: SyntheticListenerMap
  ) => React.ReactNode;
}) {
  const { categoryIds, diagramIdsByCategory } =
    useConvertCategoryNDiagram();

  const view = useMemo(() => {
    console.log("render CategoryDndContext");
    return (
      <CategoryNDiagramDnDProvider
        categoryIdsData={categoryIds}
        diagramIdByCategoryIdData={diagramIdsByCategory}
      >
        <CategoryDndContextMain
          // categories={categoryIds}
          children={children}
        />
      </CategoryNDiagramDnDProvider>
    );
  }, [
    JSON.stringify(categoryIds),
    JSON.stringify(diagramIdsByCategory),
    children,
  ]);

  return view;
}
