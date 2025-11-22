import { Button } from "@/components/ui/button";
import openFolderIcon from "@/assets/open-folder.png";

interface ExplorerEmptyStateProps {
    onOpenFolder: () => void;
}

export function ExplorerEmptyState({ onOpenFolder }: ExplorerEmptyStateProps) {
    return (
        <div className="h-full flex flex-col items-center justify-center p-4 text-center bg-muted/10 border-r">
            <img src={openFolderIcon} alt="folder" className="w-12 h-12 opacity-70 mb-4" />
            <h3 className="font-semibold mb-2">No Folder Open</h3>
            <p className="text-sm text-muted-foreground mb-4">Open a folder to start browsing files.</p>
            <Button onClick={onOpenFolder}>Open Folder</Button>
        </div>
    );
}
