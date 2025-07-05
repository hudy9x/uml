import { useState, useEffect } from "react";
import { encode } from "plantuml-encoder";
import { toast } from "sonner";
import { updateProject } from "../lib/db";

let debounceTimeout: number;

interface UseUMLDiagramProps {
  umlId?: string;
  initialCode?: string;
}

export function useUMLDiagram({ umlId, initialCode = "" }: UseUMLDiagramProps) {
  const [umlCode, setUmlCode] = useState(initialCode);
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    if (!umlCode) {
      setSvgContent("");
      return;
    }

    clearTimeout(debounceTimeout);
    debounceTimeout = window.setTimeout(async () => {
      const encoded = encode(umlCode);

      // Generate SVG
      try {
        const res = await fetch(
          `https://www.plantuml.com/plantuml/svg/${encoded}`
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
  }, [umlCode, umlId]);

  return {
    umlCode,
    setUmlCode,
    svgContent,
  };
} 