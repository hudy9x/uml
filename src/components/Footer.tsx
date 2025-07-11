import { VersionDisplay } from "./VersionDisplay";
import { Github } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "./ui/switch";
import { DeletedProjectsDialog } from "./DeletedProjectsDialog";

export function Footer() {
  const { setTheme, theme } = useTheme();

  return (
    <footer className="flex items-center justify-between px-2 py-1 gap-2 border-t border-[var(--color-border)] relative">
      <div className="flex items-center gap-4">
        <VersionDisplay />
        <DeletedProjectsDialog />
      </div>

      <div className="flex items-center gap-4">
        <a
          href="https://github.com/hudy9x/uml"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded"
        >
          <Github className="h-3 w-3" />
          Star on GitHub
        </a>
        <div className="flex items-center space-x-2">
          <Switch
            checked={theme === "dark"}
            id="theme-toggle"
            className="cursor-pointer"
            onCheckedChange={() =>
              setTheme((theme) => (theme === "dark" ? "light" : "dark"))
            }
          />
          <label className="text-xs cursor-pointer" htmlFor="theme-toggle">{theme === "dark" ? "Dark" : "Light"}</label>
        </div>
      </div>
    </footer>
  );
}
