import UmlIcon from "@/components/UmlIcon";
import { UMLProject } from "@/databases/_types";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProjectStore } from "@/stores/project";
import { X } from "lucide-react";

function DiagramItem({
  project,
  currentUmlId,
  nagivateToIdAfterDelete,
}: {
  project: UMLProject;
  currentUmlId: string | null;
  nagivateToIdAfterDelete: string | null;
}) {
  const deleteProject = useProjectStore(state => state.deleteProject);
  const navigate = useNavigate();

  async function handleDelete(
    e: React.MouseEvent,
    id: string,
    navigateTo: string | null
  ) {
    e.preventDefault();
    e.stopPropagation();
    await deleteProject(id);

    if (navigateTo) {
      navigate(`/uml/${navigateTo}`);
    } else {
      navigate("/");
    }
  }

  return (
    <Link
      key={project.id}
      className={cn(
        "w-full text-muted-foreground relative truncate hover:bg-background/70 text-xs font-normal px-2 py-2 rounded-sm flex items-center justify-between group",
        currentUmlId === project.id && "bg-background text-primary shadow"
      )}
      to={`/uml/${project.id}`}
    >
      <div className="flex items-center gap-2 grow-0 w-[92%]">
        <UmlIcon type={project.type || "sequence"} />
        <span className="truncate">{project.name}</span>
      </div>
      <button
        onClick={(e) => handleDelete(e, project.id, nagivateToIdAfterDelete)}
        className="cursor-pointer hover:bg-secondary opacity-0 group-hover:opacity-100 hover:text-destructive p-1 rounded shrink-0 absolute right-2 top-1.5"
      >
        <X className="h-3 w-3" />
      </button>
    </Link>
  );
}

export default memo(DiagramItem);
