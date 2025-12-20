import { Popover, PopoverContent } from "../../components/ui/popover";
import { Button } from "../../components/ui/button";
import { FoldVertical, UnfoldVertical } from "lucide-react";

interface AltBlockToolbarProps {
    open: boolean;
    position: { x: number; y: number };
    altId: string;
    onAltClick: () => void;
    onElseClick: () => void;
    onOpenChange: (open: boolean) => void;
}

export function AltBlockToolbar({
    open,
    position,
    altId: _altId,
    onAltClick,
    onElseClick,
    onOpenChange,
}: AltBlockToolbarProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverContent
                className="w-auto p-0.5"
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
                        size="sm"
                        className="h-8 px-3"
                        onClick={onAltClick}
                        title="Toggle Alt Block"
                    >
                        <FoldVertical className="h-4 w-4 mr-1" />
                        Fold
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3"
                        onClick={onElseClick}
                        title="Toggle Else Block"
                    >
                        <UnfoldVertical className="h-4 w-4 mr-1" />
                        Unfold
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
