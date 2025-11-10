import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CategoriesSectionDnd from "@/features/Category/CategoriesSectionDnd";
import DiagramCreate from "@/features/Diagram/DiagramCreate";

const SIDEBAR_KEY = "uml.sidebar.open";

export default function Sidebar(): JSX.Element {
  const [open, setOpen] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem(SIDEBAR_KEY);
      return v === null ? true : v === "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(SIDEBAR_KEY, String(open));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Failed to persist sidebar state", e);
    }
  }, [open]);

  return (
    <aside
      className={`py-2 relative grow-0 shrink-0 ${open ? "w-[200px] border-r border-foreground/10" : "w-10 border-r border-foreground/10"
        }`}
    >
      {open ? (
        <div className="px-3 flex items-center gap-2">
          <DiagramCreate />
          <Button
            variant="outline"
            size="icon"
            aria-label="Collapse sidebar"
            onClick={() => setOpen(false)}
          >
            ‹
          </Button>
        </div>
      ) : (
        <div className="px-2 flex items-center justify-end">
          <Button variant="outline" size="icon" aria-label="Open sidebar" onClick={() => setOpen(true)}>
            ›
          </Button>
        </div>
      )}

      {open && (
        <div className="overflow-x-hidden overflow-y-auto h-[calc(100vh-100px)] px-3">
          <CategoriesSectionDnd />
        </div>
      )}
    </aside>
  );
}
