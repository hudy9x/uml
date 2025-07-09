import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { getProject } from "../lib/db";
import { toast } from "sonner";
import { UMLEditorHeader } from "../components/UMLEditorHeader";
import { UMLEditorPanel } from "../components/UMLEditorPanel";
import { UMLPreviewPanel } from "../components/UMLPreviewPanel";
import { usePreviewWindow } from "../components/PreviewWindowManager";
import { useUMLDiagram } from "../hooks/useUMLDiagram";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useProjectStore } from "@/stores/project";

export default function UMLEditor() {
  const { umlId } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  const projectName = projects.find(p => p.id === umlId)?.name ?? "";
  const maxEditorSize = 100;
  const [editorSize, setEditorSize] = useState(30);

  const { umlCode, setUmlCode, svgContent } = useUMLDiagram({
    umlId,
    initialCode: "",
  });

  const { previewWindow, openPreviewWindow } = usePreviewWindow({
    umlCode,
    projectName,
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
    if (!umlId) {
      toast.warning("No project selected");
      navigate("/");
      return;
    }

    loadProject();
  }, [umlId]);

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

  return (
    <main className="uml-editor-page bg-[var(--background)]">
      <ResizablePanelGroup
        direction="horizontal"
        style={{ height: "calc(100vh - 29px)" }}
      >
        <ResizablePanel defaultSize={editorSize}>
          <div className="uml-editor-panel">
            <UMLEditorHeader
              projectName={projectName}
              umlCode={umlCode}
              onOpenPreview={openPreviewWindow}
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
    </main>
  );
}
