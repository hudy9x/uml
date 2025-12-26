import { DiagramContainer } from '@/features/Diagram';
import { Footer } from '@/components/Footer';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useLocation } from 'react-router-dom';

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

export default function FileEditor() {
  const [fileContent, setFileContent] = useState(defaultDiagram);
  const [filename, setFilename] = useState('untitled');
  const location = useLocation();
  const filePath = (location.state as { filePath?: string })?.filePath || null;

  console.log("file editor path:", filePath)

  // Load file content when component mounts with filePath
  useEffect(() => {
    if (filePath) {
      console.log('[FileEditor] Loading file:', filePath);
      loadFile(filePath);
    }
  }, [filePath]);

  const loadFile = async (path: string) => {
    try {
      const content = await invoke<string>('read_file_content', { path });

      console.log("file content:", content)
      const name = path.split('/').pop() || 'untitled';

      setFileContent(content);
      setFilename(name);

      console.log('[FileEditor] ✅ File loaded:', name);
    } catch (error) {
      console.error('[FileEditor] ❌ Failed to load file:', error);
      alert(`Failed to load file:\n${error}`);
    }
  };

  console.log('File Editor render', fileContent)

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
