import { createContext, useContext, useState, ReactNode } from 'react';

interface DiagramContextType {
  content: string;
  setContent: (content: string) => void;
  filename: string;
}

const DiagramContext = createContext<DiagramContextType | null>(null);

export function useDiagramContent() {
  const context = useContext(DiagramContext);
  if (!context) {
    throw new Error('useDiagramContent must be used within DiagramContainer');
  }
  return context;
}

export function DiagramProvider({
  initialContent,
  filename,
  children
}: {
  initialContent: string;
  filename: string;
  children: ReactNode;
}) {
  const [content, setContent] = useState(initialContent);

  return (
    <DiagramContext.Provider value={{ content, setContent, filename }}>
      {children}
    </DiagramContext.Provider>
  );
}
