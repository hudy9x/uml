import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { plantUML } from "../../lib/codemirror/plantuml";
import { materialDark } from "@uiw/codemirror-theme-material";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";
import { lintGutter } from "@codemirror/lint";
import "../../styles/codemirror-lint.css";

interface UMLEditorPanelProps {
  umlCode: string;
  onChange: (value: string) => void;
  onErrorCountChange?: (count: number) => void;
}

export interface UMLEditorPanelRef {
  jumpToLine: (lineNumber: number) => void;
  deleteLine: (lineNumber: number) => void;
  replaceMessage: (lineNumber: number, newMessage: string) => void;
}

export const UMLEditorPanel = forwardRef<UMLEditorPanelRef, UMLEditorPanelProps>(
  ({ umlCode, onChange, onErrorCountChange }, ref) => {
    const { theme } = useTheme();
    const [editorTheme, setEditorTheme] = useState(githubLight);
    const editorRef = useRef<ReactCodeMirrorRef>(null);
    const [hasErrors, setHasErrors] = useState(false);

    useEffect(() => {
      setEditorTheme(theme === 'dark' ? materialDark : githubLight);
    }, [theme]);

    // Count errors in UML code whenever it changes
    useEffect(() => {
      if (!onErrorCountChange) return;

      // Simple error detection - count lines with empty messages after colon
      const lines = umlCode.split('\n');
      let errorCount = 0;

      const emptyMessageRegex = /^\s*(?:\d+\s+)?["\w\s]+?\s*<?-{1,2}>?\s*["\w\s]+?\s*:\s*$/;

      for (const line of lines) {
        if (emptyMessageRegex.test(line)) {
          errorCount++;
        }
      }

      setHasErrors(errorCount > 0);
      onErrorCountChange(errorCount);
    }, [umlCode, onErrorCountChange]);

    // Conditionally include lintGutter only when there are errors
    const extensions = useMemo(() => {
      const baseExtensions: any[] = [plantUML()];
      if (hasErrors) {
        baseExtensions.push(lintGutter());
      }
      return baseExtensions;
    }, [hasErrors]);

    // Expose jumpToLine, deleteLine, and replaceMessage methods to parent via ref
    useImperativeHandle(ref, () => ({
      jumpToLine: (lineNumber: number) => {
        const view = editorRef.current?.view;
        if (!view) return;

        try {
          // Get the line object for the target line number
          const line = view.state.doc.line(lineNumber);

          // Set cursor at the beginning of the line
          const pos = line.from;

          // Dispatch transaction to set selection and scroll into view
          // Using both x and y to ensure horizontal scrolling works
          view.dispatch({
            selection: EditorSelection.cursor(pos),
            effects: EditorView.scrollIntoView(pos, {
              y: 'center',
              x: 'start',
              yMargin: 50,
              xMargin: 50
            }),
          });

          // Focus the editor
          view.focus();
        } catch (error) {
          console.error(`Failed to jump to line ${lineNumber}:`, error);
        }
      },
      deleteLine: (lineNumber: number) => {
        const view = editorRef.current?.view;
        if (!view) return;

        try {
          // Get the line object for the target line number
          const line = view.state.doc.line(lineNumber);

          // Delete the entire line including the newline character
          view.dispatch({
            changes: {
              from: line.from,
              to: line.to + 1, // +1 to include the newline character
            },
          });

          // Focus the editor
          view.focus();
        } catch (error) {
          console.error(`Failed to delete line ${lineNumber}:`, error);
        }
      },
      replaceMessage: (lineNumber: number, newMessage: string) => {
        const view = editorRef.current?.view;
        if (!view) return;

        try {
          // Get the line object for the target line number
          const line = view.state.doc.line(lineNumber);
          const lineText = line.text;

          // Find the colon position to replace only the message part
          const colonIndex = lineText.indexOf(':');

          if (colonIndex === -1) {
            console.warn(`No colon found in line ${lineNumber}`);
            return;
          }

          // Calculate positions for replacement
          // Replace from after the colon to the end of the line
          const replaceFrom = line.from + colonIndex + 1;
          const replaceTo = line.to;

          // Dispatch transaction to replace the message part
          view.dispatch({
            changes: {
              from: replaceFrom,
              to: replaceTo,
              insert: ` ${newMessage}`,
            },
            selection: EditorSelection.cursor(replaceFrom + newMessage.length + 1),
          });

          // Focus the editor
          view.focus();
        } catch (error) {
          console.error(`Failed to replace message on line ${lineNumber}:`, error);
        }
      },
    }), []);

    return (
      <CodeMirror
        ref={editorRef}
        value={umlCode}
        height="calc(100% - 50px)"
        onChange={onChange}
        className="h-full"
        theme={editorTheme}
        extensions={extensions}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          searchKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
      />
    );
  }
);