import { useState, useEffect } from "react";
import { encode } from "plantuml-encoder";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
// import { useBackground } from "./useBackground"; // Only needed for HTTP method
import { StatusBadge } from "@/lib/status-badge";

let debounceTimeout: number;

interface UseUMLDiagramProps {
  initialCode?: string;
  filePath?: string | null;
}

/**
 * Generate diagram using HTTP-based PlantUML server (existing method)
 */
export function generateDiagramByHttp(
  umlCode: string,
  previewUrl: string,
  isDarkBackground: boolean,
  previewBackground: string
): Promise<string> {
  const changeBackground = (isDark: boolean, code: string) => {
    if (isDark) {
      return code.replace(`@startuml`, `@startuml\n<style>
root {
  BackgroundColor ${previewBackground}
}
</style>`)
    }
    return code
  }

  return new Promise(async (resolve, reject) => {
    try {
      const encoded = encode(changeBackground(isDarkBackground, umlCode));
      const base = (previewUrl ?? '').replace(/\/$/, '');
      console.log("URL", `${base}/svg/${encoded}`)
      const res = await fetch(`${base}/svg/${encoded}`);
      const svg = await res.text();
      resolve(svg);
    } catch (error) {
      console.error("Error fetching SVG:", error);
      reject(error);
    }
  });
}

/**
 * Generate diagram using local PlantUML command (new method)
 */
export async function generateDiagramByCommand(
  filePath: string,
  format: 'svg' | 'png' = 'svg'
): Promise<string> {
  try {
    const result = await invoke<{ content: string; format: string }>(
      "generate_diagram",
      { filePath, format }
    );
    return result.content;
  } catch (error) {
    console.error("Error generating diagram:", error);
    throw error;
  }
}

export function useUMLDiagram({ initialCode = "", filePath }: UseUMLDiagramProps) {
  const [umlCode, setUmlCode] = useState(initialCode);
  const [svgContent, setSvgContent] = useState("");
  // Note: previewBackground, isDarkBackground, previewUrl are only needed for HTTP method
  // const { previewBackground, isDarkBackground, previewUrl } = useBackground();


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

      // Method 1: Generate SVG using HTTP-based PlantUML server (commented for testing)
      // try {
      //   const svg = await generateDiagramByHttp(
      //     umlCode,
      //     previewUrl ?? '',
      //     isDarkBackground,
      //     previewBackground
      //   );
      //   setSvgContent(svg);
      // } catch (error) {
      //   console.error("Error fetching SVG:", error);
      //   toast.error("Failed to load UML diagram");
      // }

      // Method 2: Generate SVG using local PlantUML command
      if (filePath) {
        try {
          const svg = await generateDiagramByCommand(filePath, 'svg');
          setSvgContent(svg);
        } catch (error) {
          console.error("Error generating SVG:", error);
          toast.error("Failed to generate UML diagram");
        }
      }



    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [umlCode, filePath]); // Removed isDarkBackground, previewUrl - only needed for HTTP method

  return {
    umlCode,
    setUmlCode,
    svgContent,
  };
} 