import CodeMirror from "@uiw/react-codemirror";
import { plantUML } from "../lib/codemirror/plantuml";
import { materialLight, materialDark, defaultSettingsMaterialDark } from "@uiw/codemirror-theme-material";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useState } from "react";

interface UMLEditorPanelProps {
  umlCode: string;
  onChange: (value: string) => void;
}

export function UMLEditorPanel({ umlCode, onChange }: UMLEditorPanelProps) {
  console.log('materialDark', defaultSettingsMaterialDark)
  const [theme, setTheme] = useState(githubLight)
  
  return (
    <CodeMirror
      value={umlCode}
      height="100%"
      onChange={onChange}
      className="h-full"
      style={{
        backgroundColor: defaultSettingsMaterialDark.background || 'white'
      }}
      theme={theme}
      extensions={[plantUML()]}
    />
  );
} 