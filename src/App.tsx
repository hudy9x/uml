import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import UMLEditor from './pages/UMLEditor';
import { initDB } from './lib/db';
import TestPage from './pages/TestPage';

initDB()
function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uml/:umlId" element={<UMLEditor />} />
        <Route path="/test" element={<TestPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
