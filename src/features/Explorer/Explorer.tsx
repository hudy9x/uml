import { useState, useEffect, memo, useRef } from "react";
import { DndContext } from "@dnd-kit/core";
import { ExplorerProps } from "./types";
import { useExplorerState } from "./hooks/useExplorerState";
import { useExplorerFileOperations } from "./hooks/useExplorerFileOperations";
import { useExplorerDragDrop } from "./hooks/useExplorerDragDrop";
import { ExplorerHeader } from "./ExplorerHeader";
import { ExplorerFileTree } from "./ExplorerFileTree";
import { ExplorerEmptyState } from "./ExplorerEmptyState";
import { ExplorerCreateDialog } from "./ExplorerCreateDialog";
import { ExplorerRenameDialog } from "./ExplorerRenameDialog";
import { ExplorerDragOverlay } from "./ExplorerDragOverlay";
import { ExplorerFileSearchDialog } from "./ExplorerFileSearchDialog";
import { checkAndReloadExplorer } from "@/lib/explorerReloadUtils";

function ExplorerComponent({
    onFileSelect,
    selectedPath,
    isExplorerVisible,
    onToggleExplorer,
}: ExplorerProps) {
    // State management
    const {
        rootPath,
        setRootPath,
        files,
        setFiles,
        expandedPaths,
        toggleExpand,
        hoveredFolder,
        setHoveredFolder,
    } = useExplorerState();

    // File operations
    const {
        handleOpenFolder,
        loadDir,
        handleFileClick,
        createFile,
        createFolder,
        renameNode,
        deleteNode,
    } = useExplorerFileOperations({
        rootPath,
        setRootPath,
        setFiles,
        expandedPaths,
        toggleExpand,
        onFileSelect,
    });

    // Drag and drop
    const {
        activeItem,
        setActiveItem,
        sensors,
        handleDragEnd,
    } = useExplorerDragDrop({
        files,
        loadDir,
    });

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [createType, setCreateType] = useState<"file" | "folder">("file");
    const [createParentPath, setCreateParentPath] = useState("");

    const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
    const [renameItemPath, setRenameItemPath] = useState("");
    const [renameItemName, setRenameItemName] = useState("");

    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

    // Window focus state and file structure hash for auto-reload
    const [isWindowFocused, setIsWindowFocused] = useState(true);
    const fileStructureHashRef = useRef<string>("");

    // Track window focus state
    useEffect(() => {
        const handleFocus = () => setIsWindowFocused(true);
        const handleBlur = () => setIsWindowFocused(false);

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    // Keyboard shortcut for file search (Ctrl/Cmd+P)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "p") {
                e.preventDefault();
                if (rootPath) {
                    setIsSearchDialogOpen(true);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [rootPath]);

    // Load directory when rootPath changes
    useEffect(() => {
        if (rootPath) {
            loadDir(rootPath);
        }
    }, [rootPath]);

    // Auto-reload file structure when changes are detected (only when window is focused)
    useEffect(() => {
        if (!rootPath || !isWindowFocused) return;

        const checkForChanges = async () => {
            const newHash = await checkAndReloadExplorer(
                rootPath,
                fileStructureHashRef.current,
                loadDir
            );
            fileStructureHashRef.current = newHash;
        };

        // Check immediately
        checkForChanges();

        // Poll every 2 seconds when window is focused
        const interval = setInterval(checkForChanges, 2000);

        return () => clearInterval(interval);
    }, [rootPath, isWindowFocused, loadDir]);

    // Dialog handlers
    const openCreateDialog = (parentPath: string, type: "file" | "folder") => {
        setCreateParentPath(parentPath);
        setCreateType(type);
        setIsCreateDialogOpen(true);
    };

    const openRenameDialog = (path: string, currentName: string) => {
        setRenameItemPath(path);
        setRenameItemName(currentName);
        setIsRenameDialogOpen(true);
    };

    const handleCreate = async (parentPath: string, name: string) => {
        if (createType === "file") {
            await createFile(parentPath, name);
        } else {
            await createFolder(parentPath, name);
        }
    };

    const handleSearchFile = () => {
        setIsSearchDialogOpen(true);
    };

    const handleFileSelectFromSearch = async (path: string) => {
        // Use the existing handleFileClick logic but construct a FileEntry
        try {
            const fileName = path.split("/").pop() || "";
            await handleFileClick({ name: fileName, path, is_dir: false });
        } catch (error) {
            console.error("Failed to open file from search:", error);
        }
    };

    // Show empty state if no folder is open
    if (!rootPath) {
        return <ExplorerEmptyState onOpenFolder={handleOpenFolder} />;
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="h-full flex flex-col bg-muted/10 border-r">
                {/* Header */}
                <ExplorerHeader
                    isExplorerVisible={isExplorerVisible}
                    onToggleExplorer={onToggleExplorer}
                    rootPath={rootPath}
                    onOpenFolder={handleOpenFolder}
                    onCreateFile={() => openCreateDialog(rootPath, "file")}
                    onCreateFolder={() => openCreateDialog(rootPath, "folder")}
                    onSearchFile={handleSearchFile}
                />

                {/* File Tree */}
                <ExplorerFileTree
                    rootPath={rootPath}
                    files={files}
                    selectedPath={selectedPath || null}
                    expandedPaths={expandedPaths}
                    hoveredFolder={hoveredFolder}
                    onFileClick={handleFileClick}
                    onCreateFile={(path) => openCreateDialog(path, "file")}
                    onCreateFolder={(path) => openCreateDialog(path, "folder")}
                    onRename={openRenameDialog}
                    onDelete={deleteNode}
                    onMouseEnter={setHoveredFolder}
                    onMouseLeave={() => setHoveredFolder(null)}
                />
            </div>

            {/* Dialogs */}
            <ExplorerCreateDialog
                isOpen={isCreateDialogOpen}
                type={createType}
                parentPath={createParentPath}
                onClose={() => setIsCreateDialogOpen(false)}
                onCreate={handleCreate}
            />

            <ExplorerRenameDialog
                isOpen={isRenameDialogOpen}
                currentName={renameItemName}
                itemPath={renameItemPath}
                onClose={() => setIsRenameDialogOpen(false)}
                onRename={renameNode}
            />

            <ExplorerFileSearchDialog
                isOpen={isSearchDialogOpen}
                onClose={() => setIsSearchDialogOpen(false)}
                files={files}
                rootPath={rootPath}
                onFileSelect={handleFileSelectFromSearch}
            />

            {/* Drag Overlay */}
            <ExplorerDragOverlay activeItem={activeItem} />
        </DndContext>
    );
}

export const Explorer = memo(ExplorerComponent);
