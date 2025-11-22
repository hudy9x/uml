import { useState, useEffect, memo } from "react";
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
    const { activeItem, sensors, handleDragEnd } = useExplorerDragDrop({
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

    // Load directory when rootPath changes
    useEffect(() => {
        if (rootPath) {
            loadDir(rootPath);
        }
    }, [rootPath]);

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

            {/* Drag Overlay */}
            <ExplorerDragOverlay activeItem={activeItem} />
        </DndContext>
    );
}

export const Explorer = memo(ExplorerComponent);
