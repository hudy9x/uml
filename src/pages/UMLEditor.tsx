import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { getProject } from "../databases/projects";
import { toast } from "sonner";
import { UMLEditorHeader } from "../components/UMLEditorHeader";
import { UMLEditorPanel } from "../components/UMLEditorPanel";
import { UMLPreviewPanel } from "../components/UMLPreviewPanel";
import { usePreviewWindow } from "../components/PreviewWindowManager";
import { useUMLDiagram } from "../hooks/useUMLDiagram";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useProjectStore } from "@/stores/project";
import { invoke } from "@tauri-apps/api/core";
import { Explorer } from "@/features/Explorer";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";

export default function UMLEditor() {
  const { umlId } = useParams();
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const projectName = projects.find(p => p.id === umlId)?.name ?? "";
  const maxEditorSize = 100;
  const [editorSize, setEditorSize] = useState(30);

  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const [isExplorerVisible, setIsExplorerVisible] = useState(true);

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
  }, [setUmlCode]);

  // Save current file path to storage
  useEffect(() => {
    if (currentFilePath) {
      localStorage.setItem("lastOpenedFile", currentFilePath);
    }
  }, [currentFilePath]);

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

  useEffect(() => {
    if (!umlId && !currentFilePath) {
      // If no ID and no file selected, maybe just show empty or default?
      // But existing logic redirects to home.
      // We'll keep existing logic for now if no file is selected.
      // toast.warning("No project selected");
      // navigate("/");
      return;
    }

    if (umlId && !currentFilePath) {
      loadProject();
    }
  }, [umlId, currentFilePath]);

  // Keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (currentFilePath) {
          await saveFile();
        } else {
          toast.info("Save is only available for files in this mode");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentFilePath, umlCode]);

  async function loadProject() {
    if (!umlId) return;

    const project = await getProject(umlId);
    if (!project) {
      toast.error("Project not found");
      navigate("/");
      return;
    }

    setUmlCode(project.content);
  }

  async function saveFile() {
    if (!currentFilePath) return;
    try {
      await invoke("write_file_content", { path: currentFilePath, content: umlCode });
      toast.success("File saved");
    } catch (error) {
      console.error("Failed to save file:", error);
      toast.error(`Failed to save file: ${error}`);
    }
  }

  const handleFileSelect = useCallback((path: string, content: string) => {
    setCurrentFilePath(path);
    setUmlCode(content);
    // Optionally update URL or state to reflect file mode
  }, [setUmlCode]);

  return (
    <div className="flex flex-col h-screen">
      {/* Main Editor Area */}
      <main className="uml-editor-page bg-[var(--background)] flex-1 relative">
        {/* Floating toggle button when explorer is hidden */}
        {!isExplorerVisible && (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-2 left-2 z-50"
            onClick={() => setIsExplorerVisible(true)}
            title="Show Explorer"
          >
            <PanelLeft size={16} />
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
          <ResizablePanel defaultSize={editorSize} minSize={30}>
            <div className="flex flex-col h-full">
              <UMLEditorHeader
                projectName={currentFilePath ? currentFilePath.split(/[/\\]/).pop() || "Untitled" : projectName}
                umlCode={umlCode}
                onOpenPreview={openPreviewWindow}
              />
              <UMLEditorPanel
                umlCode={umlCode}
                onChange={(value) => setUmlCode(value)}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            defaultSize={maxEditorSize - editorSize}
            minSize={20}
          >
            <UMLPreviewPanel svgContent={svgContent} hidden={!!previewWindow} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </div>
  );
}
