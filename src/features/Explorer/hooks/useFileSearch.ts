import { useMemo } from "react";
import { FileEntry } from "../types";

export interface FlatFileEntry {
    name: string;
    path: string;
    folderPath: string;
}

export function useFileSearch(files: FileEntry[], rootPath: string | null) {
    // Flatten the file tree into a list of files (excluding directories)
    const flatFiles = useMemo(() => {
        const result: FlatFileEntry[] = [];

        function traverse(entries: FileEntry[], parentPath: string = "") {
            for (const entry of entries) {
                if (entry.is_dir) {
                    // Recursively traverse directories
                    if (entry.children) {
                        traverse(entry.children, entry.path);
                    }
                } else {
                    // Add files to the result
                    const folderPath = parentPath || rootPath || "";
                    result.push({
                        name: entry.name,
                        path: entry.path,
                        folderPath: folderPath,
                    });
                }
            }
        }

        traverse(files);
        return result;
    }, [files, rootPath]);

    // Filter files based on search query with fuzzy matching
    const filterFiles = (query: string): FlatFileEntry[] => {
        if (!query.trim()) {
            return flatFiles;
        }

        const lowerQuery = query.toLowerCase();

        return flatFiles.filter((file) => {
            const fileName = file.name.toLowerCase();

            // Simple fuzzy matching: check if all characters in query appear in order
            let queryIndex = 0;
            for (let i = 0; i < fileName.length && queryIndex < lowerQuery.length; i++) {
                if (fileName[i] === lowerQuery[queryIndex]) {
                    queryIndex++;
                }
            }

            return queryIndex === lowerQuery.length;
        });
    };

    return {
        flatFiles,
        filterFiles,
    };
}
