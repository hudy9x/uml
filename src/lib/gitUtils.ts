import { invoke } from "@tauri-apps/api/core";

export async function getCurrentBranch(workingDir: string): Promise<string> {
    try {
        const branch = await invoke<string>("get_current_branch", { workingDir });
        return branch;
    } catch (error) {
        console.error("Failed to get current branch:", error);
        return "";
    }
}

export async function getAllBranches(workingDir: string): Promise<string[]> {
    try {
        const branches = await invoke<string[]>("get_all_branches", { workingDir });
        return branches;
    } catch (error) {
        console.error("Failed to get all branches:", error);
        return [];
    }
}

export async function switchBranch(workingDir: string, branchName: string): Promise<boolean> {
    try {
        await invoke<string>("switch_branch", { workingDir, branch: branchName });
        return true;
    } catch (error) {
        console.error("Failed to switch branch:", error);
        return false;
    }
}

export async function getGitStatus(workingDir: string): Promise<Record<string, string>> {
    try {
        const statusMap = await invoke<Record<string, string>>("get_git_status", { workingDir });
        return statusMap;
    } catch (error) {
        console.error("Failed to get git status:", error);
        return {};
    }
}

export function getGitStatusColor(status: string | undefined): string {
    if (!status) return "";

    switch (status) {
        case "modified":
            return "text-orange-500";
        case "added":
        case "untracked":
            return "text-green-500";
        case "deleted":
            return "text-red-500";
        case "renamed":
            return "text-blue-500";
        case "copied":
            return "text-purple-500";
        default:
            return "";
    }
}

/**
 * Check if a folder or any of its children have a specific git status
 * This is used to apply colors to folders when their contents are modified/added
 */
export function getFolderGitStatus(
    folderPath: string,
    gitStatus: Record<string, string>
): string | undefined {
    // Check if the folder itself has a status (e.g., newly added folder)
    if (gitStatus[folderPath]) {
        return gitStatus[folderPath];
    }

    // Check if any children have status
    const folderPathWithSlash = folderPath.endsWith('/') ? folderPath : `${folderPath}/`;
    for (const [path, status] of Object.entries(gitStatus)) {
        if (path.startsWith(folderPathWithSlash)) {
            // If any child is added/untracked, mark folder as such
            if (status === "added" || status === "untracked") {
                return "untracked";
            }
        }
    }

    return undefined;
}

/**
 * Get the effective git status for a file or folder
 * If the item doesn't have a direct status, check if any parent folder has a status
 * This ensures children of newly added folders inherit the green color
 */
export function getEffectiveGitStatus(
    itemPath: string,
    isDir: boolean,
    gitStatus: Record<string, string>
): string | undefined {
    // For directories, use the folder-specific logic
    if (isDir) {
        return getFolderGitStatus(itemPath, gitStatus);
    }

    // For files, first check direct status
    if (gitStatus[itemPath]) {
        return gitStatus[itemPath];
    }

    // If no direct status, check if any parent folder is untracked/added
    // This handles children of newly added folders
    let currentPath = itemPath;
    while (currentPath.includes('/')) {
        const lastSlash = currentPath.lastIndexOf('/');
        const parentPath = currentPath.substring(0, lastSlash);

        if (gitStatus[parentPath] === "untracked" || gitStatus[parentPath] === "added") {
            return gitStatus[parentPath];
        }

        currentPath = parentPath;
    }

    return undefined;
}

export async function gitPull(workingDir: string): Promise<{ success: boolean; output: string }> {
    try {
        const output = await invoke<string>("git_pull", { workingDir });
        return { success: true, output };
    } catch (error) {
        console.error("Failed to git pull:", error);
        return { success: false, output: String(error) };
    }
}
