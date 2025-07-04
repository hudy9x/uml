import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { Button } from './ui/button';
import { encode } from "plantuml-encoder";


export function TestWindow() {
  let webview: WebviewWindow;

  const openWindow = async () => {
    try {
      webview = new WebviewWindow('test', {
        url: 'http://localhost:1420/test',
        title: 'Test Window',
        width: 800,
        height: 600,
        center: true,
      });

      

      webview.once('tauri://created', function () {
        console.log('Window created successfully');
      });

      webview.once('tauri://error', function (e) {
        console.error('Error creating window:', e);
      });

      webview.once('tauri://close', function () {
        console.log('Window closed');
      });

      webview.listen('tauri://destroyed', function () {
        console.log('Window destroyed');
      });

    } catch (error) {
      console.error('Error creating window:', error);
    }
  };

  const updateDiagram = () => {
    const encoded = encode('@startuml\nAlice -> Bob: Hello\n@enduml');

    webview.emit('update-diagram', {
      diagram: encoded,
    });
  }

  return (
    <div>
      <Button onClick={openWindow}>Open Test Window</Button>
      <Button onClick={updateDiagram}>Update url</Button>
    </div>
  );
}
