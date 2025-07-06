import { Button } from "./ui/button";
import { ExternalLink, FileDown, Download, MoreVertical, Clipboard } from "lucide-react";
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { writeImage } from '@tauri-apps/plugin-clipboard-manager';
import { toast } from "sonner";
import { encode } from 'plantuml-encoder';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Image as TauriImage } from "@tauri-apps/api/image";

interface ExportActionsDropdownProps {
  umlCode: string;
  projectName: string;
  onOpenPreview: () => void;
}

export function DiagramActionsDropdown({ 
  umlCode, 
  projectName,
  onOpenPreview 
}: ExportActionsDropdownProps) {
  const handleDownloadPNG = async () => {
    if (!umlCode) {
      toast.error('No diagram to download');
      return;
    }

    try {
      const encoded = encode(umlCode);
      const res = await fetch(`https://www.plantuml.com/plantuml/img/${encoded}`);
      const imageBlob = await res.blob();
      const imageData = await imageBlob.arrayBuffer();
      const uint8Array = new Uint8Array(imageData);
      
      const filePath = await save({
        defaultPath: `${projectName || 'diagram'}.png`,
        filters: [{
          name: 'Image',
          extensions: ['png']
        }]
      });

      if (filePath) {
        await writeFile(filePath, uint8Array);
        toast.success('Diagram downloaded successfully!');
      }
    } catch (error) {
      console.error('Error downloading diagram:', error);
      toast.error('Failed to download diagram');
    }
  };

  const handleSaveUMLCode = async () => {
    if (!umlCode) {
      toast.error('No UML code to save');
      return;
    }

    try {
      const filePath = await save({
        defaultPath: `${projectName || 'diagram'}.pu`,
        filters: [{
          name: 'PlantUML',
          extensions: ['pu']
        }]
      });

      if (filePath) {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(umlCode);
        await writeFile(filePath, uint8Array);
        toast.success('UML code saved successfully!');
      }
    } catch (error) {
      console.error('Error saving UML code:', error);
      toast.error('Failed to save UML code');
    }
  };

  const handleCopyToClipboard = async () => {
    if (!umlCode) {
      toast.error('No diagram to copy');
      return;
    }

    try {
      const encoded = encode(umlCode);
      const res = await fetch(`https://www.plantuml.com/plantuml/img/${encoded}`);
      const imageBlob = await res.blob();
      const imageData = await imageBlob.arrayBuffer();
      const uint8Array = new Uint8Array(imageData);

      const image = await TauriImage.fromBytes(uint8Array);
      await writeImage(image);
      
      toast.success('Diagram copied to clipboard!');
    } catch (error) {
      console.error('Error copying diagram to clipboard:', error);
      toast.error('Failed to copy diagram to clipboard');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button 
          variant="default" 
          size="icon" 
          className="focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuItem className="cursor-pointer" onClick={handleDownloadPNG}>
          <Download className="h-4 w-4 mr-2" />
          Download as PNG
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleSaveUMLCode}>
          <FileDown className="h-4 w-4 mr-2" />
          Save as PlantUML
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={handleCopyToClipboard}>
          <Clipboard className="h-4 w-4 mr-2" />
          Copy as Image
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={onOpenPreview}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in new window
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 