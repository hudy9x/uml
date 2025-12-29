import { clearRecentItems } from '@/lib/recentItems';
import { BackButton } from '@/components/BackButton';

export function EditorHeader() {
  const handleBackClick = () => {
    // Clear recent items cache to prevent auto-redirect
    clearRecentItems();
    console.log('[EditorHeader] ✅ Recent items cleared');
  };

  return (
    <div className="h-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center px-3 gap-2">
      <BackButton
        to="/welcome"
        onClick={handleBackClick}
        tooltip="Back to Welcome"
      />
      <div className="text-sm text-muted-foreground">
        Editor
      </div>
    </div>
  );
}
