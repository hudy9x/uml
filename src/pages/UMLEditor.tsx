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
    <main
      className="min-h-screen bg-background"
      style={{ backgroundColor: "color(srgb 0.1582 0.1724 0.2053)" }}
    >
      <div className="mx-auto px-4">
        <div>
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg py-4"
            style={{ height: "calc(100vh)" }}
          >
            <ResizablePanel defaultSize={editorSize}>
              <div className="h-full rounded-none border-0">
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

            <ResizableHandle className="invisible" />

            <ResizablePanel defaultSize={maxEditorSize - editorSize}>
              <UMLPreviewPanel
                svgContent={svgContent}
                hidden={!!previewWindow}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </main>
  );
}
