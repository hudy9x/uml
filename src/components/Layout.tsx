import { ReactNode } from 'react';
import { VersionDisplay } from './VersionDisplay';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen relative">
      {children}
      <VersionDisplay />
    </div>
  );
} 