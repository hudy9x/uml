import { ZoomableView } from "@/components/ZoomableView";
import { useBackground } from "@/hooks/useBackground";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";

export default function TestPage() {
  const [diagram, setDiagram] = useState("");
  const { previewBackground, previewUrl } = useBackground();
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
    <div className="h-screen w-screen" style={{ backgroundColor: previewBackground }}>
      <ZoomableView className="h-full">
        <img src={`${previewUrl}/svg/${diagram}`} />
      </ZoomableView>
    </div>
  );
}
