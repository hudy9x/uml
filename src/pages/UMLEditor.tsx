import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { toast } from "sonner";
import { UMLEditorHeader } from "../components/UMLEditorHeader";
import { UMLEditorPanel, UMLEditorPanelRef } from "../components/UMLEditorPanel";
import { UMLPreviewPanel } from "../components/UMLPreviewPanel";
import { usePreviewWindow } from "../components/PreviewWindowManager";
import { useUMLDiagram } from "../hooks/useUMLDiagram";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useProjectStore } from "@/stores/project";
import { invoke } from "@tauri-apps/api/core";
import { Explorer } from "@/features/Explorer";
import { findMessageLine } from "../lib/uml-parser";
import { Button } from "@/components/ui/button";
import { PanelLeftOpen } from "lucide-react";

export default function UMLEditor() {
  const { umlId } = useParams();
  const projects = useProjectStore((state) => state.projects);
  const projectName = projects.find(p => p.id === umlId)?.name ?? "";
  const maxEditorSize = 100;
  const [editorSize, setEditorSize] = useState(30);

  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const editorRef = useRef<UMLEditorPanelRef>(null);
  const [errorCount, setErrorCount] = useState(0);

  // Load explorer visibility state from localStorage
  const [isExplorerVisible, setIsExplorerVisible] = useState(() => {
    const saved = localStorage.getItem("explorerVisible");
    return saved !== null ? saved === "true" : true; // Default to true if not set
  });

  // Load editor visibility state from localStorage
  const [isEditorVisible, setIsEditorVisible] = useState(() => {
    const saved = localStorage.getItem("editorVisible");
    return saved !== null ? saved === "true" : true; // Default to true if not set
  });

  const { umlCode, setUmlCode, svgContent } = useUMLDiagram({
    initialCode: "",
    filePath: currentFilePath,
  });

  // Load last opened file on mount
  useEffect(() => {
    const lastFile = localStorage.getItem("lastOpenedFile");
    if (lastFile) {
      invoke<string>("read_file_content", { path: lastFile })
        .then((content) => {
          setCurrentFilePath(lastFile);
          setUmlCode(content);
        })
        .catch((err) => {
          console.error("Failed to load last opened file:", err);
          toast.error(`Failed to load last opened file: ${err}`);
        });
    }
  }, []);

  // Persist currentFilePath to localStorage
  useEffect(() => {
    if (currentFilePath) {
      localStorage.setItem("lastOpenedFile", currentFilePath);
    }
  }, [currentFilePath]);

  // Persist explorer visibility state
  useEffect(() => {
    localStorage.setItem("explorerVisible", String(isExplorerVisible));
  }, [isExplorerVisible]);

  // Persist editor visibility state
  useEffect(() => {
    localStorage.setItem("editorVisible", String(isEditorVisible));
  }, [isEditorVisible]);

  const { previewWindow, openPreviewWindow } = usePreviewWindow({
    umlCode,
    projectName: currentFilePath ? currentFilePath.split('/').pop() || projectName : projectName,
    svgContent,
    onPreviewWindowChange: (window: WebviewWindow | null) => {
      if (window) {
        setEditorSize(maxEditorSize);
      } else {
        setEditorSize(30);
      }
    },
  });

  const autoSave = (content: string) => {
    setUmlCode(content)
  }

  const handleFileSelect = useCallback(async (path: string, _content: string) => {
    // Always read fresh content from file, ignore cached content
    try {
      const freshContent = await invoke<string>("read_file_content", { path });
      setCurrentFilePath(path);
      setUmlCode(freshContent);
    } catch (error) {
      console.error("Failed to read file:", error);
      toast.error(`Failed to read file: ${error}`);
    }
  }, [setUmlCode]);

  // Handle message click from preview panel
  const handleMessageClick = useCallback((messageText: string, _from?: string, _to?: string, messageIndex?: number) => {
    if (messageIndex === undefined) {
      console.warn('No message index provided');
      return;
    }

    const lineNumber = findMessageLine(messageIndex, umlCode);

    if (lineNumber) {
      editorRef.current?.jumpToLine(lineNumber);
      console.log(`Jumping to line ${lineNumber} for message: "${messageText}" (SVG index ${messageIndex})`);
    } else {
      console.warn(`Could not find line for message at SVG index ${messageIndex}`);
    }
  }, [umlCode]);

  // Handle message delete from preview panel
  const handleMessageDelete = useCallback((messageIndex: number) => {
    const lineNumber = findMessageLine(messageIndex, umlCode);

    if (lineNumber) {
      editorRef.current?.deleteLine(lineNumber);
      console.log(`Deleted line ${lineNumber} for message at SVG index ${messageIndex}`);
      toast.success('Message deleted');
    } else {
      console.warn(`Could not find line for message at SVG index ${messageIndex}`);
      toast.error('Could not find message line');
    }
  }, [umlCode]);

  // Handle message edit from preview panel
  const handleMessageEdit = useCallback((messageIndex: number) => {
    const lineNumber = findMessageLine(messageIndex, umlCode);

    if (lineNumber) {
      editorRef.current?.jumpToLine(lineNumber);
      console.log(`Editing line ${lineNumber} for message at SVG index ${messageIndex}`);
      toast.info('Jump to line to edit message');
    } else {
      console.warn(`Could not find line for message at SVG index ${messageIndex}`);
      toast.error('Could not find message line');
    }
  }, [umlCode]);

  return (
    <div className="flex flex-col h-screen">
      {/* Main Editor Area */}
      <main className="uml-editor-page bg-[var(--background)] flex-1 relative">
        {/* Floating button to show editor when hidden */}
        {!isEditorVisible && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditorVisible(true)}
            className="absolute top-2 left-2 z-50 gap-2 shadow-lg"
          >
            <PanelLeftOpen size={16} />
          </Button>
        )}

        <ResizablePanelGroup
          direction="horizontal"
          style={{ width: "100vw", height: "calc(100vh - 29px)" }}
        >
          {isExplorerVisible && (
            <>
              <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
                <div className="h-full border-r bg-muted/10">
                  <Explorer
                    onFileSelect={handleFileSelect}
                    selectedPath={currentFilePath}
                    isExplorerVisible={isExplorerVisible}
                    onToggleExplorer={() => setIsExplorerVisible(!isExplorerVisible)}
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}
          {isEditorVisible && (
            <>
              <ResizablePanel defaultSize={editorSize} minSize={30}>
                <div className="flex flex-col h-full">
                  <UMLEditorHeader
                    projectName={projectName}
                    umlCode={umlCode}
                    currentFilePath={currentFilePath}
                    isExplorerVisible={isExplorerVisible}
                    isEditorVisible={isEditorVisible}
                    errorCount={errorCount}
                    onToggleExplorer={() => setIsExplorerVisible(!isExplorerVisible)}
                    onToggleEditor={() => setIsEditorVisible(!isEditorVisible)}
                    onOpenPreview={openPreviewWindow}
                  />
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
          <ResizablePanel
            defaultSize={maxEditorSize - editorSize}
            minSize={20}
          >
            <UMLPreviewPanel
              svgContent={svgContent}
              hidden={!!previewWindow}
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
