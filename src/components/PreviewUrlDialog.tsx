import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Settings2Icon } from "lucide-react";
import { usePlantUMLServerStore } from "@/stores/plantumlServer";

export function PreviewUrlDialog() {
  const store = usePlantUMLServerStore();
  const [localUrl, setLocalUrl] = React.useState(store.serverUrl);

  React.useEffect(() => {
    setLocalUrl(store.serverUrl);
  }, [store.serverUrl]);

  const save = () => {
    const trimmedUrl = localUrl.trim();
    store.setServerUrl(trimmedUrl || "http://localhost:8080/plantuml");

    // Notify that URL has changed
    window.dispatchEvent(new Event("plantumlServerUrlChange"));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex cursor-pointer items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded"
        >
          <Settings2Icon size={10} />
          Setting
        </div>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>PlantUML Server Configuration</DialogTitle>
          <DialogDescription>
            Configure the PlantUML server URL. The default local server is http://localhost:8080/plantuml
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2">
          <label className="text-xs font-medium">PlantUML Server URL</label>
          <Input
            value={localUrl}
            onChange={(e) => setLocalUrl(e.target.value)}
            placeholder="http://localhost:8080/plantuml"
          />
          <p className="text-xs text-muted-foreground">
            You can use a local server or a remote PlantUML service
          </p>
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
