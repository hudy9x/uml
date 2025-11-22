import { DragOverlay } from "@dnd-kit/core";
import { File } from "lucide-react";
import folderIcon from "@/assets/folder.png";
import { FileEntry } from "./types";

interface ExplorerDragOverlayProps {
    activeItem: FileEntry | null;
}

export function ExplorerDragOverlay({ activeItem }: ExplorerDragOverlayProps) {
    return (
        <DragOverlay>
            {activeItem ? (
                <div className="flex items-center gap-2 px-2 py-1 bg-background border rounded shadow-lg">
                    {activeItem.is_dir ? (
                        <img src={folderIcon} alt="folder" className="w-4 h-4" />
                    ) : (
                        <File size={16} className="opacity-70" />
                    )}
                    <span className="text-sm">{activeItem.name}</span>
                </div>
            ) : null}
        </DragOverlay>
    );
}
