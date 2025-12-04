import { Popover, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Trash2, Edit3, Check, CircleDot } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface MessageToolbarProps {
    open: boolean;
    position: { x: number; y: number };
    currentMessage?: string;
    onJumpToCode: () => void;
    onDelete: () => void;
    onEditMessage: (newMessage: string) => void;
    onOpenChange: (open: boolean) => void;
}

export function MessageToolbar({
    open,
    position,
    currentMessage,
    onJumpToCode,
    onDelete,
    onEditMessage,
    onOpenChange,
}: MessageToolbarProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    // Reset editing state when toolbar closes
    useEffect(() => {
        if (!open) {
            setIsEditing(false);
            setEditValue("");
        }
    }, [open]);

    // Focus input when entering edit mode
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    const handleEditClick = () => {
        setEditValue(currentMessage || "");
        setIsEditing(true);
    };

    const handleEditConfirm = () => {
        if (editValue.trim()) {
            onEditMessage(editValue.trim());
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleEditConfirm();
        } else if (e.key === "Escape") {
            setIsEditing(false);
        }
    };

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
                {isEditing ? (
                    <div className="flex gap-1 items-center">
                        <Input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="h-8 w-64"
                            placeholder="Enter new message..."
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleEditConfirm}
                            title="Confirm Edit"
                        >
                            <Check className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={onJumpToCode}
                            title="Jump to Code"
                        >
                            <CircleDot className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleEditClick}
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
                )}
            </PopoverContent>
        </Popover>
    );
}
