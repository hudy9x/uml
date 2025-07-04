import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { save } from "@tauri-apps/plugin-dialog";
import { writeFile } from "@tauri-apps/plugin-fs";
import { toast } from 'sonner';
import { encode } from 'plantuml-encoder';

interface DownloadDiagramButtonProps {
  umlCode: string;
  projectName: string;
}

export function DownloadDiagramButton({ umlCode, projectName }: DownloadDiagramButtonProps) {
  const handleDownload = async () => {
    if (!umlCode) {
      toast.error('No diagram to download');
      return;
    }

    try {
      const encoded = encode(umlCode);
      const res = await fetch(`http://www.plantuml.com/plantuml/img/${encoded}`);
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

  return (
    <Button
      variant="default"
      size="icon"
      onClick={handleDownload}
      title="Download as PNG"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
} 