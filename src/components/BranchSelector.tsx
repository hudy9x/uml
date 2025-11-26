import { useState, useEffect, useRef } from "react";
import { GitBranch, Check } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
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
    const [isWindowFocused, setIsWindowFocused] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const loadBranchData = async () => {
        const [current, all] = await Promise.all([
            getCurrentBranch(workingDir),
            getAllBranches(workingDir),
        ]);
        setCurrentBranch(current);
        setBranches(all);
    };

    // Track window focus state
    useEffect(() => {
        const handleFocus = () => setIsWindowFocused(true);
        const handleBlur = () => setIsWindowFocused(false);

        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
        };
    }, []);

    // Initial load and auto-reload when focused
    useEffect(() => {
        // Load immediately
        loadBranchData();

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        // Set up auto-reload every 1 second when window is focused
        if (isWindowFocused) {
            intervalRef.current = setInterval(() => {
                loadBranchData();
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [workingDir, isWindowFocused]);

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
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded cursor-pointer">
                    <GitBranch className="h-3 w-3" />
                    <span>{currentBranch}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="top" className="w-64 max-h-64 overflow-y-auto">
                {branches.map((branch) => (
                    <DropdownMenuItem
                        key={branch}
                        onClick={() => handleSwitchBranch(branch)}
                        disabled={isLoading}
                        className="cursor-pointer"
                    >
                        <span className={branch === currentBranch ? "font-semibold" : ""}>
                            {branch}
                        </span>
                        {branch === currentBranch && (
                            <Check className="h-3 w-3 text-primary ml-auto" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
