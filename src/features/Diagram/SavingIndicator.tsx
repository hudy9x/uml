import { Loader2 } from 'lucide-react';
import { useSavingState } from './DiagramContext';

export function SavingIndicator() {
  const { isSaving } = useSavingState();

  if (!isSaving) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Loader2 className="h-3 w-3 animate-spin" />
      <span>Saving...</span>
    </div>
  );
}
