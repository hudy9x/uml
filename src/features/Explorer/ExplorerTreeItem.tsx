import { Button } from "@/components/ui/button";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    ChevronRight,
    ChevronDown,
    File,
    Trash2,
    Edit2,
    FilePlus,
    FolderPlus,
} from "lucide-react";
import folderIcon from "@/assets/folder.png";
import openFolderIcon from "@/assets/open-folder.png";
import { cn } from "@/lib/utils";
import { FileEntry } from "./types";
import { ExplorerDraggableItem } from "./ExplorerDraggableItem";
import { ExplorerDroppableFolder } from "./ExplorerDroppableFolder";

interface ExplorerTreeItemProps {
    entry: FileEntry;
    depth: number;
    selectedPath: string | null;
    expandedPaths: Set<string>;
    hoveredFolder: string | null;
    onFileClick: (entry: FileEntry) => void;
    onCreateFile: (path: string) => void;
    onCreateFolder: (path: string) => void;
    onRename: (path: string, name: string) => void;
    onDelete: (path: string) => void;
    onMouseEnter: (path: string) => void;
    onMouseLeave: () => void;
}

export function ExplorerTreeItem({
    entry,
    depth,
    selectedPath,
    expandedPaths,
    hoveredFolder,
    onFileClick,
    onCreateFile,
    onCreateFolder,
    onRename,
    onDelete,
    onMouseEnter,
    onMouseLeave,
}: ExplorerTreeItemProps) {
    const isSelected = selectedPath === entry.path;
    const isExpanded = expandedPaths.has(entry.path);
    const isHovered = hoveredFolder === entry.path;
    return (
        <div>
            <ExplorerDroppableFolder entry={entry}>
                <ExplorerDraggableItem entry={entry}>
                    <ContextMenu>
                        <ContextMenuTrigger>
                            <div
                                className={cn(
                                    "group flex items-center justify-between py-0.5 px-2 cursor-pointer text-sm select-none transition-colors",
                                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                                )}
                                style={{ paddingLeft: `${depth * 12 + 8}px` }}
                                onClick={() => onFileClick(entry)}
                                onMouseEnter={() => entry.is_dir && onMouseEnter(entry.path)}
                                onMouseLeave={onMouseLeave}
                            >
                                <div className="flex items-center flex-1 min-w-0">
                                    <span className="mr-1 opacity-70">
                                        {entry.is_dir ? (
                                            isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                                        ) : (
                                            <span className="w-[14px]" />
                                        )}
                                    </span>
                                    <span className="mr-2 text-accent-foreground">
                                        {entry.is_dir ? (
                                            <img src={isExpanded ? openFolderIcon : folderIcon} alt="folder" className="w-4 h-4" />
                                        ) : (
                                            <File size={16} className="text-gray-400" />
                                        )}
                                    </span>
                                    <span className="truncate">{entry.name}</span>
                                </div>
                                {entry.is_dir && isHovered && (
                                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCreateFile(entry.path);
                                            }}
                                            title="New File"
                                        >
                                            <FilePlus size={12} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-5 w-5"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onCreateFolder(entry.path);
                                            }}
                                            title="New Folder"
                                        >
                                            <FolderPlus size={12} />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            {entry.is_dir && (
                                <>
                                    <ContextMenuItem onClick={() => onCreateFile(entry.path)}>
                                        <FilePlus size={14} className="mr-2" /> New File
                                    </ContextMenuItem>
                                    <ContextMenuItem onClick={() => onCreateFolder(entry.path)}>
                                        <FolderPlus size={14} className="mr-2" /> New Folder
                                    </ContextMenuItem>
                                </>
                            )}
                            <ContextMenuItem onClick={() => onRename(entry.path, entry.name)}>
                                <Edit2 size={14} className="mr-2" /> Rename
                            </ContextMenuItem>
                            <ContextMenuItem onClick={() => onDelete(entry.path)} className="text-red-500">
                                <Trash2 size={14} className="mr-2" /> Delete
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </ExplorerDraggableItem>
            </ExplorerDroppableFolder>

            {entry.is_dir && isExpanded && entry.children && (
                <div>
                    {entry.children.map((child) => (
                        <ExplorerTreeItem
                            key={child.path}
                            entry={child}
                            depth={depth + 1}
                            selectedPath={selectedPath}
                            expandedPaths={expandedPaths}
                            hoveredFolder={hoveredFolder}
                            onFileClick={onFileClick}
                            onCreateFile={onCreateFile}
                            onCreateFolder={onCreateFolder}
                            onRename={onRename}
                            onDelete={onDelete}
                            onMouseEnter={onMouseEnter}
                            onMouseLeave={onMouseLeave}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
