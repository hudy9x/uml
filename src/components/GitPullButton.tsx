import { useState } from "react";
import { Download } from "lucide-react";
import { gitPull } from "@/lib/gitUtils";
import { GitPullDialog } from "./GitPullDialog";
import { useExplorerReloadTrigger } from "@/stores/explorer";
import { toast } from "sonner";

interface GitPullButtonProps {
    workingDir?: string;
}

export function GitPullButton({ workingDir = "." }: GitPullButtonProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pullOutput, setPullOutput] = useState("");
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [, setReloadTrigger] = useExplorerReloadTrigger();

    const handlePull = async () => {
        setIsLoading(true);

        try {
            const result = await gitPull(workingDir);
            setPullOutput(result.output);
            setIsError(!result.success);
            setIsDialogOpen(true);

            if (result.success) {
                toast.success("Git pull completed");
            } else {
                toast.error("Git pull failed");
            }
        } catch (error) {
            setPullOutput(String(error));
            setIsError(true);
            setIsDialogOpen(true);
            toast.error("Git pull failed");
        } finally {
            setIsLoading(false);
            // Trigger Explorer reload regardless of success/error
            setReloadTrigger((prev) => prev + 1);
        }
    };

    if (!workingDir) {
        return null;
    }

    return (
        <>
            <button
                onClick={handlePull}
                disabled={isLoading}
                className="flex items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Download className="h-3 w-3" />
                <span>{isLoading ? "Pulling..." : "Pull"}</span>
            </button>

            <GitPullDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                output={pullOutput}
                isError={isError}
            />
        </>
    );
}
