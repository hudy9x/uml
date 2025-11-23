import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import { FileEntry } from "./types";

interface ExplorerDroppableFolderProps {
    entry: FileEntry;
    children: React.ReactNode;
}

export function ExplorerDroppableFolder({ entry, children }: ExplorerDroppableFolderProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: entry.path,
        disabled: !entry.is_dir,
    });

    return (
        <div ref={entry.is_dir ? setNodeRef : undefined}>
            <div className={cn(isOver && entry.is_dir && "bg-blue-100 dark:bg-blue-900 border-2 border-blue-400 rounded")}>
                {children}
            </div>
        </div>
    );
}
