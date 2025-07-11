import { Plus, X } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useProjectStore } from "@/stores/project";
import { createProject } from "@/databases/projects";
import UmlIcon from "./UmlIcon";

export default function Sidebar() {
  const { projects, loadProjects, addProject, deleteProject } = useProjectStore();
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

  async function handleDelete(e: React.MouseEvent, id: string, navigateTo: string | null) {
    e.preventDefault();
    e.stopPropagation();
    await deleteProject(id);
    
    if (navigateTo) {
      navigate(`/uml/${navigateTo}`);
    } else {
      navigate('/');
    }
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
          {projects.map((project, index) => {
            const nextProject = projects[index + 1]
            const prevProject = projects[index - 1]
            const navigateTo = nextProject 
              ? nextProject.id : prevProject 
              ? prevProject.id : null
            return (
              <Link
                key={project.id}
                className={cn(
                  "w-full text-muted-foreground relative truncate hover:bg-background/70 text-xs font-normal px-2 py-2 rounded-sm flex items-center justify-between group",
                  umlId === project.id &&
                    "bg-background text-primary shadow"
                )}
                to={`/uml/${project.id}`}
              >
                <div className="flex items-center gap-2 grow-0 w-[92%]">
                  <UmlIcon type={project.type || "sequence"} />
                  <span className="truncate">{project.name}</span>
                </div>
                <button
                  onClick={(e) => handleDelete(e, project.id, navigateTo)}
                  className="cursor-pointer hover:bg-secondary opacity-0 group-hover:opacity-100 hover:text-destructive p-1 rounded shrink-0 absolute right-2 top-1.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  );
}
