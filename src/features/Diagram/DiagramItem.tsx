import UmlIcon from "@/components/UmlIcon";
import { UMLProject } from "@/databases/_types";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProjectStore } from "@/stores/project";
import { X } from "lucide-react";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { clearCacheRoute } from "@/lib/cache-route";

function DiagramItem({
  project,
  currentUmlId,
  nagivateToIdAfterDelete,
  attributes,
  listeners,
}: {
  project: UMLProject;
  currentUmlId: string | null;
  nagivateToIdAfterDelete: string | null;
  attributes: DraggableAttributes;
  listeners?: SyntheticListenerMap;
}) {
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const navigate = useNavigate();

  const activeOtherUml = (navigateTo: string | null) => {
    if (!currentUmlId || currentUmlId !== project.id) {
      return;
    }

    if (navigateTo) {
      navigate(`/uml/${navigateTo}`);
    } else {
      navigate("/");
    }
  };

  async function handleDelete(
    e: React.MouseEvent,
    id: string,
    navigateTo: string | null
  ) {
    e.preventDefault();
    e.stopPropagation();

    await deleteProject(id);
    clearCacheRoute();
    activeOtherUml(navigateTo);
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
        <div
          {...attributes}
          {...listeners}
          className="absolute group/diagram-item transition-all duration-100 hover:w-full hover:backdrop-blur-xs hover:bg-foreground/20 left-0 top-0 w-7 h-full bg-transparent cursor-grab"
        >
          <span className="absolute invisible group-hover/diagram-item:visible pointer-events-none left-0 top-0 w-full h-full flex items-center justify-center text-xs text-muted-foreground">
            Drag me to sort
          </span>
        </div>
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
