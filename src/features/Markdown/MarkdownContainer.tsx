import { MarkdownProvider } from './MarkdownContext';
import { MarkdownViewer } from './MarkdownViewer';

interface MarkdownContainerProps {
  content: string;
  filePath?: string | null;
}

export function MarkdownContainer({ content, filePath }: MarkdownContainerProps) {
  return (
    <MarkdownProvider initialContent={content} filePath={filePath}>
      <div className="h-full w-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          <MarkdownViewer />
        </div>
      </div>
    </MarkdownProvider>
  );
}
