import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { memo, useEffect, useState } from "react";
import { CategorySortableItem } from "./CategorySortableItem";
import useUpdateCategoryPosition, {
  PREFIX as CATEGORY_PREFIX,
  extractCategoryId,
} from "./useUpdateCategoryPosition";
import { useCategoryNDiagramDnD } from "./CategoryNDiagramDndContext";
import { DIAGRAM_PREFIX } from "./useConvertCategoryNDiagram";
import {
  addDiagramToCategory,
  removeDiagramFromCategory,
  updateDiagramCategory,
} from "@/databases/contentCategory";
import useUpdateDiagramPosition from "./useUpdateDiagramPosition";
import { toast } from "sonner";

function CategoryDndContextMain({
  // categories,
  children,
}: {
  // categories: string[];
  children: (
    catId: string,
    attributes: DraggableAttributes,
    listeners?: SyntheticListenerMap
  ) => React.ReactNode;
}) {
  console.log("called CategoryDndContextMain");

  // const [items, setItems] = useState(categories);
  const {
    categoryIds: items,
    setCategoryIds: setItems,
    setDiagramIdByCategoryId,
  } = useCategoryNDiagramDnD();
  const { reorderCategoryHandler } = useUpdateCategoryPosition();
  const { updateDiagramPositionHandler } = useUpdateDiagramPosition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function moveCategory(activeId: string, overId: string) {
    if (overId === "category-default") {
      toast.warning("You can't move a category to the default category");
      return;
    }

    if (activeId !== overId) {
      setItems((items) => {
        const oldIndex = items.indexOf(activeId);
        const newIndex = items.indexOf(overId);

        const movedItem = items[oldIndex];
        const newPostion = items[newIndex];
        const itemBeforeNewPosition = items[newIndex - 1];

        reorderCategoryHandler(movedItem, newPostion, itemBeforeNewPosition);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function moveDiagramToNewCategory(activeId: string, overId: string) {
    const splitedActiveId = activeId.split("#");
    const oldCategoryId = splitedActiveId[0].replace("diagram-", ""); // output: category-2376sd7f6-87sdf876....
    const diagramId = splitedActiveId[1];
    const categoryId = extractCategoryId(overId);
    const activeCategoryId = splitedActiveId[0].replace(
      "diagram-category-",
      ""
    );

    console.log(
      "=> move diagram to a new category",
      diagramId,
      categoryId,
      overId
    );
    console.log("activeCategoryId", activeCategoryId);

    const isFromDefaultCategory = activeId.includes("diagram-default");
    const isToDefaultCategory = overId.includes("category-default");

    console.log("isFromDefaultCategory", isFromDefaultCategory);
    console.log("isToDefaultCategory", isToDefaultCategory);

    // add diagram to a new category from default category
    if (isFromDefaultCategory) {
      addDiagramToCategory(diagramId, categoryId).catch((err) => {
        console.log("addDiagramToCategory error", err);
      });
    }

    // move diagram from a category to another category
    if (!isFromDefaultCategory && !isToDefaultCategory) {
      updateDiagramCategory(diagramId, categoryId).catch((err) => {
        console.log("updateDiagramCategory error", err);
      });
    }

    // move diagram from a category to default category
    if (!isFromDefaultCategory && isToDefaultCategory) {
      console.log("remove diagram from category", diagramId, activeCategoryId);
      removeDiagramFromCategory(diagramId, activeCategoryId).catch((err) => {
        console.log("removeDiagramFromCategory error", err);
      });
    }

    // TODO: diagram from a category to default category
    // need to remove diagram from the database
    // removeDiagramFromCategory(diagramId);

    setDiagramIdByCategoryId((prev) => {
      const newPrev = { ...prev };
      const key = overId === "category-default" ? "default" : overId;
      if (!newPrev[key]) {
        newPrev[key] = [];
      }
      newPrev[key].push(activeId);

      // remove diagram from the old category
      if (oldCategoryId) {
        newPrev[oldCategoryId] = newPrev[oldCategoryId].filter(
          (id) => id !== activeId
        );
      }
      return newPrev;
    });
  }

  function moveDiagramToBeforeAnotherDiagram(activeId: string, overId: string) {
    if (activeId !== overId) {
      setDiagramIdByCategoryId((prev) => {
        const newPrev = { ...prev };

        console.log("=> sort diagram position", activeId, overId);
        // console.log('newPrev', newPrev)
        const splitedActiveId = activeId.split("#");
        const splitedOverId = overId.split("#");
        const activeCategoryId = splitedActiveId[0].replace("diagram-", "");
        const overCategoryIdWithPrefix = splitedOverId[0].replace(
          "diagram-",
          ""
        );

        const diagramId = splitedActiveId[1];
        const moveToDiagramId = splitedOverId[1];
        const categoryId = splitedOverId[0].replace("diagram-category-", "");
        const isFromDefaultCategory = activeId.includes("diagram-default");
        const isToDefaultCategory = overId.includes("diagram-default");

        console.log("isFromDefaultCategory", isFromDefaultCategory);
        console.log("isToDefaultCategory", isToDefaultCategory);

        if (activeCategoryId !== overCategoryIdWithPrefix) {
          console.log("move to a diagram in DIFFERENT category");
          // remove diagram from the old category
          newPrev[activeCategoryId] = newPrev[activeCategoryId].filter(
            (id) => id !== activeId
          );
          // add diagram to to before overId
          const overIndex = newPrev[overCategoryIdWithPrefix].indexOf(overId);
          newPrev[overCategoryIdWithPrefix] = [
            ...newPrev[overCategoryIdWithPrefix].slice(0, overIndex),
            activeId,
            ...newPrev[overCategoryIdWithPrefix].slice(overIndex),
          ];
        }

        if (activeCategoryId === overCategoryIdWithPrefix) {
          console.log("move to a diagram in the SAME category");
          // remove diagram from the old category
          newPrev[activeCategoryId] = newPrev[activeCategoryId].filter(
            (id) => id !== activeId
          );
          // add diagram to to before overId
          const overIndex = newPrev[overCategoryIdWithPrefix].indexOf(overId);
          newPrev[overCategoryIdWithPrefix] = [
            ...newPrev[overCategoryIdWithPrefix].slice(0, overIndex),
            activeId,
            ...newPrev[overCategoryIdWithPrefix].slice(overIndex),
          ];
        }

        if (isFromDefaultCategory) {
          console.log("add diagram to category", diagramId, categoryId);
          addDiagramToCategory(diagramId, categoryId).catch((err) => {
            console.log("addDiagramToCategory error", err);
          });
        } else {
          console.log("update diagram category", diagramId, categoryId);
          updateDiagramCategory(diagramId, categoryId).catch((err) => {
            console.log("updateDiagramCategory error", err);
          });
        }

        updateDiagramPositionHandler(diagramId, moveToDiagramId);

        return newPrev;
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    const activeId = active.id as string;
    const overId = over?.id as string;

    if (activeId === overId) {
      return;
    }

    console.log("========= handleDragEnd =============");
    console.log(activeId, overId);

    // move diagram to another category
    if (
      activeId.includes(DIAGRAM_PREFIX) &&
      overId.includes(CATEGORY_PREFIX) &&
      !overId.includes("diagram-category")
    ) {
      moveDiagramToNewCategory(activeId, overId);
      return;
    }

    // place a diagram to before another diagram
    if (activeId.includes(DIAGRAM_PREFIX) && overId.includes(DIAGRAM_PREFIX)) {
      moveDiagramToBeforeAnotherDiagram(activeId, overId);
      return;
    }

    // move category to another category
    if (
      activeId.includes(CATEGORY_PREFIX) &&
      overId.includes(CATEGORY_PREFIX)
    ) {
      moveCategory(activeId, overId);
      return;
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items}>
        {items.map((catId) => (
          <CategorySortableItem key={catId} id={catId}>
            {(attributes, listeners) =>
              children(
                catId.replace(CATEGORY_PREFIX, ""),
                attributes,
                listeners
              )
            }
          </CategorySortableItem>
        ))}
      </SortableContext>

      <DragOverlay>
        <div className="bg-primary/10 rounded-xs px-2 py-2 w-full text-xs uppercase">
          Dragging category
        </div>
      </DragOverlay>
    </DndContext>
  );
}

export default memo(CategoryDndContextMain);
