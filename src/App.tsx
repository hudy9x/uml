// import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import Home from './pages/Home';
import FileViewer from './pages/FileViewer';
import { Layout } from './components/Layout';
import Empty from './pages/Empty';


function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/empty" element={<Empty />} />
          <Route path="/file-viewer" element={<FileViewer />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
