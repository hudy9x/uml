import { DiagramProvider } from './DiagramContext';
import { DiagramEditor } from './DiagramEditor';
import { DiagramViewer } from './DiagramViewer';
import { useEditorVisibility } from './DiagramActions';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface DiagramContainerProps {
  content: string;
  filename?: string;
  filePath?: string | null;
}

export function DiagramContainer({ content, filename = 'untitled', filePath = null }: DiagramContainerProps) {
  const isEditorVisible = useEditorVisibility();

  return (
    <DiagramProvider initialContent={content} filename={filename} filePath={filePath}>
      <div className="h-full w-full">
        {isEditorVisible ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={30}
              minSize={30}
              className={isEditorVisible ? '' : 'hidden'}
            >
              <DiagramEditor />
            </ResizablePanel>

            {isEditorVisible && <ResizableHandle withHandle />}

            <ResizablePanel defaultSize={70} minSize={30}>
              <DiagramViewer />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <DiagramViewer />
        )}
      </div>
    </DiagramProvider>
  );
}
