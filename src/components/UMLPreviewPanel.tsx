import { useBackground } from "@/hooks/useBackground";
import { ZoomableView } from "./ZoomableView";
import { Badge } from "./ui/badge";
import { Check, RefreshCcw } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { MessageToolbar } from "./MessageToolbar";

interface UMLPreviewPanelProps {
  svgContent: string;
  hidden?: boolean;
  onMessageClick?: (messageText: string, from?: string, to?: string, messageIndex?: number) => void;
  onMessageDelete?: (messageIndex: number) => void;
  onMessageEdit?: (messageIndex: number, newMessage: string) => void;
}

export function UMLPreviewPanel({
  svgContent,
  hidden,
  onMessageClick,
  onMessageDelete,
  onMessageEdit,
}: UMLPreviewPanelProps) {
  const { previewBackground } = useBackground();
  const [toolbarOpen, setToolbarOpen] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState<{
    text: string;
    from?: string;
    to?: string;
    index?: number;
  } | null>(null);

  // Detect content type: HTML or SVG
  const contentType = useMemo(() => {
    const trimmedContent = svgContent.trim();
    console.log('[UMLPreviewPanel] Content detection:', {
      startsWithDoctype: trimmedContent.toLowerCase().startsWith('<!doctype html'),
      startsWithHtml: trimmedContent.toLowerCase().startsWith('<html'),
      containsSvg: trimmedContent.includes('<svg'),
      firstChars: trimmedContent.substring(0, 50)
    });

    // Check if content starts with HTML doctype or html tag
    if (
      trimmedContent.toLowerCase().startsWith('<!doctype html') ||
      trimmedContent.toLowerCase().startsWith('<html')
    ) {
      console.log('[UMLPreviewPanel] Detected as HTML');
      return 'html';
    }
    // Check if content contains SVG
    if (trimmedContent.includes('<svg')) {
      console.log('[UMLPreviewPanel] Detected as SVG');
      return 'svg';
    }
    // Default to SVG for backward compatibility
    console.log('[UMLPreviewPanel] Defaulting to SVG');
    return 'svg';
  }, [svgContent]);

  // Flash effect to highlight clicked text elements
  const flashTextElement = (textElement: SVGTextElement) => {
    // Store original fill color
    const originalFill = textElement.getAttribute('fill') || '#000000';

    // Change to highlight color
    textElement.setAttribute('fill', '#FF0000'); // Red color

    // Revert back to original color after animation
    setTimeout(() => {
      textElement.setAttribute('fill', originalFill);
    }, 200); // Flash duration: 200ms
  };

  // Add a click event on the svg content
  // User can click on the message to show the toolbar
  useEffect(() => {
    if (!onMessageClick || contentType !== 'svg') return;

    const messages = document.querySelectorAll(".message");

    const handler = (ev: Event) => {
      const target = ev.target as HTMLElement;
      const parent = target.parentNode as HTMLElement;

      messages.forEach((message, messageIndex) => {
        if (message === parent) {
          // Extract message text from the SVG
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

          // Store selected message data
          setSelectedMessage({
            text: messageText,
            from: fromParticipant || undefined,
            to: toParticipant || undefined,
            index: messageIndex,
          });

          // Calculate toolbar position near the clicked element
          const rect = target.getBoundingClientRect();
          setToolbarPosition({
            x: rect.left + rect.width / 2,
            y: rect.bottom + 10,
          });

          // Immediately jump to code when message is clicked
          if (messageText && onMessageClick) {
            onMessageClick(messageText, fromParticipant || undefined, toParticipant || undefined, messageIndex);
          }

          // Show toolbar
          setToolbarOpen(true);
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
  }, [svgContent, onMessageClick, contentType]);

  const handleJumpToCode = () => {
    if (selectedMessage && onMessageClick) {
      onMessageClick(
        selectedMessage.text,
        selectedMessage.from,
        selectedMessage.to,
        selectedMessage.index
      );
    }
    setToolbarOpen(false);
  };

  const handleDelete = () => {
    if (selectedMessage?.index !== undefined && onMessageDelete) {
      onMessageDelete(selectedMessage.index);
    }
    setToolbarOpen(false);
  };

  const handleEditMessage = (newMessage: string) => {
    if (selectedMessage?.index !== undefined && onMessageEdit) {
      onMessageEdit(selectedMessage.index, newMessage);
    }
    setToolbarOpen(false);
  };

  // Render HTML content in iframe
  const renderHtmlPreview = () => {
    console.log('[UMLPreviewPanel] Rendering HTML preview, content length:', svgContent.length);
    return (
      <iframe
        key={svgContent.substring(0, 100)} // Force re-render when content changes
        srcDoc={svgContent}
        className="w-full h-[calc(100vh-34px)] border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        title="HTML Preview"
        style={{ backgroundColor: '#ffffff' }}
      />
    );
  };

  // Render SVG content with dangerouslySetInnerHTML
  const renderSvgPreview = () => (
    <ZoomableView className="h-full">
      <div
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="max-w-full h-[calc(100vh - 34px)] uml-preview"
      />
    </ZoomableView>
  );

  return (
    <div className={`uml-preview-card relative ${hidden ? "hidden" : ""}`}
      style={{ height: "100%", backgroundColor: contentType === 'html' ? '#ffffff' : previewBackground }}>

      <div className="absolute top-2 right-2 z-10">
        <Badge variant="outline" id="status-badge">
          <Check className="w-4 h-4" id="stt-icon-save" />
          <RefreshCcw className="w-4 h-4 animate-spin hidden" id="stt-icon-loading" />
          <span id="stt-text">Saved</span>
        </Badge>
      </div>

      {contentType === 'html' ? renderHtmlPreview() : renderSvgPreview()}

      {contentType === 'svg' && (
        <MessageToolbar
          open={toolbarOpen}
          position={toolbarPosition}
          currentMessage={selectedMessage?.text}
          onJumpToCode={handleJumpToCode}
          onDelete={handleDelete}
          onEditMessage={handleEditMessage}
          onOpenChange={setToolbarOpen}
        />
      )}
    </div>
  );
}
