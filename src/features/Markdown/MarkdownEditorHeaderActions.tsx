import { SavingIndicator } from './SavingIndicator';
import { MarkdownActions } from './MarkdownActions';

export function MarkdownEditorHeaderActions() {
  return (
    <>
      <SavingIndicator />
      <MarkdownActions />
    </>
  );
}
