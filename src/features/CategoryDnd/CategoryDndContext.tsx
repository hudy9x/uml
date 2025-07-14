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
import { useCategoryStore } from "@/stores/category";
import { useEffect, useMemo, useState } from "react";
import { CategorySortableItem } from "./CategorySortableItem";
import useUpdateCategoryPosition from "./useUpdateCategoryPosition";

const PREFIX = "category-";

export function extractCategoryId(id: string) {
  const extracted = id.replace(PREFIX, "");
  return extracted === "default" ? "" : extracted;
}

function CategoryDndContextMain({
  categories,
  children,
}: {
  categories: string[];
  children: (
    catId: string,
    attributes: DraggableAttributes,
    listeners?: SyntheticListenerMap
  ) => React.ReactNode;
}) {
  const [items, setItems] = useState(categories);
  const { reorderCategoryHandler } = useUpdateCategoryPosition();

  // listen changes when adding or deleting category
  useEffect(() => {
    console.log("update category trigger by adding/deleting");
    setItems(categories);
  }, [categories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf((over?.id as string) ?? "");

        const movedItem = items[oldIndex];
        const newPostion = items[newIndex];
        const itemBeforeNewPosition = items[newIndex - 1];

        reorderCategoryHandler(movedItem, newPostion, itemBeforeNewPosition);

        return arrayMove(items, oldIndex, newIndex);
      });
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
              children(catId.replace(PREFIX, ""), attributes, listeners)
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
  const categorieIds = useCategoryStore((state) =>
    state.categories
      .sort((a, b) => a.position - b.position)
      .map((category) => `${PREFIX}${category.id}`)
  );

  const view = useMemo(() => {
    return (
      <CategoryDndContextMain categories={categorieIds} children={children} />
    );
  }, [categorieIds, children]);

  return view;
}
