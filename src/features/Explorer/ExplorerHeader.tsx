import { Button } from "@/components/ui/button";
import { PanelLeftClose, PanelLeft } from "lucide-react";
import { ExplorerActionsMenu } from "./ExplorerActionsMenu";

interface ExplorerHeaderProps {
    isExplorerVisible: boolean;
    onToggleExplorer: () => void;
    rootPath: string | null;
    onOpenFolder: () => void;
    onCreateFile: () => void;
    onCreateFolder: () => void;
}

export function ExplorerHeader({
    isExplorerVisible,
    onToggleExplorer,
    rootPath,
    onOpenFolder,
    onCreateFile,
    onCreateFolder,
}: ExplorerHeaderProps) {
    return (
        <div className="flex items-center justify-between px-3 py-2 border-b bg-background">
            <h2 className="text-sm font-semibold uppercase tracking-wide">Explorer</h2>
            <div className="flex gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={onToggleExplorer}
                    title={isExplorerVisible ? "Hide Explorer" : "Show Explorer"}
                >
                    {isExplorerVisible ? <PanelLeftClose size={14} /> : <PanelLeft size={14} />}
                </Button>
                <ExplorerActionsMenu
                    rootPath={rootPath}
                    onOpenFolder={onOpenFolder}
                    onCreateFile={onCreateFile}
                    onCreateFolder={onCreateFolder}
                />
            </div>
        </div>
    );
}
