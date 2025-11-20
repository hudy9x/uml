import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import {
    ChevronRight,
    ChevronDown,
    File,
    Trash2,
    Edit2,
    FilePlus,
    FolderPlus,
    FolderInput,
} from "lucide-react";
import folderIcon from "@/assets/folder.png";
import openFolderIcon from "@/assets/open-folder.png";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDroppable,
    useDraggable,
} from "@dnd-kit/core";

interface FileEntry {
    name: string;
    path: string;
    is_dir: boolean;
    children?: FileEntry[];
}

interface FileExplorerProps {
    onFileSelect: (path: string, content: string) => void;
    selectedPath?: string | null;
}

export function FileExplorerDnd({ onFileSelect, selectedPath }: FileExplorerProps) {
    const [rootPath, setRootPath] = useState<string | null>(null);
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createType, setCreateType] = useState<"file" | "folder">("file");
    const [createParentPath, setCreateParentPath] = useState<string>("");
    const [newItemName, setNewItemName] = useState("");

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [renameItemPath, setRenameItemPath] = useState("");
    const [renameItemName, setRenameItemName] = useState("");

    // Drag and drop state
    const [activeItem, setActiveItem] = useState<FileEntry | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        const savedPath = localStorage.getItem("lastOpenedFolder");
        if (savedPath) {
            setRootPath(savedPath);
        }

        const savedExpanded = localStorage.getItem("expandedFolders");
        if (savedExpanded) {
            try {
                setExpandedPaths(new Set(JSON.parse(savedExpanded)));
            } catch (e) {
                console.error("Failed to parse expanded folders", e);
            }
        }
    }, []);

    useEffect(() => {
        if (rootPath) {
            loadDir(rootPath);
        }
    }, [rootPath]);

    // Persist expanded paths whenever they change
    useEffect(() => {
        localStorage.setItem("expandedFolders", JSON.stringify(Array.from(expandedPaths)));
    }, [expandedPaths]);

    const handleOpenFolder = async () => {
        try {
            const selected = await open({
                directory: true,
                multiple: false,
            });

            if (selected && typeof selected === "string") {
                setRootPath(selected);
                localStorage.setItem("lastOpenedFolder", selected);
            }
        } catch (error) {
            console.error("Failed to open folder dialog:", error);
            toast.error("Failed to open folder selection dialog");
        }
    };

    async function loadDir(path: string) {
        try {
            const entries = await invoke<FileEntry[]>("list_dir", { path });
            if (path === rootPath) {
                setFiles(entries);
                entries.forEach(entry => {
                    if (entry.is_dir && expandedPaths.has(entry.path)) {
                        loadDir(entry.path);
                    }
                });
            } else {
                setFiles((prev) => updateChildren(prev, path, entries));
                entries.forEach(entry => {
                    if (entry.is_dir && expandedPaths.has(entry.path)) {
                        loadDir(entry.path);
                    }
                });
            }
        } catch (error) {
            console.error("Failed to list dir:", error);
            toast.error(`Failed to load directory: ${error}`);
        }
    }

    function updateChildren(
        entries: FileEntry[],
        parentPath: string,
        children: FileEntry[]
    ): FileEntry[] {
        return entries.map((entry) => {
            if (entry.path === parentPath) {
                return { ...entry, children };
            }
            if (entry.children) {
                return {
                    ...entry,
                    children: updateChildren(entry.children, parentPath, children),
                };
            }
            return entry;
        });
    }

    const toggleExpand = async (entry: FileEntry) => {
        if (!entry.is_dir) return;

        const newExpanded = new Set(expandedPaths);
        if (newExpanded.has(entry.path)) {
            newExpanded.delete(entry.path);
        } else {
            newExpanded.add(entry.path);
            if (!entry.children) {
                await loadDir(entry.path);
            }
        }
        setExpandedPaths(newExpanded);
    };

    const handleFileClick = async (entry: FileEntry) => {
        if (entry.is_dir) {
            toggleExpand(entry);
        } else {
            try {
                const content = await invoke<string>("read_file_content", {
                    path: entry.path,
                });
                onFileSelect(entry.path, content);
            } catch (error) {
                console.error("Failed to read file:", error);
                toast.error(`Failed to read file: ${error}`);
            }
        }
    };

    const handleCreate = async () => {
        if (!newItemName) return;
        const path = `${createParentPath}/${newItemName}`;
        try {
            if (createType === "file") {
                await invoke("create_file", { path });
            } else {
                await invoke("create_directory", { path });
            }
            toast.success(`${createType === "file" ? "File" : "Folder"} created`);
            setIsCreateDialogOpen(false);
            setNewItemName("");
            loadDir(createParentPath);
        } catch (error) {
            toast.error(`Failed to create ${createType}: ${error}`);
        }
    };

    const handleRename = async () => {
        if (!renameItemName) return;

        const lastSepIndex = Math.max(renameItemPath.lastIndexOf("/"), renameItemPath.lastIndexOf("\\"));
        const parent = lastSepIndex !== -1 ? renameItemPath.substring(0, lastSepIndex) : (rootPath || ".");
        const newPath = `${parent}/${renameItemName}`;

        try {
            await invoke("rename_node", { oldPath: renameItemPath, newPath });
            toast.success("Renamed successfully");
            setIsRenameDialogOpen(false);
            setRenameItemName("");
            loadDir(parent);
        } catch (error) {
            toast.error(`Failed to rename: ${error}`);
        }
    };

    const handleDelete = async (path: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await invoke("delete_node", { path });
            toast.success("Deleted successfully");
            const lastSepIndex = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
            const parent = lastSepIndex !== -1 ? path.substring(0, lastSepIndex) : (rootPath || ".");
            loadDir(parent);
        } catch (error) {
            toast.error(`Failed to delete: ${error}`);
        }
    };

    const openCreateDialog = (parentPath: string, type: "file" | "folder") => {
        setCreateParentPath(parentPath);
        setCreateType(type);
        setNewItemName("");
        setIsCreateDialogOpen(true);
    };

    const openRenameDialog = (path: string, currentName: string) => {
        setRenameItemPath(path);
        setRenameItemName(currentName);
        setIsRenameDialogOpen(true);
    };

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

    const DraggableItem = ({ entry, children }: { entry: FileEntry; children: React.ReactNode }) => {
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
    };

    const DroppableFolder = ({ entry, children }: { entry: FileEntry; children: React.ReactNode }) => {
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
    };

    const FileTreeItem = ({ entry, depth }: { entry: FileEntry; depth: number }) => {
        const isExpanded = expandedPaths.has(entry.path);
        const isSelected = selectedPath === entry.path;

        return (
            <div>
                <DroppableFolder entry={entry}>
                    <DraggableItem entry={entry}>
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <div
                                    className={cn(
                                        "flex items-center py-1 px-2 cursor-pointer text-sm select-none transition-colors",
                                        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"
                                    )}
                                    style={{ paddingLeft: `${depth * 12 + 8}px` }}
                                    onClick={() => handleFileClick(entry)}
                                >
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
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                {entry.is_dir && (
                                    <>
                                        <ContextMenuItem onClick={() => openCreateDialog(entry.path, "file")}>
                                            <FilePlus size={14} className="mr-2" /> New File
                                        </ContextMenuItem>
                                        <ContextMenuItem onClick={() => openCreateDialog(entry.path, "folder")}>
                                            <FolderPlus size={14} className="mr-2" /> New Folder
                                        </ContextMenuItem>
                                    </>
                                )}
                                <ContextMenuItem onClick={() => openRenameDialog(entry.path, entry.name)}>
                                    <Edit2 size={14} className="mr-2" /> Rename
                                </ContextMenuItem>
                                <ContextMenuItem onClick={() => handleDelete(entry.path)} className="text-red-500">
                                    <Trash2 size={14} className="mr-2" /> Delete
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    </DraggableItem>
                </DroppableFolder>

                {entry.is_dir && isExpanded && entry.children && (
                    <div>
                        {entry.children.map((child) => (
                            <FileTreeItem key={child.path} entry={child} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    if (!rootPath) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 text-center bg-muted/10 border-r">
                <img src={openFolderIcon} alt="folder" className="w-12 h-12 opacity-70 mb-4" />
                <h3 className="font-semibold mb-2">No Folder Open</h3>
                <p className="text-sm text-muted-foreground mb-4">Open a folder to start browsing files.</p>
                <Button onClick={handleOpenFolder}>Open Folder</Button>
            </div>
        );
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="h-full flex flex-col bg-muted/10 border-r">
                <div className="p-2 border-b flex items-center justify-between">
                    <span className="font-semibold text-sm truncate max-w-[100px]" title={rootPath}>
                        {rootPath.split(/[/\\]/).pop()}
                    </span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleOpenFolder} title="Change Folder">
                            <FolderInput size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openCreateDialog(rootPath, "file")}>
                            <FilePlus size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openCreateDialog(rootPath, "folder")}>
                            <FolderPlus size={14} />
                        </Button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto py-2">
                    {files.map((entry) => (
                        <FileTreeItem key={entry.path} entry={entry} depth={0} />
                    ))}
                </div>

                {/* Create Dialog */}
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New {createType === "file" ? "File" : "Folder"}</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            placeholder={`Enter ${createType} name`}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            autoFocus
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreate}>Create</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Rename Dialog */}
                <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Rename</DialogTitle>
                        </DialogHeader>
                        <Input
                            value={renameItemName}
                            onChange={(e) => setRenameItemName(e.target.value)}
                            placeholder="Enter new name"
                            onKeyDown={(e) => e.key === "Enter" && handleRename()}
                            autoFocus
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleRename}>Rename</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <DragOverlay>
                {activeItem && (
                    <div className="bg-primary/10 rounded-sm px-2 py-1 text-xs flex items-center gap-2">
                        {activeItem.is_dir ? (
                            <img src={folderIcon} alt="folder" className="w-4 h-4" />
                        ) : (
                            <File size={16} className="text-gray-400" />
                        )}
                        {activeItem.name}
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    );
}
