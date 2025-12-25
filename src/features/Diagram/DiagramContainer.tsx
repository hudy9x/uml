import { DiagramProvider } from './DiagramContext';
import { DiagramEditor } from './DiagramEditor';
import { DiagramViewer } from './DiagramViewer';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface DiagramContainerProps {
  content: string;
}

export function DiagramContainer({ content }: DiagramContainerProps) {
  return (
    <DiagramProvider initialContent={content}>
      <div className="h-full w-full">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={30}>
            <DiagramEditor />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={30}>
            <DiagramViewer />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </DiagramProvider>
  );
}
