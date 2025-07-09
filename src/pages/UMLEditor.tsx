import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { getProject, updateProject } from "../lib/db";
import { toast } from "sonner";
import { UMLEditorHeader } from "../components/UMLEditorHeader";
import { UMLEditorPanel } from "../components/UMLEditorPanel";
import { UMLPreviewPanel } from "../components/UMLPreviewPanel";
import { usePreviewWindow } from "../components/PreviewWindowManager";
import { useUMLDiagram } from "../hooks/useUMLDiagram";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

export default function UMLEditor() {
  const { umlId } = useParams();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("");
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
    setProjectName(project.name);
  }

  const handleProjectNameChange = async (newName: string) => {
    if (!umlId) return;
    await updateProject(umlId, { name: newName });
    setProjectName(newName);
    toast.success("Project name updated!");
  };

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
              onProjectNameChange={handleProjectNameChange}
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
