import { SavingIndicator } from './SavingIndicator';
import { DiagramActions } from './DiagramActions';

export function DiagramEditorHeaderActions() {
  return (
    <>
      <SavingIndicator />
      <DiagramActions />
    </>
  );
}
