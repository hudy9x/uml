import { updateProject } from "@/databases/projects";
import { DIAGRAM_PREFIX } from "./useConvertCategoryNDiagram";
import { useProjectStore } from "@/stores/project";

export function extractDiagramId(id: string) {
  const extracted = id.replace(DIAGRAM_PREFIX, "");
  return extracted === "default" ? "" : extracted;
}

export default function useUpdateDiagramPosition() {
  const diagramMetadatas = useProjectStore((state) => state.projects);

  function updateDiagramPositionHandler(
    draggedDiagramId: string,
    toDiagramId: string
  ) {
    let toPosition = -1;
    let beforeToPosition = -1;

    diagramMetadatas.forEach((d, index) => {
      if (d.id === toDiagramId) {
        toPosition = d.position;
        beforeToPosition = diagramMetadatas[index - 1]?.position || 0;
        console.log("toPosition", toPosition);
        console.log("beforeToPosition", beforeToPosition);
        return;
      }
    });

    const newPosition = (beforeToPosition + toPosition) / 2;
    console.log("newPosition", draggedDiagramId, newPosition);

    updateProject(draggedDiagramId, {
      content: undefined, // mean do nothing
      position: newPosition,
    }).catch((err) => {
      console.log("updateDiagramPositionHandler error", err);
    });
  }

  return {
    updateDiagramPositionHandler,
  };
}
