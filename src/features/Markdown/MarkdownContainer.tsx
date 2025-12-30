import { MarkdownProvider } from './MarkdownContext';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownViewer } from './MarkdownViewer';
import { useEditorVisibility } from './MarkdownActions';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';

interface MarkdownContainerProps {
  content: string;
  filename?: string;
  filePath?: string | null;
}

export function MarkdownContainer({ content, filename = 'untitled.md', filePath = null }: MarkdownContainerProps) {
  const isEditorVisible = useEditorVisibility();

  return (
    <MarkdownProvider initialContent={content} filename={filename} filePath={filePath}>
      <div className="h-full w-full">
        {isEditorVisible ? (
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel
              defaultSize={50}
              minSize={20}
              className={isEditorVisible ? '' : 'hidden'}
            >
              <MarkdownEditor />
            </ResizablePanel>

            {isEditorVisible && <ResizableHandle withHandle />}

            <ResizablePanel defaultSize={50} minSize={20}>
              <MarkdownViewer />
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <MarkdownViewer />
        )}
      </div>
    </MarkdownProvider>
  );
}
