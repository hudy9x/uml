import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { toast } from "sonner";
import { FileEntry } from "./types";

interface UseExplorerFileOperationsProps {
    rootPath: string | null;
    setRootPath: (path: string | null) => void;
    setFiles: (files: FileEntry[] | ((prev: FileEntry[]) => FileEntry[])) => void;
    expandedPaths: Set<string>;
    toggleExpand: (path: string) => void;
    onFileSelect: (path: string, content: string) => void;
}

export function useExplorerFileOperations({
    rootPath,
    setRootPath,
    setFiles,
    expandedPaths,
    toggleExpand,
    onFileSelect,
}: UseExplorerFileOperationsProps) {

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

    const handleFileClick = async (entry: FileEntry) => {
        if (entry.is_dir) {
            toggleExpand(entry.path);
            if (!entry.children) {
                await loadDir(entry.path);
            }
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

    const createFile = async (parentPath: string, name: string) => {
        const path = `${parentPath}/${name}`;
        try {
            await invoke("create_file", { path });
            toast.success("File created");
            await loadDir(parentPath);
        } catch (error) {
            toast.error(`Failed to create file: ${error}`);
            throw error;
        }
    };

    const createFolder = async (parentPath: string, name: string) => {
        const path = `${parentPath}/${name}`;
        try {
            await invoke("create_directory", { path });
            toast.success("Folder created");
            await loadDir(parentPath);
        } catch (error) {
            toast.error(`Failed to create folder: ${error}`);
            throw error;
        }
    };

    const renameNode = async (oldPath: string, newName: string) => {
        const lastSepIndex = Math.max(oldPath.lastIndexOf("/"), oldPath.lastIndexOf("\\"));
        const parent = lastSepIndex !== -1 ? oldPath.substring(0, lastSepIndex) : (rootPath || ".");
        const newPath = `${parent}/${newName}`;

        try {
            await invoke("rename_node", { oldPath, newPath });
            toast.success("Renamed successfully");
            await loadDir(parent);
        } catch (error) {
            toast.error(`Failed to rename: ${error}`);
            throw error;
        }
    };

    const deleteNode = async (path: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            await invoke("delete_node", { path });
            toast.success("Deleted successfully");
            const lastSepIndex = Math.max(path.lastIndexOf("/"), path.lastIndexOf("\\"));
            const parent = lastSepIndex !== -1 ? path.substring(0, lastSepIndex) : (rootPath || ".");
            await loadDir(parent);
        } catch (error) {
            toast.error(`Failed to delete: ${error}`);
        }
    };

    return {
        handleOpenFolder,
        loadDir,
        handleFileClick,
        createFile,
        createFolder,
        renameNode,
        deleteNode,
    };
}
