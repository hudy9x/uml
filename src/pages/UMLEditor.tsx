import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { encode } from "plantuml-encoder";
import { plantUML } from "../lib/codemirror/plantuml";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../components/ui/resizable";
import { getProject, updateProject } from "../lib/db";
import { toast } from "sonner";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { ZoomableView } from "../components/ZoomableView";
import { DownloadDiagramButton } from "../components/DownloadDiagramButton";
import { WebviewWindow } from "@tauri-apps/api/webviewWindow";

let debounceTimeout: number;

export default function UMLEditor() {
  const { umlId } = useParams();
  const navigate = useNavigate();
  const [umlCode, setUmlCode] = useState("");
  const [svgContent, setSvgContent] = useState("");
  const [projectName, setProjectName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [previewWindow, setPreviewWindow] = useState<WebviewWindow | null>(
    null
  );
  const maxEditorSize = 100;
  const [editorSize, setEditorSize] = useState(30);

  // Clean up preview window when component unmounts
  useEffect(() => {
    return () => {
      if (previewWindow) {
        setEditorSize(maxEditorSize);
        previewWindow.close();
      } else {
        setEditorSize(30);
      }
    };
  }, [previewWindow]);

  const openPreviewWindow = async () => {
    try {
      const webview = new WebviewWindow("preview", {
        url: "http://localhost:1420/preview",
        title: `Preview: ${projectName}`,
        width: 800,
        height: 600,
        center: true,
      });

      setPreviewWindow(webview);

      webview.once("tauri://created", function () {
        console.log("Preview window created successfully");
        // Send initial diagram data after window is created
        const encoded = encode(umlCode);
        setTimeout(() => {
          webview.emit("update-diagram", {
            diagram: encoded,
          });
        }, 1000);
      });

      webview.once("tauri://error", function (e) {
        console.error("Error creating preview window:", e);
      });

      webview.once("tauri://destroyed", function () {
        console.log("Preview window destroyed");
        setPreviewWindow(null);
      });
    } catch (error) {
      console.error("Error creating preview window:", error);
      toast.error("Failed to open preview window");
    }
  };

  const updatePreview = () => {
    if (!previewWindow || !svgContent) return;
    const encoded = encode(umlCode);
    previewWindow.emit("update-diagram", {
      diagram: encoded,
    });
  };

  // Update preview window whenever SVG content changes
  useEffect(() => {
    updatePreview();
  }, [svgContent, previewWindow]);

  useEffect(() => {
    if (!umlId) {
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

  async function handleNameSave() {
    if (!umlId) return;
    if (editedName === projectName) {
      setIsEditingName(false);
      return;
    }
    await updateProject(umlId, { name: editedName });
    setProjectName(editedName);
    setIsEditingName(false);
    toast.success("Project name updated!");
  }

  const handleInputClick = () => {
    setIsEditingName(true);
    setEditedName(projectName);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
      setEditedName(projectName);
      (e.target as HTMLInputElement).blur();
    }
  };

  const handleBlur = () => {
    handleNameSave();
  };

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
          `http://www.plantuml.com/plantuml/svg/${encoded}`
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

  return (
    <main
      className="min-h-screen bg-background"
      style={{ backgroundColor: "color(srgb 0.1582 0.1724 0.2053)" }}
    >
      <div className="mx-auto px-4">
        {/* Header */}

        {/* Editor */}
        <div>
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg py-4"
            style={{ height: "calc(100vh)" }}
          >
            <ResizablePanel defaultSize={editorSize}>
              <div className="h-full rounded-none border-0">
                <div className="flex items-center gap-4 pr-3">
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => navigate("/")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={isEditingName ? editedName : projectName}
                        readOnly={!isEditingName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        onBlur={handleBlur}
                        onClick={handleInputClick}
                        className="max-w-[300px] text-white bg-transparent border-none cursor-pointer hover:border-white focus:border-white"
                      />
                      <DownloadDiagramButton
                        umlCode={umlCode}
                        projectName={projectName}
                      />
                      <Button
                        variant="default"
                        size="icon"
                        onClick={openPreviewWindow}
                        disabled={!umlCode}
                        title="Open in new window"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <CodeMirror
                  value={umlCode}
                  height="100%"
                  onChange={(value) => setUmlCode(value)}
                  className="h-full"
                  theme="dark"
                  extensions={[plantUML()]}
                />
              </div>
            </ResizablePanel>

            <ResizableHandle className="invisible" />

            <ResizablePanel defaultSize={maxEditorSize - editorSize}>
              <Card
                className={`h-full rounded-lg border-0 ${
                  previewWindow ? "hidden" : ""
                }`}
              >
                <ZoomableView className="h-full">
                  <div
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                    className="max-w-full max-h-full"
                  />
                </ZoomableView>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </main>
  );
}
