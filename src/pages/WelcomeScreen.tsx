import { invoke } from '@tauri-apps/api/core';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderOpen, FileText } from 'lucide-react';
import { RecentItems } from '@/components/RecentItems';
import { addRecentItem } from '@/lib/recentItems';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  const handleOpenFile = async () => {
    try {
      const filePath = await invoke<string | null>('open_file_dialog');
      if (filePath) {
        console.log('[WelcomeScreen] Selected file:', filePath);

        // Extract filename from path
        const filename = filePath.split('/').pop() || 'untitled';

        // Save to recent items
        addRecentItem(filePath, filename, 'file');

        navigate('/file', { state: { filePath } });
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error opening file:', error);
    }
  };

  const handleOpenFolder = async () => {
    try {
      const folderPath = await invoke<string | null>('open_folder_dialog');
      if (folderPath) {
        console.log('[WelcomeScreen] Selected folder:', folderPath);

        // Extract folder name from path
        const folderName = folderPath.split('/').pop() || 'untitled';

        // Save to recent items
        addRecentItem(folderPath, folderName, 'folder');

        // Encode the folder path for URL
        const encodedPath = encodeURIComponent(folderPath);
        navigate(`/project/${encodedPath}`);
      }
    } catch (error) {
      console.error('[WelcomeScreen] Error opening folder:', error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-xl px-8">
        {/* Logo and Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-2xl bg-primary shadow-lg">
            <svg
              className="w-12 h-12 text-primary-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">UML Editor</h1>
          <p className="text-muted-foreground">Create beautiful diagrams with ease</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleOpenFolder}
              className="h-12"
            >
              <FolderOpen className="w-5 h-5 mr-2" />
              Open Folder
            </Button>

            <Button
              onClick={handleOpenFile}
              variant="outline"
              className="h-12"
            >
              <FileText className="w-4 h-4 mr-2" />
              Open File
            </Button>
          </div>
        </div>

        {/* Recent Items */}
        <RecentItems />

      </div>
    </main>
  );
}
