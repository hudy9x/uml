import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Settings2Icon } from "lucide-react";

const LS_KEY_DARK = "previewUrlDark";
const LS_KEY_LIGHT = "previewUrlLight";

export function PreviewUrlDialog() {
  const [darkUrl, setDarkUrl] = React.useState<string>("");
  const [lightUrl, setLightUrl] = React.useState<string>("");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const d = localStorage.getItem(LS_KEY_DARK) ?? "";
      const l = localStorage.getItem(LS_KEY_LIGHT) ?? "";
      setDarkUrl(d);
      setLightUrl(l);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("PreviewUrlDialog: failed to read preview urls from localStorage", e);
    }
  }, []);

  const save = () => {
    if (typeof window === "undefined") return;
    const d = darkUrl.trim();
    const l = lightUrl.trim();
    try {
      if (d === "") localStorage.removeItem(LS_KEY_DARK);
      else localStorage.setItem(LS_KEY_DARK, d);

      if (l === "") localStorage.removeItem(LS_KEY_LIGHT);
      else localStorage.setItem(LS_KEY_LIGHT, l);

      // notify others in same window (storage event doesn't fire in same window)
      window.dispatchEvent(new Event("previewUrlChange"));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("PreviewUrlDialog: failed to save preview urls", e);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {/* <Button variant="outline" size="sm">Preview URLs</Button> */}
        <div
          className="flex cursor-pointer items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded"
        >
          <Settings2Icon size={10}/>
          Setting
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom preview URLs</DialogTitle>
          <DialogDescription>Set a custom PlantUML preview endpoint for dark and light modes. Leave empty to use the default.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label className="text-xs">Dark mode URL</label>
          <Input value={darkUrl} onChange={(e) => setDarkUrl(e.target.value)} placeholder="https://example.com/plantuml/d" />

          <label className="text-xs">Light mode URL</label>
          <Input value={lightUrl} onChange={(e) => setLightUrl(e.target.value)} placeholder="https://example.com/plantuml/" />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" size="sm">Cancel</Button>
          </DialogClose>

          <DialogClose asChild>
            <Button size="sm" onClick={save}>Save</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
