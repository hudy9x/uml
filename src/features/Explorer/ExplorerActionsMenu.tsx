import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderOpen, FilePlus, FolderPlus, MoreVertical } from "lucide-react";

interface ExplorerActionsMenuProps {
    rootPath: string | null;
    onOpenFolder: () => void;
    onCreateFile: () => void;
    onCreateFolder: () => void;
}

export function ExplorerActionsMenu({
    rootPath,
    onOpenFolder,
    onCreateFile,
    onCreateFolder,
}: ExplorerActionsMenuProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 focus-visible:ring-0 focus-visible:ring-offset-0"
                    title="More Actions"
                >
                    <MoreVertical size={14} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5}>
                <DropdownMenuItem className="cursor-pointer" onClick={onOpenFolder}>
                    <FolderOpen size={14} className="mr-2" />
                    Open Folder
                </DropdownMenuItem>
                {rootPath && (
                    <>
                        <DropdownMenuItem className="cursor-pointer" onClick={onCreateFile}>
                            <FilePlus size={14} className="mr-2" />
                            New File
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={onCreateFolder}>
                            <FolderPlus size={14} className="mr-2" />
                            New Folder
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
