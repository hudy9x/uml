import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { createProject, listProjects, type UMLProject } from '../lib/db';
import { Plus, FileCode2 } from 'lucide-react';
import { TestWindow } from '../components/Testwindow';

export default function Home() {
  const [projects, setProjects] = useState<UMLProject[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const list = await listProjects();
    setProjects(list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()));
  }

  async function handleCreate() {
    const project = await createProject();
    navigate(`/uml/${project.id}`);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-6 space-y-6">
        <Card className="border-b">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">UML Projects</CardTitle>
                <CardDescription>Create and manage your UML diagrams</CardDescription>
              </div>
              <Button onClick={handleCreate}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </CardHeader>
        </Card>

        <TestWindow />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project.id}
              className="hover:bg-accent/5 cursor-pointer transition-colors"
              onClick={() => navigate(`/uml/${project.id}`)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileCode2 className="h-5 w-5" />
                  {project.name}
                </CardTitle>
                <CardDescription>
                  Last updated: {new Date(project.updated_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground font-mono bg-muted p-2 rounded-md">
                  {project.content.split('\n').slice(0, 3).join('\n')}
                  {project.content.split('\n').length > 3 && '...'}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {projects.length === 0 && (
            <Card className="col-span-full p-8">
              <div className="text-center space-y-4">
                <FileCode2 className="h-12 w-12 mx-auto text-muted-foreground" />
                <CardTitle>No projects yet</CardTitle>
                <CardDescription>Create your first UML project to get started</CardDescription>
                <Button onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Project
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
