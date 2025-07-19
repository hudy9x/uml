import { useCategoryStore } from "@/stores/category";
import { DIAGRAM_PREFIX } from "./useConvertCategoryNDiagram";

export const PREFIX = "category-";

export function extractCategoryId(id: string) {
  const extracted = id.replace(PREFIX, "");
  return extracted === "default" ? "" : extracted;
}

export function extractDiagramId(id: string) {
  const extracted = id.replace(DIAGRAM_PREFIX, "");
  return extracted === "default" ? "" : extracted;
}

export default function useUpdateCategoryPosition() {
  const categoryMetadatas = useCategoryStore((state) => state.categories);
  const updateCategoryMetadata = useCategoryStore(
    (state) => state.updateExistingCategory
  );

  function reorderCategoryHandler(
    movedItem: string,
    newPostion: string,
    itemBeforeNewPosition: string
  ) {
    const movedCategoryId = extractCategoryId(movedItem);
    const toCategoryId = extractCategoryId(newPostion);
    const beforeToCategoryId = extractCategoryId(itemBeforeNewPosition);

    let toPosition = -1;
    let beforeToPosition = -1;

    categoryMetadatas.forEach((c) => {
      if (c.id === toCategoryId) {
        toPosition = c.position;
        return;
      }

      if (beforeToCategoryId && c.id === beforeToCategoryId) {
        beforeToPosition = c.position;
        return;
      }
    });

    if (!beforeToCategoryId) {
      beforeToPosition = 0;
    }

    const newPosition = (beforeToPosition + toPosition) / 2;

    updateCategoryMetadata(movedCategoryId, { position: newPosition });

    console.log("========= Update category position =============");
    console.log("toPosition", toPosition);
    console.log("beforeToPosition", beforeToPosition);
    console.log("new position", newPosition);
  }

  return {
    reorderCategoryHandler,
  };
}
