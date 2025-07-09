// import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import Home from './pages/Home';
import UMLEditor from './pages/UMLEditor';
import { initDB } from './databases/_db';
import Preview from './pages/Preview';
import { Layout } from './components/Layout';
import { useEffect, useState } from 'react';
import Empty from './pages/Empty';

// Initialize DB immediately
initDB().catch(console.error);

function App() {
  const [isDBReady, setIsDBReady] = useState(false);

  useEffect(() => {
    // Wait for DB initialization
    initDB()
      .then(() => setIsDBReady(true))
      .catch((error) => {
        console.error('Failed to initialize database:', error);
        // You might want to show an error message to the user here
      });
  }, []);

  if (!isDBReady) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/uml/:umlId" element={<UMLEditor />} />
            <Route path="/create" element={<Empty />} />
          </Route>
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
