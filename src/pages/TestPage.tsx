import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { useEffect, useState } from "react";


export default function TestPage() {
    const [diagram, setDiagram] = useState('');
    useEffect(() => {
        const w = getCurrentWebviewWindow();


        w.listen('update-diagram', (event) => {
            console.log('event', event.payload)
        });

    }, []);
    return (
        <div className="h-screen w-screen bg-red-500">
            <h1>Test Page</h1>
            <img src={`http://www.plantuml.com/plantuml/svg/${diagram}`} />
        </div>
    );
}