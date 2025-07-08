import { getCurrentWindow } from "@tauri-apps/api/window";
import { Button } from "./ui/button";
import { Minus, Square, X } from "lucide-react";

export function TitleBar() {
  const window = getCurrentWindow();
  
  return (
    <div className="h-8 title-bar border-b border-[var(--border)] flex items-center justify-between">
      <div data-tauri-drag-region className="flex-1 h-full" />
      <div className="flex">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none hover:bg-[var(--muted)]"
          onClick={() => window.minimize()}
        >
          <Minus className="h-4 w-4 text-[var(--foreground)]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none hover:bg-[var(--muted)]"
          onClick={() => window.toggleMaximize()}
        >
          <Square className="h-3 w-3 text-[var(--foreground)]" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none hover:bg-[var(--muted)]"
          onClick={() => window.close()}
        >
          <X className="h-4 w-4 text-[var(--foreground)]" />
        </Button>
      </div>
    </div>
  );
} 