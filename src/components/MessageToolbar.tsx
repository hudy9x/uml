import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Code2, Trash2, Edit3 } from "lucide-react";

interface MessageToolbarProps {
    open: boolean;
    position: { x: number; y: number };
    onJumpToCode: () => void;
    onDelete: () => void;
    onEdit: () => void;
    onOpenChange: (open: boolean) => void;
}

export function MessageToolbar({
    open,
    position,
    onJumpToCode,
    onDelete,
    onEdit,
    onOpenChange,
}: MessageToolbarProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverContent
                className="w-auto p-2"
                style={{
                    position: "fixed",
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                }}
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onJumpToCode}
                        title="Jump to Code"
                    >
                        <Code2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={onEdit}
                        title="Edit Message"
                    >
                        <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={onDelete}
                        title="Delete Message"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
