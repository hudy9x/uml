import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import UMLEditor from './pages/UMLEditor';
import { initDB } from './lib/db';

initDB()
function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uml/:umlId" element={<UMLEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
