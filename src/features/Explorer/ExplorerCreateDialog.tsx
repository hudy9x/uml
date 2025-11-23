import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ExplorerCreateDialogProps {
    isOpen: boolean;
    type: "file" | "folder";
    parentPath: string;
    onClose: () => void;
    onCreate: (parentPath: string, name: string) => Promise<void>;
}

export function ExplorerCreateDialog({
    isOpen,
    type,
    parentPath,
    onClose,
    onCreate,
}: ExplorerCreateDialogProps) {
    const [newItemName, setNewItemName] = useState("");

    const handleCreate = async () => {
        if (!newItemName) return;
        try {
            await onCreate(parentPath, newItemName);
            setNewItemName("");
            onClose();
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New {type === "file" ? "File" : "Folder"}</DialogTitle>
                </DialogHeader>
                <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={`Enter ${type} name`}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                />
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate}>Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

import { useState } from "react";
