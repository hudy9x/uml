import { useProjectStore } from "@/stores/project";
import { memo } from "react";
import { useParams } from "react-router-dom";
import DiagramItem from "./DiagramItem";
import DiagramSortableContext from "../DiagramDnd/DiagramSortableContext";
import { useCategoryNDiagramDnD } from "../CategoryDnd/CategoryNDiagramDndContext";
import { PREFIX } from "../CategoryDnd/useUpdateCategoryPosition";

function useGetDiagramById() {
  const projects = useProjectStore((state) => state.projects);

  return {
    getDiagramById: (id: string) => {
      return projects.find((p) => p.id === id);
    },
  };
}

function DiagramList({ categoryId }: { categoryId?: string | null }) {
  const { diagramIdByCategoryId } = useCategoryNDiagramDnD();
  const { getDiagramById } = useGetDiagramById();
  const key = categoryId !== "default" ? `${PREFIX}${categoryId}` : "default";
  const sorted = diagramIdByCategoryId[key] || [];

  const { umlId } = useParams();

  const getNavigateToId = (index: number) => {
    const nextProject = sorted[index + 1];
    const prevProject = sorted[index - 1];

    const navigateId = nextProject
      ? nextProject
      : prevProject
      ? prevProject
      : null;

    if (!navigateId) {
      return null;
    }

    const splitedId = navigateId.split("#");

    return splitedId[1];
  };

  return (
    <nav className="flex flex-col gap-0.5">
      <DiagramSortableContext items={sorted}>
        {({ itemId, attributes, listeners }) => {
          const project = getDiagramById(itemId);
          if (!project) {
            return null;
          }

          const navigateTo = getNavigateToId(sorted.indexOf(itemId));

          return (
            <DiagramItem
              attributes={attributes}
              listeners={listeners}
              project={project}
              currentUmlId={umlId || null}
              nagivateToIdAfterDelete={navigateTo}
            />
          );
        }}
      </DiagramSortableContext>
    </nav>
  );
}

export default memo(DiagramList);
