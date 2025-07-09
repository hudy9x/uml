import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className=" relative">
      <main className="">
        {children}
      </main>
    </div>
  );
} 