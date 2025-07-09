// import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import Home from './pages/Home';
import UMLEditor from './pages/UMLEditor';
import { initDB } from './lib/db';
import Preview from './pages/Preview';
import { Layout } from './components/Layout';

initDB()
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="/uml/:umlId" element={<UMLEditor />} />
          </Route>
          {/* <Route path="/uml/:umlId" element={<UMLEditor />} /> */}
          <Route path="/preview" element={<Preview />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
