import { useParams } from 'react-router-dom';
import { DiagramContainer } from '@/features/Diagram';
import { FileExplorer } from '@/features/Explorer/FileExplorer';
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
    <main className="min-h-screen flex flex-col">
      <div className="flex-1 overflow-hidden" style={{ height: "calc(100vh - 29px - 33px)" }}>
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
      <Footer />
    </main>
  );
}
