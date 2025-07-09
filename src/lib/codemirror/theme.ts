import { materialDark } from "@uiw/codemirror-theme-material";
import { githubLight } from "@uiw/codemirror-theme-github";

export const themes = {
  dark: materialDark,
  light: githubLight,
}

export const getTheme = (theme: string) => {
  return themes[theme as keyof typeof themes];
}