import { useProjectStore } from "@/stores/project";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import DiagramItem from "./DiagramItem";

export default function DiagramList({
  categoryId,
}: {
  categoryId?: string | null;
}) {
  const projects = useProjectStore((state) => state.projects);
  const loadProjects = useProjectStore((state) => state.loadProjects);
  const { umlId } = useParams();

  useEffect(() => {
    loadProjects(categoryId);
  }, [loadProjects, categoryId]);

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
