import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentItems, RecentItem } from '@/lib/recentItems';
import { FileText, Folder, Clock } from 'lucide-react';

export function RecentItems() {
  const [items, setItems] = useState<RecentItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load recent items from localStorage
    setItems(getRecentItems());
  }, []);

  const handleItemClick = (item: RecentItem) => {
    if (item.type === 'file') {
      navigate('/file', { state: { filePath: item.path } });
    } else {
      const encodedPath = encodeURIComponent(item.path);
      navigate(`/project/${encodedPath}`);
    }
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  if (items.length === 0) {
    return (
      <div className="mt-12">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">
          Recent
        </h2>
        <div className="p-8 text-center text-sm text-muted-foreground">
          No recent files or folders
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Recent
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.path}
            onClick={() => handleItemClick(item)}
            className="px-4 py-3 rounded-lg bg-card border border-border hover:bg-accent transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              {item.type === 'folder' ? (
                <Folder className="w-4 h-4 text-primary flex-shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-card-foreground group-hover:text-accent-foreground truncate">
                  {item.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {item.path}
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex-shrink-0">
                {formatTime(item.lastOpened)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
