import { useBackground } from "@/hooks/useBackground";
import { ZoomableView } from "./ZoomableView";
import { Badge } from "./ui/badge";
import { Check, RefreshCcw } from "lucide-react";
import { useEffect } from "react";

interface UMLPreviewPanelProps {
  svgContent: string;
  hidden?: boolean;
  onMessageClick?: (messageText: string, from?: string, to?: string, messageIndex?: number) => void;
}

export function UMLPreviewPanel({ svgContent, hidden, onMessageClick }: UMLPreviewPanelProps) {
  const { previewBackground } = useBackground();

  // Flash effect to highlight clicked text elements
  const flashTextElement = (textElement: SVGTextElement) => {
    // Store original fill color
    const originalFill = textElement.getAttribute('fill') || '#000000';

    // Change to highlight color
    textElement.setAttribute('fill', '#FF0000'); // Gold/yellow color

    // Revert back to original color after animation
    setTimeout(() => {
      textElement.setAttribute('fill', originalFill);
    }, 200); // Flash duration: 200ms
  };

  // Add a click event on the svg content
  // User can click on the message to trigger a Jump_To_Line action
  useEffect(() => {
    if (!onMessageClick) return;

    const messages = document.querySelectorAll(".message");

    const handler = (ev: Event) => {
      const target = ev.target as HTMLElement;
      const parent = target.parentNode as HTMLElement;

      messages.forEach((message, messageIndex) => {
        if (message === parent) {
          // Extract message text from the SVG
          // The message text is typically in a <text> element within the message group
          const textElements = message.querySelectorAll("text");
          let messageText = "";
          let fromParticipant = "";
          let toParticipant = "";

          // The last text element usually contains the message text
          if (textElements.length > 0) {
            const lastText = textElements[textElements.length - 1];
            messageText = lastText.textContent?.trim() || "";
          }

          // Try to extract participant information from the message structure
          // This is a heuristic approach based on PlantUML SVG structure
          const allTexts = Array.from(textElements).map(t => t.textContent?.trim() || "");

          // If we have at least 3 text elements, they might be: from, arrow, to, message
          if (allTexts.length >= 2) {
            // Try to find participant names (they're usually shorter and don't contain colons)
            const potentialParticipants = allTexts.filter(t => t && !t.includes(':'));
            if (potentialParticipants.length >= 2) {
              fromParticipant = potentialParticipants[0];
              toParticipant = potentialParticipants[1];
            }
          }

          console.log("Clicked message:", { messageText, fromParticipant, toParticipant, messageIndex });

          // Flash all text elements in the clicked message
          textElements.forEach(textEl => {
            flashTextElement(textEl as SVGTextElement);
          });

          if (messageText) {
            onMessageClick(messageText, fromParticipant || undefined, toParticipant || undefined, messageIndex);
          }
          return;
        }
      });
    };

    // Add click listeners
    messages.forEach(message => {
      message.removeEventListener("click", handler);
      message.addEventListener("click", handler);

      // Add cursor pointer style to indicate clickability
      (message as HTMLElement).style.cursor = "pointer";
    });

    // Cleanup
    return () => {
      messages.forEach(message => {
        message.removeEventListener("click", handler);
      });
    };
  }, [svgContent, onMessageClick]);

  return (
    <div className={`uml-preview-card relative ${hidden ? "hidden" : ""}`}
      style={{ height: "100%", backgroundColor: previewBackground }}>

      <div className="absolute top-2 right-2">
        <Badge variant="outline" id="status-badge">
          <Check className="w-4 h-4" id="stt-icon-save" />
          <RefreshCcw className="w-4 h-4 animate-spin hidden" id="stt-icon-loading" />
          <span id="stt-text">Saved</span>
        </Badge>
      </div>
      <ZoomableView className="h-full">
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          className="max-w-full h-[calc(100vh - 34px)] uml-preview"
        />
      </ZoomableView>
    </div>
  );
} 