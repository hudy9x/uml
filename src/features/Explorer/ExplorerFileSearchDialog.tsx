import { useState, useEffect } from "react";
import { FileIcon, FolderIcon } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { FileEntry } from "./types";
import { useFileSearch } from "./hooks/useFileSearch";

interface ExplorerFileSearchDialogProps {
    isOpen: boolean;
    onClose: () => void;
    files: FileEntry[];
    rootPath: string | null;
    onFileSelect: (path: string) => void;
}

export function ExplorerFileSearchDialog({
    isOpen,
    onClose,
    files,
    rootPath,
    onFileSelect,
}: ExplorerFileSearchDialogProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const { filterFiles } = useFileSearch(files, rootPath);
    const filteredFiles = filterFiles(searchQuery);

    // Reset search query when dialog closes
    useEffect(() => {
        if (!isOpen) {
            setSearchQuery("");
        }
    }, [isOpen]);

    const handleSelectFile = (path: string) => {
        onFileSelect(path);
        onClose();
    };

    // Extract folder path for display
    const getFolderPath = (fullPath: string, fileName: string) => {
        const folderPath = fullPath.substring(0, fullPath.length - fileName.length - 1);
        if (!rootPath) return folderPath;

        // Show path relative to root
        if (folderPath.startsWith(rootPath)) {
            const relativePath = folderPath.substring(rootPath.length);
            return relativePath || "/";
        }
        return folderPath;
    };

    return (
        <CommandDialog
            open={isOpen}
            onOpenChange={(open: boolean) => {
                if (!open) onClose();
            }}
            title="Search Files"
            description="Search for files in the current workspace"
        >
            <CommandInput
                placeholder="Type to search files..."
                value={searchQuery}
                onValueChange={setSearchQuery}
            />
            <CommandList>
                <CommandEmpty>No files found.</CommandEmpty>
                <CommandGroup heading="Files">
                    {filteredFiles.map((file) => {
                        const folderPath = getFolderPath(file.path, file.name);
                        return (
                            <CommandItem
                                key={file.path}
                                value={file.path}
                                onSelect={() => handleSelectFile(file.path)}
                                className="flex items-center justify-between gap-2"
                            >
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <FileIcon className="shrink-0" size={16} />
                                    <span className="truncate font-medium">{file.name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-muted-foreground text-xs shrink-0">
                                    <FolderIcon size={12} />
                                    <span className="truncate max-w-[200px]">{folderPath}</span>
                                </div>
                            </CommandItem>
                        );
                    })}
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
