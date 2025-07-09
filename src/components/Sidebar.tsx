import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { createProject, UMLProject } from "@/lib/db";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProjectStore } from "@/stores/project";

export default function Sidebar() {
  const { projects, loadProjects, addProject } = useProjectStore();
  const navigate = useNavigate();
  const { umlId } = useParams();

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleCreate() {
    const project = await createProject();
    addProject(project);
    navigate(`/uml/${project.id}`);
  }

  return (
    <aside className="px-3 py-2 relative grow-0 shrink-0 w-[200px] border-r border-[var(--color-border)]">
      <Button variant="outline" onClick={handleCreate} className="w-full">
        <Plus className="h-4 w-4" />
        New Diagram
      </Button>

      <div className="mt-4">
        <h2 className="text-primary uppercase text-[10px] px-2 pb-2">
          My Diagrams
        </h2>
        <nav
          className="flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden pb-16 max-h-[calc(100vh-108px)] [&::-webkit-scrollbar]:w-1
[&::-webkit-scrollbar-track]:bg-transparent
[&::-webkit-scrollbar-thumb]:bg-gray-300"
        >
          {projects.map((project) => (
            <Link
              key={project.id}
              className={cn(
                "w-full text-muted-foreground truncate hover:bg-background/70 text-xs font-normal px-2 py-2 rounded-sm",
                umlId === project.id &&
                  "bg-background text-primary shadow"
              )}
              to={`/uml/${project.id}`}
            >
              {project.name}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
