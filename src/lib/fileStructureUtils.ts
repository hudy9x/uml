import { FileEntry } from "@/features/Explorer/types";

/**
 * Generate a hash of the file structure (paths and types only, not content)
 * This is used to detect when files/folders are added, deleted, or renamed
 */
export function generateFileStructureHash(files: FileEntry[]): string {
    const paths: string[] = [];

    function collectPaths(entries: FileEntry[]) {
        for (const entry of entries) {
            // Include path and whether it's a directory
            paths.push(`${entry.path}:${entry.is_dir ? "dir" : "file"}`);
            if (entry.children) {
                collectPaths(entry.children);
            }
        }
    }

    collectPaths(files);
    paths.sort(); // Sort for consistent hashing

    return paths.join("|");
}

/**
 * Check if two file structures are different
 */
export function hasFileStructureChanged(
    oldFiles: FileEntry[],
    newFiles: FileEntry[]
): boolean {
    const oldHash = generateFileStructureHash(oldFiles);
    const newHash = generateFileStructureHash(newFiles);
    return oldHash !== newHash;
}
