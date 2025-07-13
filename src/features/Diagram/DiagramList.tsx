import { useProjectStore } from "@/stores/project";
import { memo, useEffect } from "react";
import { useParams } from "react-router-dom";
import DiagramItem from "./DiagramItem";

 function DiagramList({
  categoryId,
}: {
  categoryId?: string | null;
}) {
  const projectByCategoryId = useProjectStore(
    (state) => state.projectByCategoryId
  );
  const loadProjectsByCategoryId = useProjectStore(
    (state) => state.loadProjectsByCategoryId
  );
  const { umlId } = useParams();
  const projects = projectByCategoryId[categoryId || "default"];

  useEffect(() => {
    console.log("loadProjects", categoryId);
    if (categoryId) {
      loadProjectsByCategoryId(categoryId);
    }
  }, [loadProjectsByCategoryId, categoryId]);

  if (!projects) {
    return null;
  }

  return projects.map((project, index) => {
    const nextProject = projects[index + 1];
    const prevProject = projects[index - 1];
    const navigateTo = nextProject
      ? nextProject.id
      : prevProject
      ? prevProject.id
      : null;
    return (
      <DiagramItem
        key={project.id}
        project={project}
        currentUmlId={umlId || null}
        nagivateToIdAfterDelete={navigateTo}
      />
    );
  });
}

export default memo(DiagramList);
