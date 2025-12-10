import { useState, useEffect } from "react";
import { encode } from "plantuml-encoder";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { StatusBadge } from "@/lib/status-badge";
import { usePlantUMLServerUrl } from "@/stores/plantumlServer";

let debounceTimeout: number;

interface UseUMLDiagramProps {
  initialCode?: string;
  filePath?: string | null;
}

/**
 * Start the local PlantUML server
 */
export async function startPlantUMLServer(): Promise<void> {
  console.log("[PlantUML] startPlantUMLServer called");
  try {
    const message = await invoke<string>("start_plantuml_server");
    console.log("[PlantUML] Server response:", message);
  } catch (error) {
    console.error("[PlantUML] invoke failed:", error);
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
  const serverUrl = usePlantUMLServerUrl();

  useEffect(() => {
    if (!umlCode) {
      setSvgContent("");
      return;
    }

    // Check if content is HTML
    const trimmedCode = umlCode.trim();
    const isHtml =
      trimmedCode.toLowerCase().startsWith('<!doctype html') ||
      trimmedCode.toLowerCase().startsWith('<html');

    if (isHtml) {
      console.log("[useUMLDiagram] Detected HTML content, passing through without processing");
      setSvgContent(umlCode);
      StatusBadge.loading(false);
      return;
    }

    // For UML content, process with PlantUML
    console.log("[useUMLDiagram] Processing UML content with PlantUML");
    StatusBadge.loading(true);

    clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(async () => {
      // Save file if path is provided
      if (filePath) {
        try {
          await invoke("write_file_content", {
            path: filePath,
            content: umlCode,
          });
          StatusBadge.loading(false);
        } catch (error) {
          console.error("Error saving file:", error);
          toast.error("Failed to save file");
        }
      }

      // Generate SVG using PlantUML server
      try {
        const encoded = encode(umlCode);
        const url = `${serverUrl}/svg/${encoded}`;
        console.log("Fetching from PlantUML server:", url);

        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`Server returned ${res.status}: ${res.statusText}`);
        }

        const svg = await res.text();
        setSvgContent(svg);
      } catch (error) {
        console.error("Error fetching SVG from PlantUML server:", error);
        toast.error("Failed to generate UML diagram. Check PlantUML server configuration in settings.");
      }

    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [umlCode, filePath, serverUrl]);

  return {
    umlCode,
    setUmlCode,
    svgContent,
  };
}