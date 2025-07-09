import { ReactNode } from 'react';
import { TitleBar } from './TitleBar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className=" relative">
      {/* <TitleBar /> */}
      <main className="">
        {children}
      </main>
    </div>
  );
} 