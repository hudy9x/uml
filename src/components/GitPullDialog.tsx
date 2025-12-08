import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface GitPullDialogProps {
    isOpen: boolean;
    onClose: () => void;
    output: string;
    isError: boolean;
}

export function GitPullDialog({ isOpen, onClose, output, isError }: GitPullDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Git Pull Result</DialogTitle>
                    <DialogDescription>
                        {isError ? "Git pull encountered an error" : "Git pull completed"}
                    </DialogDescription>
                </DialogHeader>

                <div className="h-[400px] w-full rounded-md border p-4 overflow-auto">
                    <pre className={`text-xs font-mono whitespace-pre-wrap ${isError ? "text-red-500" : ""}`}>
                        {output || "No output"}
                    </pre>
                </div>

                <DialogFooter>
                    <Button onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
