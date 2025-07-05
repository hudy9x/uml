import { ZoomableView } from "@/components/ZoomableView";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [diagram, setDiagram] = useState("");
  useEffect(() => {
    const w = getCurrentWebviewWindow();

    console.log("w", w);
    w.listen("update-diagram", (event) => {
      console.log("event", event);
      const { diagram } = event.payload as { diagram: string };
      setDiagram(diagram);
    });
  }, []);
  return (
    <div className="h-screen w-screen bg-white">
      <ZoomableView className="h-full">
        <img src={`https://www.plantuml.com/plantuml/svg/${diagram}`} />
      </ZoomableView>
    </div>
  );
}
