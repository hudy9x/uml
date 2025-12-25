import { DiagramContainer } from '@/features/Diagram';

const defaultDiagram = `graph TD
    Start[🚀 Start] --> Plan[📋 Plan]
    Plan --> Design[🎨 Design]
    Design --> Code[💻 Code]
    Code --> Test{✅ Test}
    Test -->|Pass| Deploy[🚀 Deploy]
    Test -->|Fail| Debug[🐛 Debug]
    Debug --> Code
    Deploy --> Monitor[📊 Monitor]
    Monitor --> End[🎉 End]
    
    style Start fill:#4ade80
    style End fill:#4ade80
    style Deploy fill:#60a5fa
    style Debug fill:#f87171`;

export default function Home() {
  return (
    <main className="min-h-screen home-page">
      <div className="home-wrapper flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 29px)" }}>
        <div className="flex-1">
          <DiagramContainer content={defaultDiagram} />
        </div>
      </div>
    </main>
  );
}
