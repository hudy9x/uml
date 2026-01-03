import { invoke } from '@tauri-apps/api/core';
import { useEffect, useState } from 'react';
import { FileText, Folder, ChevronRight } from 'lucide-react';

interface FileEntry {
  name: string;
  path: string;
  is_dir: boolean;
  children?: FileEntry[] | null;
}

interface FileExplorerProps {
  folderPath: string;
}

export function FileExplorer({ folderPath }: FileExplorerProps) {
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDirectory(folderPath);
  }, [folderPath]);

  const loadDirectory = async (path: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await invoke<FileEntry[]>('list_dir', { path });
      setEntries(result);
    } catch (err) {
      console.error('[FileExplorer] Error loading directory:', err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading files...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-destructive">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="h-full bg-secondary border-r border-border overflow-y-auto">
      <div className="flex items-center px-3 border-b border-border" style={{ height: '40px' }}>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Explorer
        </h2>
      </div>

      <div className="p-2">
        {entries.length === 0 ? (
          <div className="p-4 text-sm text-muted-foreground text-center">
            No files found
          </div>
        ) : (
          <div className="space-y-1">
            {entries.map((entry) => (
              <div
                key={entry.path}
                className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-accent cursor-pointer group"
              >
                {entry.is_dir ? (
                  <>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <Folder className="w-4 h-4 text-primary flex-shrink-0" />
                  </>
                ) : (
                  <>
                    <div className="w-4" /> {/* Spacer for alignment */}
                    <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </>
                )}
                <span className="text-sm text-foreground group-hover:text-accent-foreground truncate">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
