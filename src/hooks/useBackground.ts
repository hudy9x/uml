import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { defaultSettingsMaterialDark } from "@uiw/codemirror-theme-material";

const DEFAULT_PREVIEW_DARK = "https://www.plantuml.com/plantuml/d";
const DEFAULT_PREVIEW_LIGHT = "https://www.plantuml.com/plantuml/";
const LS_KEY_DARK = "previewUrlDark";
const LS_KEY_LIGHT = "previewUrlLight";

export function useBackground(): {
  previewUrl: string;
  editorBackground: string;
  previewBackground: string;
  isDarkBackground: boolean;
} {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [userPreviewUrlDark, setUserPreviewUrlDark] = useState<string | null>(null);
  const [userPreviewUrlLight, setUserPreviewUrlLight] = useState<string | null>(null);

  const readFromStorage = () => {
    if (typeof window === "undefined") return;
    try {
      setUserPreviewUrlDark(localStorage.getItem(LS_KEY_DARK));
      setUserPreviewUrlLight(localStorage.getItem(LS_KEY_LIGHT));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("useBackground: failed to read preview urls from localStorage", e);
    }
  };

  useEffect(() => {
    readFromStorage();

    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY_DARK || e.key === LS_KEY_LIGHT) readFromStorage();
    };

    const onCustom = () => readFromStorage();

    window.addEventListener("storage", onStorage);
    window.addEventListener("previewUrlChange", onCustom as EventListener);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("previewUrlChange", onCustom as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // re-read when theme changes to ensure previewUrl picks correct value
    readFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  const previewUrl = isDark
    ? userPreviewUrlDark ?? DEFAULT_PREVIEW_DARK
    : userPreviewUrlLight ?? DEFAULT_PREVIEW_LIGHT;

  return {
    previewUrl,
    editorBackground: isDark ? (defaultSettingsMaterialDark.background ?? "white") : "white",
    previewBackground: isDark ? "#27272b" : "white",
    isDarkBackground: isDark,
  };
}
