import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLastOpenedItem } from '@/lib/recentItems';
import { Loader2 } from 'lucide-react';

export default function LoadingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Small delay to show loading state
    const timer = setTimeout(() => {
      const lastItem = getLastOpenedItem();

      if (lastItem) {
        console.log('[LoadingPage] Redirecting to last opened item:', lastItem);

        if (lastItem.type === 'file') {
          navigate('/file', { state: { filePath: lastItem.path }, replace: true, viewTransition: true });
        } else {
          const encodedPath = encodeURIComponent(lastItem.path);
          navigate(`/project/${encodedPath}`, { replace: true, viewTransition: true });
        }
      } else {
        // No recent items, go to welcome screen
        navigate('/welcome', { replace: true, viewTransition: true });
      }
    }, 300); // 300ms delay for smooth UX

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
