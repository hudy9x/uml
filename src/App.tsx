// import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner"
import WelcomeScreen from './pages/WelcomeScreen';
import LoadingPage from './pages/LoadingPage';
import FileEditor from './pages/FileEditor';
import ProjectLayout from './pages/ProjectLayout';
import { Layout } from './components/Layout';
import Empty from './pages/Empty';

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Toaster position="bottom-right" richColors />
        <Routes>
          <Route path="/" element={<LoadingPage />} />
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/file" element={<FileEditor />} />
          <Route path="/project/:folderPath" element={<ProjectLayout />} />
          <Route path="/empty" element={<Empty />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
