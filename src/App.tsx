import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { encode } from 'plantuml-encoder';
import { Card } from './components/ui/card';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable';

const DEFAULT_UML = `@startuml
class Car
Driver - Car : drives >
Car *- Wheel : has 4 >
Car -- Person : < owns
@enduml`;

function App() {
  const [umlCode, setUmlCode] = useState(DEFAULT_UML);
  const [svgUrl, setSvgUrl] = useState('');

  useEffect(() => {
    const encoded = encode(umlCode);
    setSvgUrl(`http://www.plantuml.com/plantuml/svg/${encoded}`);
  }, [umlCode]);

  return (
    <main className="h-screen w-screen p-4 bg-background">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border"
      >
        <ResizablePanel defaultSize={50}>
          <Card className="h-full rounded-none border-0">
            <CodeMirror
              value={umlCode}
              height="100%"
              onChange={(value) => setUmlCode(value)}
              className="h-full"
              theme="dark"
            />
          </Card>
        </ResizablePanel>
        
        <ResizableHandle />
        
        <ResizablePanel defaultSize={50}>
          <Card className="h-full rounded-none border-0 flex items-center justify-center p-4">
            <img 
              src={svgUrl}
              alt="UML Diagram"
              className="max-w-full max-h-full"
            />
          </Card>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

export default App;
