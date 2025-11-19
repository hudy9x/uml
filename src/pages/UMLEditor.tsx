import { useState, useEffect } from "react";
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
import { FileExplorer } from "../components/FileExplorer";

export default function UMLEditor() {
  const { umlId } = useParams();
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const projectName = projects.find(p => p.id === umlId)?.name ?? "";
  const maxEditorSize = 100;
  const [editorSize, setEditorSize] = useState(30);

  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);

  const { umlCode, setUmlCode, svgContent } = useUMLDiagram({
    umlId,
    initialCode: "",
  });

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

  const handleFileSelect = (path: string, content: string) => {
    setCurrentFilePath(path);
    setUmlCode(content);
    // Optionally update URL or state to reflect file mode
  };

  return (
    <main className="uml-editor-page bg-[var(--background)]">
      <ResizablePanelGroup
        direction="horizontal"
        style={{ width: "100vw", height: "calc(100vh - 29px)" }}
      >
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <FileExplorer onFileSelect={handleFileSelect} />
        </ResizablePanel>

        <ResizableHandle className="bg-transparent hover:bg-foreground/40" withHandle />

        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={editorSize}>
              <div className="uml-editor-panel">
                <UMLEditorHeader
                  projectName={currentFilePath ? currentFilePath.split(/[/\\]/).pop() || "Untitled" : projectName}
                  umlCode={umlCode}
                  onOpenPreview={openPreviewWindow}
                  onSave={currentFilePath ? saveFile : undefined}
                />
                <UMLEditorPanel
                  umlCode={umlCode}
                  onChange={(value) => setUmlCode(value)}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle className="bg-transparent hover:bg-foreground/40" withHandle />

            <ResizablePanel defaultSize={maxEditorSize - editorSize}>
              <UMLPreviewPanel svgContent={svgContent} hidden={!!previewWindow} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
