import { useState, useEffect } from "react";
import { GitBranch, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { getCurrentBranch, getAllBranches, switchBranch } from "@/lib/gitUtils";
import { toast } from "sonner";

interface BranchSelectorProps {
    workingDir?: string;
}

export function BranchSelector({ workingDir = "." }: BranchSelectorProps) {
    const [currentBranch, setCurrentBranch] = useState<string>("");
    const [branches, setBranches] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const loadBranchData = async () => {
        const [current, all] = await Promise.all([
            getCurrentBranch(workingDir),
            getAllBranches(workingDir),
        ]);
        setCurrentBranch(current);
        setBranches(all);
    };

    useEffect(() => {
        loadBranchData();
    }, [workingDir]);

    const handleSwitchBranch = async (branchName: string) => {
        if (branchName === currentBranch) {
            setIsOpen(false);
            return;
        }

        setIsLoading(true);
        const success = await switchBranch(workingDir, branchName);

        if (success) {
            setCurrentBranch(branchName);
            toast.success(`Switched to branch '${branchName}'`);
            setIsOpen(false);
            // Reload branch data to ensure we have the latest state
            await loadBranchData();
        } else {
            toast.error(`Failed to switch to branch '${branchName}'`);
        }

        setIsLoading(false);
    };

    if (!currentBranch) {
        return null;
    }

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded cursor-pointer">
                    <GitBranch className="h-3 w-3" />
                    <span>{currentBranch}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start" side="top">
                <div className="space-y-1">
                    <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                        Switch Branch
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {branches.map((branch) => (
                            <button
                                key={branch}
                                onClick={() => handleSwitchBranch(branch)}
                                disabled={isLoading}
                                className="w-full flex items-center justify-between px-2 py-1.5 text-xs hover:bg-accent rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className={branch === currentBranch ? "font-semibold" : ""}>
                                    {branch}
                                </span>
                                {branch === currentBranch && (
                                    <Check className="h-3 w-3 text-primary" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
