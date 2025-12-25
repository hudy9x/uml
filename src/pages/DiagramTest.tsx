import { DiagramContainer } from '@/features/Diagram';

const defaultMermaidContent = `graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`;

export default function DiagramTest() {
  return (
    <div className="h-screen w-full p-4">
      <div className="h-full w-full border rounded-lg overflow-hidden">
        <DiagramContainer content={defaultMermaidContent} />
      </div>
    </div>
  );
}
