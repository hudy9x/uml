import { DiagramContainer } from '@/features/Diagram';
import { MarkdownContainer } from '@/features/Markdown';
import { Footer } from '@/components/Footer';
import { EditorHeader } from '@/components/EditorHeader';
import { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useLocation } from 'react-router-dom';
import { detectFileType, FileType } from '@/utils/fileTypes';

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
  const [fileType, setFileType] = useState<FileType>(FileType.DIAGRAM);
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
      const detectedType = detectFileType(name);

      setFileContent(content);
      setFilename(name);
      setFileType(detectedType);

      console.log('[FileEditor] ✅ File loaded:', name, 'Type:', detectedType);
    } catch (error) {
      console.error('[FileEditor] ❌ Failed to load file:', error);
      alert(`Failed to load file:\n${error}`);
    }
  };

  console.log('File Editor render', fileContent, 'Type:', fileType)

  // Render appropriate viewer based on file type
  const renderViewer = () => {
    switch (fileType) {
      case FileType.DIAGRAM:
        return (
          <DiagramContainer
            content={fileContent}
            filename={filename}
            filePath={filePath}
          />
        );

      case FileType.MARKDOWN:
        return (
          <MarkdownContainer
            content={fileContent}
            filename={filename}
            filePath={filePath}
          />
        );

      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p className="text-lg font-semibold">Unsupported File Type</p>
              <p className="text-sm mt-2">This file type is not supported yet.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <main id="home-page" className="relative w-full h-screen overflow-hidden">
      {/* Fixed Header at Top */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <EditorHeader />
      </div>

      {/* Main Content Area - Absolute positioning between header and footer */}
      <div
        className="absolute left-0 right-0 overflow-hidden"
        style={{
          top: '40px',  // Height of EditorHeader
          bottom: '33px'  // Height of Footer
        }}
      >
        <div className="w-full h-full">
          {renderViewer()}
        </div>
      </div>

      {/* Fixed Footer at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </main>
  );
}

