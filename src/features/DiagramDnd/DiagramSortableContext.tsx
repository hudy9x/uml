import { SortableContext } from "@dnd-kit/sortable";
import DiagramSortableItem from "./DiagramSortableItem";

export default function DiagramSortableContext({ items }: { items: string[] }) {
  return (
    <SortableContext items={items}>
      {items.map((item) => (
        <DiagramSortableItem key={item} id={item}>
          {(attributes, listeners) => (
            <div {...attributes} {...listeners}>
              {item}
            </div>
          )}
        </DiagramSortableItem>
      ))}
    </SortableContext>
  );
}