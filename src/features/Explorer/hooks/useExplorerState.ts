import { useState, useEffect } from "react";
import { FileEntry } from "../types";
import { useExplorerRootPath } from "@/stores/explorer";

export function useExplorerState() {
    const [rootPath, setRootPathLocal] = useState<string | null>(null);
    const [, setGlobalRootPath] = useExplorerRootPath();
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
    const [hoveredFolder, setHoveredFolder] = useState<string | null>(null);

    // Wrapper to update both local and global state
    const setRootPath = (path: string | null) => {
        setRootPathLocal(path);
        setGlobalRootPath(path);
    };

    // Load saved folder and expanded paths from localStorage
    useEffect(() => {
        const savedPath = localStorage.getItem("lastOpenedFolder");
        if (savedPath) {
            setRootPath(savedPath);
        }

        const savedExpanded = localStorage.getItem("expandedFolders");
        if (savedExpanded) {
            try {
                const paths = JSON.parse(savedExpanded);
                setExpandedPaths(new Set(paths));
            } catch (e) {
                console.error("Failed to parse expanded folders", e);
            }
        } else if (savedPath) {
            // Auto-expand root folder on first load
            setExpandedPaths(new Set([savedPath]));
        }
    }, []);

    // Persist expanded paths whenever they change
    useEffect(() => {
        localStorage.setItem("expandedFolders", JSON.stringify(Array.from(expandedPaths)));
    }, [expandedPaths]);

    const toggleExpand = (path: string) => {
        const newExpanded = new Set(expandedPaths);
        if (newExpanded.has(path)) {
            newExpanded.delete(path);
        } else {
            newExpanded.add(path);
        }
        setExpandedPaths(newExpanded);
    };

    return {
        rootPath,
        setRootPath,
        files,
        setFiles,
        expandedPaths,
        setExpandedPaths,
        toggleExpand,
        hoveredFolder,
        setHoveredFolder,
    };
}
