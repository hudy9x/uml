import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { plantUML } from "../lib/codemirror/plantuml";
import { materialDark } from "@uiw/codemirror-theme-material";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import { EditorView } from "@codemirror/view";
import { EditorSelection } from "@codemirror/state";

interface UMLEditorPanelProps {
  umlCode: string;
  onChange: (value: string) => void;
}

export interface UMLEditorPanelRef {
  jumpToLine: (lineNumber: number) => void;
}

export const UMLEditorPanel = forwardRef<UMLEditorPanelRef, UMLEditorPanelProps>(
  ({ umlCode, onChange }, ref) => {
    const { theme } = useTheme();
    const [editorTheme, setEditorTheme] = useState(githubLight);
    const editorRef = useRef<ReactCodeMirrorRef>(null);

    useEffect(() => {
      setEditorTheme(theme === 'dark' ? materialDark : githubLight);
    }, [theme]);

    // Expose jumpToLine method to parent via ref
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
    }), []);

    return (
      <CodeMirror
        ref={editorRef}
        value={umlCode}
        height="calc(100% - 50px)"
        onChange={onChange}
        className="h-full"
        theme={editorTheme}
        extensions={[plantUML()]}
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