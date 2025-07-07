import CodeMirror from "@uiw/react-codemirror";
import { plantUML } from "../lib/codemirror/plantuml";
import { materialLight, materialDark } from "@uiw/codemirror-theme-material";

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
      theme={materialDark}
      extensions={[plantUML()]}
    />
  );
} 