import { DiagramContainer } from '@/features/Diagram';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useFileOpener } from '@/hooks/useFileOpener';

const defaultDiagram = `sequenceDiagram
    Alice->>Bob: Hello Bob, how are you?
    alt is sick
        Bob->>Alice: Not so good :(
    else is well
        Bob->>Alice: Feeling fresh like a daisy
    end
    opt Extra response
        Bob->>Alice: Thanks for asking
    end
`;

export default function Home() {
  const [fileContent, setFileContent] = useState(defaultDiagram);
  const [filename, setFilename] = useState('untitled');

  // Use the existing useFileOpener hook
  const { filePath } = useFileOpener();

  // Load file content when filePath changes
  useEffect(() => {
    if (filePath) {
      loadFile(filePath);
    }
  }, [filePath]);

  const loadFile = async (path: string) => {
    try {
      const content = await invoke<string>('read_file_content', { path });
      const name = path.split('/').pop() || 'untitled';

      setFileContent(content);
      setFilename(name);

      console.log('File loaded:', path);
    } catch (error) {
      console.error('Failed to load file:', error);
    }
  };

  return (
    <main className="min-h-screen home-page flex flex-col">
      <div className="home-wrapper flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 29px - 33px)" }}>
        <div className="flex-1">
          <DiagramContainer
            content={fileContent}
            filename={filename}
            filePath={filePath}
          />
        </div>
      </div>
      <Footer />
    </main>
  );
}
