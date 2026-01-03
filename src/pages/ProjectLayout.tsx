import { useParams } from 'react-router-dom';
import { DiagramContainer } from '@/features/Diagram';
import { FileExplorer } from '@/containers/Explorer/FileExplorer';
import { Footer } from '@/components/Footer';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

const defaultDiagram = `sequenceDiagram
`;

export default function ProjectLayout() {
  const { folderPath } = useParams<{ folderPath: string }>();
  const decodedPath = folderPath ? decodeURIComponent(folderPath) : '';

  return (
    <main className="relative w-full h-screen overflow-hidden">
      {/* Main Content Area - Absolute positioning above footer */}
      <div
        className="absolute top-0 left-0 right-0 overflow-hidden"
        style={{
          bottom: '33px'  // Height of Footer
        }}
      >
        <ResizablePanelGroup direction="horizontal" className='h-full'>
          <ResizablePanel defaultSize={20} minSize={15} maxSize={40}>
            <FileExplorer folderPath={decodedPath} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={80} minSize={60}>
            <DiagramContainer
              content={defaultDiagram}
              filename="untitled"
              filePath={null}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      {/* Fixed Footer at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </main>
  );
}
