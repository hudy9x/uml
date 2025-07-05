import CodeMirror from "@uiw/react-codemirror";
import { plantUML } from "../lib/codemirror/plantuml";

interface UMLEditorPanelProps {
  umlCode: string;
  onChange: (value: string) => void;
}

export function UMLEditorPanel({ umlCode, onChange }: UMLEditorPanelProps) {
  return (
    <CodeMirror
      value={umlCode}
      height="100%"
      onChange={onChange}
      className="h-full"
      theme="dark"
      extensions={[plantUML()]}
    />
  );
} 