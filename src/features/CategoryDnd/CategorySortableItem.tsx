import React from "react";
import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export function CategorySortableItem({
  id,
  children,
}: {
  id: string;
  children: (
    attributes: DraggableAttributes,
    listeners?: SyntheticListenerMap
  ) => React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transition, isDragging, isOver } =
    useSortable({ id });

  // console.log("transform", overIndex, transform, transition);

  const style = {
    opacity: isDragging ? 0.5 : 1,
    // transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} className={`category-sortable-item`} style={style}>
      {isOver && <div className="over-indicator bg-primary/10 rounded-sm h-2 w-full"></div>}
      {children(attributes, listeners)}
    </div>
  );
}
