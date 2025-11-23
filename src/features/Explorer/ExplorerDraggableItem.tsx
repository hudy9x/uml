import { useDraggable } from "@dnd-kit/core";
import { FileEntry } from "./types";

interface ExplorerDraggableItemProps {
    entry: FileEntry;
    children: React.ReactNode;
}

export function ExplorerDraggableItem({ entry, children }: ExplorerDraggableItemProps) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: entry.path,
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            {children}
        </div>
    );
}
