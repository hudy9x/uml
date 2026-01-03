import { Loader2 } from 'lucide-react';
import { useSavingState } from './MarkdownContext';

export function SavingIndicator() {
  const { isSaving } = useSavingState();

  if (!isSaving) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border text-xs text-muted-foreground">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>Saving...</span>
    </div>
  );
}
