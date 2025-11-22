import { FileEntry } from "./types";
import { ExplorerTreeItem } from "./ExplorerTreeItem";

interface ExplorerFileTreeProps {
    rootPath: string;
    files: FileEntry[];
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

export function ExplorerFileTree({
    rootPath,
    files,
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
}: ExplorerFileTreeProps) {
    // Create root folder entry that contains all files
    const rootEntry: FileEntry = {
        name: rootPath.split(/[/\\]/).pop() || rootPath,
        path: rootPath,
        is_dir: true,
        children: files,
    };

    return (
        <div className="flex-1 overflow-auto">
            <div className="py-1">
                <ExplorerTreeItem
                    entry={rootEntry}
                    depth={0}
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
            </div>
        </div>
    );
}
