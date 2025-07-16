import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import { useMemo } from "react";
import CategoryDndContextMain from "./CategoryDndContextMain";
import useConvertCategoryNDiagram from "./useConvertCategoryNDiagram";

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
  const { categoryIds, diagramIdsByCategory, isLoading } =
    useConvertCategoryNDiagram();

  const view = useMemo(() => {
    return (
      <CategoryDndContextMain categories={categoryIds} children={children} />
    );
  }, [categoryIds, children]);

  return view;
}
