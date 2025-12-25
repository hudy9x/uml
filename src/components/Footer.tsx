import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <footer className="border-t bg-muted/30">
        <div className="flex items-center justify-between px-4 py-1.5">
          <div className="text-xs text-muted-foreground">Mermaid Editor</div>
          <div className="h-7 w-7" />
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t bg-muted/30">
      <div className="flex items-center justify-between px-4 py-1.5">
        <div className="text-xs text-muted-foreground">
          Mermaid Editor
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="h-7 w-7 p-0"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </footer>
  );
}
