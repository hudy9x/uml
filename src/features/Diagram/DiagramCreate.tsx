import { Button } from "@/components/ui/button";
import { createProject } from "@/databases/projects";
import { Plus } from "lucide-react";
import { useProjectStore } from "@/stores/project";
import { useNavigate } from "react-router-dom";

export default function DiagramCreate() {
  const addProject = useProjectStore(state => state.addProject);
  const navigate = useNavigate();

  async function handleCreate() {
    const project = await createProject();
    addProject(project);
    navigate(`/uml/${project.id}`);
  }

  return (
    <div className="px-3">
      <Button variant="outline" onClick={handleCreate} className="w-full">
        <Plus className="h-4 w-4" />
        New Diagram
      </Button>
    </div>
  );
}
