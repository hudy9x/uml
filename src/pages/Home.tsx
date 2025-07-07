import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { createProject, listProjects, type UMLProject } from "../lib/db";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [projects, setProjects] = useState<UMLProject[]>([]);
  const navigate = useNavigate();
  const { umlId } = useParams();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const list = await listProjects();
    setProjects(
      list.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    );
  }

  async function handleCreate() {
    const project = await createProject();
    navigate(`/uml/${project.id}`);
  }

  return (
    <main className="min-h-screen bg-background flex">
      <aside className="px-2 py-4">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New Diagram
        </Button>

        <div className="space-y-1 mt-4">
          <small className="text-muted-foreground uppercase text-[10px] px-4">My Diagrams</small>
          {projects.map((project) => (
            <div key={project.id}>
              <Button className={cn("w-full !justify-start", umlId === project.id && "bg-muted")} variant={"ghost"} onClick={() => navigate(`/uml/${project.id}`)}>
                {project.name}
              </Button>
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}
