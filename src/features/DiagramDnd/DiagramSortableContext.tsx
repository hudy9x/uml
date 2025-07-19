import { SortableContext } from "@dnd-kit/sortable";
import DiagramSortableItem from "./DiagramSortableItem";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { DraggableAttributes } from "@dnd-kit/core";

export default function DiagramSortableContext({
  items,
  children,
}: {
  items: string[];
  children: (data: {
    item: string;
    itemId: string;
    attributes: DraggableAttributes;
    listeners?: SyntheticListenerMap;
  }) => React.ReactNode;
}) {

  return (
    <SortableContext items={items}>
      {items.map((item) => (
        <DiagramSortableItem key={item} id={item}>
          {(attributes, listeners) => children({
            item,
            itemId: item.split("#")[1],
            attributes,
            listeners,
          })}
        </DiagramSortableItem>
      ))}
    </SortableContext>
  );
}
