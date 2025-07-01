import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { encode } from 'plantuml-encoder';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/ui/resizable';
import { getProject, updateProject } from '../lib/db';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { ZoomableView } from '../components/ZoomableView';

let saveTimeout: number;

export default function UMLEditor() {
  const { umlId } = useParams();
  const navigate = useNavigate();
  const [umlCode, setUmlCode] = useState('');
  const [svgUrl, setSvgUrl] = useState('');
  const [projectName, setProjectName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');


  useEffect(() => {
    if (!umlId) {
      navigate('/');
      return;
    }

    loadProject();
  }, [umlId]);

  async function loadProject() {
    if (!umlId) return;
    
    const project = await getProject(umlId);
    if (!project) {
      toast.error('Project not found');
      navigate('/');
      return;
    }

    setUmlCode(project.content);
    setProjectName(project.name);
  }

  async function handleNameSave() {
    if (!umlId) return;
    await updateProject(umlId, { name: editedName });
    setProjectName(editedName);
    setIsEditingName(false);
    toast.success('Project name updated!');
  };

  const handleInputClick = () => {
    setIsEditingName(true);
    setEditedName(projectName);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setEditedName(projectName);
    }
  };

  const handleBlur = () => {
    handleNameSave();
  };

  useEffect(() => {
    const encoded = encode(umlCode);
    setSvgUrl(`http://www.plantuml.com/plantuml/svg/${encoded}`);

    // Debounced save
    if (umlId) {
      toast.info('Saving...');
      clearTimeout(saveTimeout);
      saveTimeout = window.setTimeout(async () => {
        await updateProject(umlId, { content: umlCode });
        toast.success('Saved!');
      }, 1000);
    }
  }, [umlCode]);



  return (
    <main className="min-h-screen bg-background" style={{ backgroundColor: 'color(srgb 0.1582 0.1724 0.2053)'}}>
      <div className="mx-auto pr-4" >
        {/* Header */}
        
        {/* Editor */}
        <div>
          <ResizablePanelGroup
            direction="horizontal"
            className="rounded-lg py-4"
            style={{ height: 'calc(100vh)' }}
          >
            <ResizablePanel defaultSize={20}>
              <div className="h-full rounded-none border-0">

              <div className="flex items-center gap-4">
                <Button
                  variant="default"
                  size="icon"
                  onClick={() => navigate('/')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center gap-2">
                      <Input
                        value={isEditingName ? editedName : projectName}
                        readOnly={!isEditingName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={handleNameKeyDown}
                        onBlur={handleBlur}
                        onClick={handleInputClick}
                        className="max-w-[300px] text-white bg-transparent border-none cursor-pointer hover:border-white focus:border-white"
                      />
                    </div>
                  </div>
                </div>

                <CodeMirror
                  value={umlCode}
                  height="100%"
                  onChange={(value) => setUmlCode(value)}
                  className="h-full"
                  theme="dark"
                />
              </div>
            </ResizablePanel>
            
            <ResizableHandle className='invisible' />
            
            <ResizablePanel defaultSize={50}>
              <Card className="h-full rounded-lg border-0">
                <ZoomableView className="h-full">
                  <img 
                    src={svgUrl}
                    alt="UML Diagram"
                    className="max-w-full max-h-full"
                  />
                </ZoomableView>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </main>
  );
}
