import { clearRecentItems } from '@/lib/recentItems';
import { BackButton } from '@/components/BackButton';
import { ReactNode } from 'react';
import { FileText } from 'lucide-react';

interface EditorHeaderProps {
  filename?: string;
  children?: ReactNode;
}

export function EditorHeader({ filename, children }: EditorHeaderProps) {
  const handleBackClick = () => {
    // Clear recent items cache to prevent auto-redirect
    clearRecentItems();
    console.log('[EditorHeader] ✅ Recent items cleared');
  };

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-3 gap-2" style={{ height: '40px' }}>
      <div className="flex items-center gap-2">
        <BackButton
          to="/welcome"
          onClick={handleBackClick}
          tooltip="Back to Welcome"
        />
        {filename ? (
          <>
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{filename}</span>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Editor
          </div>
        )}
      </div>

      {/* Right: Actions */}
      {children && (
        <div className="flex items-center gap-2">
          {children}
        </div>
      )}
    </div>
  );
}
