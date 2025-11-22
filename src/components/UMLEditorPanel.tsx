import CodeMirror from "@uiw/react-codemirror";
import { plantUML } from "../lib/codemirror/plantuml";
import { materialDark } from "@uiw/codemirror-theme-material";
import { githubLight } from "@uiw/codemirror-theme-github";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface UMLEditorPanelProps {
  umlCode: string;
  onChange: (value: string) => void;
}

export function UMLEditorPanel({ umlCode, onChange }: UMLEditorPanelProps) {
  const { theme } = useTheme();
  const [editorTheme, setEditorTheme] = useState(githubLight);

  useEffect(() => {
    setEditorTheme(theme === 'dark' ? materialDark : githubLight);
  }, [theme]);

  return (
    <CodeMirror
      value={umlCode}
      height="calc(100% - 50px)"
      onChange={onChange}
      className="h-full"
      theme={editorTheme}
      extensions={[plantUML()]}
    />
  );
} 