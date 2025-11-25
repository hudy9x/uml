import { FileEntry } from "@/features/Explorer/types";
import { invoke } from "@tauri-apps/api/core";
import { generateFileStructureHash } from "./fileStructureUtils";

/**
 * Centralized function to check and reload Explorer if file structure has changed
 * This can be called from:
 * - Polling mechanism (auto-reload)
 * - After git branch switch
 * - After any operation that might change file structure
 */
export async function checkAndReloadExplorer(
    rootPath: string,
    previousHash: string,
    loadDir: (path: string) => Promise<void>
): Promise<string> {
    try {
        // Fetch current file structure
        const freshFiles = await invoke<FileEntry[]>("list_dir", { path: rootPath });

        // Generate hash of current structure
        const currentHash = generateFileStructureHash(freshFiles);

        // Check if structure has changed
        if (currentHash !== previousHash) {
            console.log("File structure changed, reloading...");
            await loadDir(rootPath);
        }

        return currentHash;
    } catch (error) {
        console.error("Failed to check for file changes:", error);
        return previousHash;
    }
}
