import { DiagramContainer } from '@/features/Diagram';

const flowchartContent = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

const sequenceContent = `sequenceDiagram
    Alice->>Bob: Hello Bob!
    Bob->>Alice: Hi Alice!
    Alice->>Bob: How are you?
    Bob->>Alice: I'm good, thanks!`;

const classContent = `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    class Duck{
        +String beakColor
        +swim()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }`;

export default function MultiDiagramTest() {
  return (
    <div className="h-screen w-full p-4 space-y-4 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">Multiple Diagram Containers Test</h1>

      <div className="h-[400px] border rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-2 bg-muted">Container 1: Flowchart</h2>
        <div className="h-[calc(100%-40px)]">
          <DiagramContainer content={flowchartContent} />
        </div>
      </div>

      <div className="h-[400px] border rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-2 bg-muted">Container 2: Sequence Diagram</h2>
        <div className="h-[calc(100%-40px)]">
          <DiagramContainer content={sequenceContent} />
        </div>
      </div>

      <div className="h-[400px] border rounded-lg overflow-hidden">
        <h2 className="text-lg font-semibold p-2 bg-muted">Container 3: Class Diagram</h2>
        <div className="h-[calc(100%-40px)]">
          <DiagramContainer content={classContent} />
        </div>
      </div>
    </div>
  );
}
