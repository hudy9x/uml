import { useTheme } from "next-themes";
import { defaultSettingsMaterialDark } from "@uiw/codemirror-theme-material";

export function useBackground() {
  const { theme } = useTheme();
  return {
    previewUrl: theme === 'dark' ? 'https://www.plantuml.com/plantuml/d' : 'https://www.plantuml.com/plantuml/',
    editorBackground: theme === 'dark' ? defaultSettingsMaterialDark.background : 'white',
    previewBackground: theme === 'dark' ? '#1c1c1c' : 'white',
  }
}