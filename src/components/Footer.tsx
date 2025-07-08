import { VersionDisplay } from "./VersionDisplay";
import { Button } from "./ui/button";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="flex items-center justify-between px-2 py-1 gap-2 border-t border-[var(--color-border)]">
      <VersionDisplay />
      <a
        href="https://github.com/hudy9x/uml"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded"
      >
        <Github className="h-3 w-3" />
        Star on GitHub
      </a>
    </footer>
  );
} 