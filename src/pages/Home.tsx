import { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { createProject, listProjects, type UMLProject } from "../lib/db";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { VersionDisplay } from "@/components/VersionDisplay";

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
      <aside className="px-2 py-4 relative grow-0 shrink-0 w-[150px]">
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          New Diagram
        </Button>

        <div className="space-y-1 mt-4">
          <small className="text-muted-foreground uppercase text-[10px] px-4">My Diagrams</small>
          <nav className="space-y-1 overflow-y-auto overflow-x-hidden pb-16 max-h-[calc(100vh-108px)] [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-transparent
  [&::-webkit-scrollbar-thumb]:bg-gray-300">
            {projects.map((project) => (
              <div key={project.id}>
                <Button className={cn("w-full !justify-start truncate", umlId === project.id && "bg-muted")} variant={"ghost"} onClick={() => navigate(`/uml/${project.id}`)}>
                  {project.name}
                </Button>
              </div>
            ))}
          </nav>
        </div>

        <div className="absolute bg-white pt-4 bottom-4 left-0 right-0 flex justify-center">
          <VersionDisplay />
        </div>
      </aside>
      <div className="flex-1">
        <Outlet />
      </div>
    </main>
  );
}
