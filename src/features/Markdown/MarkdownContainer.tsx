import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownViewer } from './MarkdownViewer';
import { useEditorMode } from './MarkdownActions';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';

export function MarkdownContainer() {
  const mode = useEditorMode();

  return (
    <div className="h-full w-full">
      {mode === 'preview' && (
        <MarkdownViewer />
      )}

      {mode === 'split' && (
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={20}>
            <ScrollArea>
              <MarkdownEditor />
            </ScrollArea>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={50} minSize={20}>
            <MarkdownViewer />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}

      {mode === 'code' && (
        <MarkdownEditor />
      )}
    </div>
  );
}
