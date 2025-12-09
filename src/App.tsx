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
import { useProjectStore } from './stores/project';
import Test from './pages/Test';
import { useContentCategoryStore } from './stores/contentCategory';
import { useCategoryStore } from './stores/category';
import { LoaderCircle } from 'lucide-react';
import { startPlantUMLServer, stopPlantUMLServer } from './hooks/useUMLDiagram';

// Initialize DB immediately
initDB().catch(console.error);

function App() {
  const [isDBReady, setIsDBReady] = useState(false);
  const loadProjects = useProjectStore(state => state.loadProjects);
  const loadContentCategories = useContentCategoryStore(state => state.loadData);
  const loadCategories = useCategoryStore(state => state.loadCategories);

  useEffect(() => {
    // Wait for DB initialization
    console.log("Start initializing database")
    initDB()
      .then(async () => {
        console.log("Start loading all data")
        await Promise.all([loadProjects(), loadContentCategories(), loadCategories()])
        console.log("All data loaded")

        // Start PlantUML server
        console.log("[PlantUML] Attempting to start PlantUML server...");
        try {
          const result = await startPlantUMLServer();
          console.log("[PlantUML] Server started successfully:", result);
        } catch (error) {
          console.error("[PlantUML] Failed to start PlantUML server:", error);
          console.error("[PlantUML] Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
          });
        }

        setTimeout(() => {
          setIsDBReady(true)
        }, 500);
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error);
        // You might want to show an error message to the user here
      });
  }, []);

  // Cleanup: Stop PlantUML server when app unmounts
  useEffect(() => {
    return () => {
      stopPlantUMLServer().catch((error) => {
        console.error('Failed to stop PlantUML server on unmount:', error);
      });
    };
  }, []);

  if (!isDBReady) {
    return <div className='h-screen w-screen flex items-center justify-center'>
      <div className="flex items-center justify-center">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    </div>; // Or a proper loading component
  }

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/uml/:umlId" element={<UMLEditor />} />
          </Route>
          <Route path="/empty" element={<Empty />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
