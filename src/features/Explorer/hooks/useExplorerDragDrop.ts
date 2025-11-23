import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { toast } from "sonner";
import { FileEntry } from "../types";

interface UseExplorerDragDropProps {
    files: FileEntry[];
    loadDir: (path: string) => Promise<void>;
}

export function useExplorerDragDrop({ files, loadDir }: UseExplorerDragDropProps) {
    const [activeItem, setActiveItem] = useState<FileEntry | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        setActiveItem(null);

        if (!over || active.id === over.id) {
            return;
        }

        const draggedPath = active.id as string;
        const targetPath = over.id as string;

        // Find the dragged item
        const findEntry = (entries: FileEntry[], path: string): FileEntry | null => {
            for (const entry of entries) {
                if (entry.path === path) return entry;
                if (entry.children) {
                    const found = findEntry(entry.children, path);
                    if (found) return found;
                }
            }
            return null;
        };

        const draggedEntry = findEntry(files, draggedPath);
        const targetEntry = findEntry(files, targetPath);

        if (!draggedEntry || !targetEntry || !targetEntry.is_dir) {
            return;
        }

        // Prevent dropping a folder into itself or its children
        if (draggedPath === targetPath || targetPath.startsWith(draggedPath + "/")) {
            toast.error("Cannot move a folder into itself or its children");
            return;
        }

        const newPath = `${targetPath}/${draggedEntry.name}`;

        try {
            await invoke("rename_node", { oldPath: draggedPath, newPath });
            toast.success(`Moved ${draggedEntry.name} to ${targetEntry.name}`);

            // Reload the parent directories
            const draggedParentPath = draggedPath.substring(0, draggedPath.lastIndexOf("/"));
            if (draggedParentPath && draggedParentPath !== targetPath) {
                loadDir(draggedParentPath);
            }
            loadDir(targetPath);
        } catch (error) {
            toast.error(`Failed to move: ${error}`);
        }
    };

    return {
        activeItem,
        setActiveItem,
        sensors,
        handleDragEnd,
    };
}
