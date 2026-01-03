import { formatMermaidCode } from '../monaco-theme';

/**
 * Register format action for Mermaid code
 * Adds Shift+Alt+F keyboard shortcut to format the code
 */
export function registerFormatAction(
  editor: any,
  monaco: any,
  onFormat: (formattedCode: string) => void
) {
  editor.addAction({
    id: 'format-mermaid',
    label: 'Format Mermaid Code',
    keybindings: [monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF],
    run: (ed: any) => {
      const currentContent = ed.getValue();
      const formatted = formatMermaidCode(currentContent);

      // Get current cursor position
      const position = ed.getPosition();

      // Update content
      ed.setValue(formatted);
      onFormat(formatted);

      // Restore cursor position (approximately)
      if (position) {
        ed.setPosition(position);
      }
    },
  });
}
