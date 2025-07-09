import { useState, useEffect } from "react";
import { encode } from "plantuml-encoder";
import { toast } from "sonner";
import { updateProject } from "../lib/db";
// import { useTheme } from "next-themes";
import { useBackground } from "./useBackground";

let debounceTimeout: number;

interface UseUMLDiagramProps {
  umlId?: string;
  initialCode?: string;
}

export function useUMLDiagram({ umlId, initialCode = "" }: UseUMLDiagramProps) {
  const [umlCode, setUmlCode] = useState(initialCode);
  const [svgContent, setSvgContent] = useState("");
  // const { theme } = useTheme();
  const { previewBackground, isDarkBackground } = useBackground();

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
        const res = await fetch(
          `https://www.plantuml.com/plantuml/${isDarkBackground ? 'd' : ''}svg/${encoded}`
        );
        const svg = await res.text();
        setSvgContent(svg);
      } catch (error) {
        console.error("Error fetching SVG:", error);
        toast.error("Failed to load UML diagram");
      }

      // Save if we have a umlId
      if (umlId) {
        toast.info("Saving...");
        try {
          await updateProject(umlId, { content: umlCode });
          toast.success("Saved!");
        } catch (error) {
          toast.error("Failed to save diagram");
        }
      }
    }, 800);

    return () => clearTimeout(debounceTimeout);
  }, [umlCode, umlId, isDarkBackground]);

  return {
    umlCode,
    setUmlCode,
    svgContent,
  };
} 