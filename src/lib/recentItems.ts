export interface RecentItem {
  path: string;
  name: string;
  type: 'file' | 'folder';
  lastOpened: number; // timestamp
}

const RECENT_ITEMS_KEY = 'uml-editor-recent-items';
const MAX_RECENT_ITEMS = 10;

/**
 * Get all recent items from localStorage
 */
export function getRecentItems(): RecentItem[] {
  try {
    const stored = localStorage.getItem(RECENT_ITEMS_KEY);
    if (!stored) return [];

    const items: RecentItem[] = JSON.parse(stored);
    // Sort by most recent first
    return items.sort((a, b) => b.lastOpened - a.lastOpened);
  } catch (error) {
    console.error('Error reading recent items:', error);
    return [];
  }
}

/**
 * Add or update a recent item
 */
export function addRecentItem(path: string, name: string, type: 'file' | 'folder'): void {
  try {
    const items = getRecentItems();

    // Remove existing item with same path if exists
    const filtered = items.filter(item => item.path !== path);

    // Add new item at the beginning
    const newItem: RecentItem = {
      path,
      name,
      type,
      lastOpened: Date.now()
    };

    filtered.unshift(newItem);

    // Keep only the most recent MAX_RECENT_ITEMS
    const limited = filtered.slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving recent item:', error);
  }
}

/**
 * Get the most recently opened item
 */
export function getLastOpenedItem(): RecentItem | null {
  const items = getRecentItems();
  return items.length > 0 ? items[0] : null;
}

/**
 * Clear all recent items
 */
export function clearRecentItems(): void {
  try {
    localStorage.removeItem(RECENT_ITEMS_KEY);
  } catch (error) {
    console.error('Error clearing recent items:', error);
  }
}
