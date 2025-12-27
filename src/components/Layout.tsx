import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <main id="main-layout" className="h-full overflow-hidden">
      {children}
    </main>
  );
} 