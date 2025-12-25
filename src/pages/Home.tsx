import { DiagramContainer } from '@/features/Diagram';
import { Footer } from '@/components/Footer';

const defaultDiagram = `sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end
`;

export default function Home() {
  return (
    <main className="min-h-screen home-page flex flex-col">
      <div className="home-wrapper flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 29px - 33px)" }}>
        <div className="flex-1">
          <DiagramContainer content={defaultDiagram} />
        </div>
      </div>
      <Footer />
    </main>
  );
}
