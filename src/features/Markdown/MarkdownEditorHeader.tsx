import { FileText } from 'lucide-react';
import { useMarkdownContent } from './MarkdownContext';

export function MarkdownEditorHeader() {
  const { filename } = useMarkdownContent();

  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/30">
      <FileText className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-foreground">{filename}</span>
    </div>
  );
}
