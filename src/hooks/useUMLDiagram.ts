import { useState, useEffect } from "react";
import { encode } from "plantuml-encoder";
import { toast } from "sonner";
import { invoke } from "@tauri-apps/api/core";
import { useBackground } from "./useBackground";
import { StatusBadge } from "@/lib/status-badge";

let debounceTimeout: number;

interface UseUMLDiagramProps {
  initialCode?: string;
  filePath?: string | null;
}

export function useUMLDiagram({ initialCode = "", filePath }: UseUMLDiagramProps) {
  const [umlCode, setUmlCode] = useState(initialCode);
  const [svgContent, setSvgContent] = useState("");
  const { previewBackground, isDarkBackground, previewUrl } = useBackground();

  const changeBackground = (isDark: boolean, umlCode: string) => {
    if (isDark) {
      return umlCode.replace(`@startuml`, `@startuml\n<style>
root {
  BackgroundColor ${previewBackground}
}
</style>`)
    }
    return umlCode
  }

  useEffect(() => {
    if (!umlCode) {
      setSvgContent("");
      return;
    }

    clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(async () => {
      const encoded = encode(changeBackground(isDarkBackground, umlCode));

      // Generate SVG
      try {
        const base = (previewUrl ?? '').replace(/\/$/, '');
        console.log("URL", `${base}/svg/${encoded}`)
        const res = await fetch(`${base}/svg/${encoded}`);
        const svg = await res.text();
        setSvgContent(svg);
      } catch (error) {
        console.error("Error fetching SVG:", error);
        toast.error("Failed to load UML diagram");
      }

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
    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [umlCode, filePath, isDarkBackground, previewUrl]);

  return {
    umlCode,
    setUmlCode,
    svgContent,
  };
} 