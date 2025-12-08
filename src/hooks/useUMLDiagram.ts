import { useState, useEffect } from "react";
import { encode } from "plantuml-encoder";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { StatusBadge } from "@/lib/status-badge";

let debounceTimeout: number;

interface UseUMLDiagramProps {
  initialCode?: string;
  filePath?: string | null;
}

const PLANTUML_SERVER_URL = "http://localhost:8080/plantuml";

/**
 * Start the local PlantUML server
 */
export async function startPlantUMLServer(): Promise<void> {
  try {
    const message = await invoke<string>("start_plantuml_server");
    console.log(message);
  } catch (error) {
    console.error("Failed to start PlantUML server:", error);
    throw error;
  }
}

/**
 * Stop the local PlantUML server
 */
export async function stopPlantUMLServer(): Promise<void> {
  try {
    const message = await invoke<string>("stop_plantuml_server");
    console.log(message);
  } catch (error) {
    console.error("Failed to stop PlantUML server:", error);
  }
}

/**
 * Check if PlantUML server is running
 */
export async function checkPlantUMLServer(): Promise<boolean> {
  try {
    return await invoke<boolean>("check_plantuml_server");
  } catch (error) {
    console.error("Failed to check PlantUML server:", error);
    return false;
  }
}

export function useUMLDiagram({ initialCode = "", filePath }: UseUMLDiagramProps) {
  const [umlCode, setUmlCode] = useState(initialCode);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    if (!umlCode) {
      setSvgContent("");
      return;
    }

    clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(async () => {

      // Autosave to file system if we have a file path
      if (filePath) {
        StatusBadge.loading(true);
        try {
          await invoke("write_file_content", { path: filePath, content: umlCode });
          StatusBadge.loading(false);
        } catch (error) {
          console.error("Failed to autosave file:", error);
          StatusBadge.loading(false);
        }
      }

      // Generate SVG using local PlantUML server
      try {
        const encoded = encode(umlCode);
        const url = `${PLANTUML_SERVER_URL}/svg/${encoded}`;
        console.log("Fetching from local PlantUML server:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }

        const svg = await res.text();
        setSvgContent(svg);
      } catch (error) {
        console.error("Error fetching SVG from PlantUML server:", error);
        toast.error("Failed to generate UML diagram. Make sure PlantUML server is running.");
      }

    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [umlCode, filePath]);

  return {
    umlCode,
    setUmlCode,
    svgContent,
  };
}