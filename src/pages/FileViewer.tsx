import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { toast } from "sonner";
import { UMLEditorPanel, UMLEditorPanelRef } from "../components/UMLEditorPanel";
import { UMLPreviewPanel } from "../components/UMLPreviewPanel";
import { useUMLDiagram } from "../hooks/useUMLDiagram";
import { useFileOpener } from "../hooks/useFileOpener";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Home, Loader2, Eye, EyeOff } from "lucide-react";
import { findMessageLine } from "../lib/uml-parser";

/**
 * FileViewer page - Minimal UI for viewing files opened via file association
 * Shows only the editor and preview panels without the explorer
 */
export default function FileViewer() {
  const navigate = useNavigate();
  const { filePath, isLoading: isFileOpenerLoading } = useFileOpener();
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(() => {
    // Read from localStorage, default to true if not set
    const saved = localStorage.getItem('fileViewer.showEditor');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const editorRef = useRef<UMLEditorPanelRef>(null);
  const [errorCount, setErrorCount] = useState(0);

  // Persist showEditor state to localStorage
  useEffect(() => {
    localStorage.setItem('fileViewer.showEditor', JSON.stringify(showEditor));
  }, [showEditor]);

  const { umlCode, setUmlCode, svgContent } = useUMLDiagram({
    initialCode: "",
    filePath: currentFilePath,
  });

  // Load file content when filePath is available
  useEffect(() => {
    if (filePath) {
      console.log("[FileViewer] Loading file:", filePath);
      invoke<string>("read_file_content", { path: filePath })
        .then((content) => {
          setCurrentFilePath(filePath);
          setUmlCode(content);
          toast.success(`Opened: ${filePath.split('/').pop()}`);
        })
        .catch((err) => {
          console.error("[FileViewer] Failed to load file:", err);
          toast.error(`Failed to load file: ${err}`);
        });
    }
  }, [filePath, setUmlCode]);

  // Auto-save functionality
  const autoSave = useCallback(async (content: string) => {
    setUmlCode(content);

    if (!currentFilePath) return;

    try {
      setIsSaving(true);
      await invoke("write_file_content", {
        path: currentFilePath,
        content: content,
      });
      console.log("[FileViewer] File saved:", currentFilePath);
    } catch (error) {
      console.error("[FileViewer] Failed to save file:", error);
      toast.error(`Failed to save: ${error}`);
    } finally {
      setIsSaving(false);
    }
  }, [currentFilePath, setUmlCode]);

  // Handle message click from preview panel
  const handleMessageClick = useCallback((messageText: string, _from?: string, _to?: string, messageIndex?: number) => {
    if (messageIndex === undefined) {
      console.warn('[FileViewer] No message index provided');
      return;
    }

    const lineNumber = findMessageLine(messageIndex, umlCode);

    if (lineNumber) {
      editorRef.current?.jumpToLine(lineNumber);
      console.log(`[FileViewer] Jumping to line ${lineNumber} for message: "${messageText}"`);
    } else {
      console.warn(`[FileViewer] Could not find line for message at SVG index ${messageIndex}`);
    }
  }, [umlCode]);

  // Handle message delete from preview panel
  const handleMessageDelete = useCallback((messageIndex: number) => {
    const lineNumber = findMessageLine(messageIndex, umlCode);

    if (lineNumber) {
      editorRef.current?.deleteLine(lineNumber);
      console.log(`[FileViewer] Deleted line ${lineNumber} for message at SVG index ${messageIndex}`);
      toast.success('Message deleted');
    } else {
      console.warn(`[FileViewer] Could not find line for message at SVG index ${messageIndex}`);
      toast.error('Could not find message line');
    }
  }, [umlCode]);

  // Handle message edit from preview panel
  const handleMessageEdit = useCallback((messageIndex: number, newMessage: string) => {
    const lineNumber = findMessageLine(messageIndex, umlCode);

    if (lineNumber) {
      editorRef.current?.replaceMessage(lineNumber, newMessage);
      console.log(`[FileViewer] Replaced message on line ${lineNumber} with: "${newMessage}"`);
      toast.success('Message updated');
    } else {
      console.warn(`[FileViewer] Could not find line for message at SVG index ${messageIndex}`);
      toast.error('Could not find message line');
    }
  }, [umlCode]);

  // Navigate to full editor
  const handleOpenInFullEditor = () => {
    navigate('/');
  };

  // Show loading state
  if (isFileOpenerLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2">Loading file...</span>
        </div>
      </div>
    );
  }

  // Show error if no file was opened
  if (!filePath && !isFileOpenerLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No File Opened</h2>
          <p className="text-muted-foreground mb-4">
            This page is for viewing files opened via file association.
          </p>
          <Button onClick={handleOpenInFullEditor}>
            <Home className="mr-2 h-4 w-4" />
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header with file name and actions */}
      <header className="h-[40px] border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {currentFilePath?.split('/').pop() || 'Untitled'}
          </span>
          {errorCount > 0 && (
            <span className="text-xs text-destructive">
              ({errorCount} error{errorCount !== 1 ? 's' : ''})
            </span>
          )}
          {isSaving && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowEditor(!showEditor)}
            title={showEditor ? "Hide Editor" : "Show Editor"}
          >
            {showEditor ? (
              <EyeOff className="mr-2 h-4 w-4" />

            ) : (
              <Eye className="mr-2 h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInFullEditor}
          >
            <Home className="mr-2 h-4 w-4" />
            Open in Full Editor
          </Button>
        </div>
      </header>

      {/* Main Editor Area */}
      <main className="flex-1 relative bg-[var(--background)]">
        <ResizablePanelGroup
          direction="horizontal"
          style={{ width: "100vw", height: "calc(100vh - 40px)" }}
        >
          {showEditor && (
            <>
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex flex-col h-full">
                  <UMLEditorPanel
                    ref={editorRef}
                    umlCode={umlCode}
                    onChange={(value) => autoSave(value)}
                    onErrorCountChange={setErrorCount}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          <ResizablePanel defaultSize={showEditor ? 50 : 100} minSize={30}>
            <UMLPreviewPanel
              svgContent={svgContent}
              onMessageClick={handleMessageClick}
              onMessageDelete={handleMessageDelete}
              onMessageEdit={handleMessageEdit}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
