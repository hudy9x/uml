import { useEffect } from "react";

import { toast } from "sonner";
import { useFileOpener } from "../hooks/useFileOpener";
import { invoke } from "@tauri-apps/api/core";
import { Loader2 } from "lucide-react";

/**
 * FileViewer page - Minimal UI for viewing files opened via file association
 * Shows only the editor and preview panels without the explorer
 */
export default function FileViewer() {

  const { filePath, isLoading } = useFileOpener();

  // Load file content when filePath is available
  useEffect(() => {
    if (filePath) {
      console.log("[FileViewer] Loading file:", filePath);
      invoke<string>("read_file_content", { path: filePath })
        .then((content) => {

          alert("load content" + filePath)
          console.log("content:", content)

          toast.success(`Opened: ${filePath.split('/').pop()}`);
        })
        .catch((err) => {
          console.error("[FileViewer] Failed to load file:", err);
          toast.error(`Failed to load file: ${err}`);
        });
    }
  }, [filePath]);


  return (

    <div>
      {isLoading && <Loader2 className="animate-spin" />}
      {!isLoading && filePath && <div>{filePath}</div>}
    </div>

  );
}
