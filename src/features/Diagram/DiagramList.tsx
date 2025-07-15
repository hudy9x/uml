import { useProjectStore } from "@/stores/project";
import { memo, useEffect, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import DiagramItem from "./DiagramItem";
import { getProjectListByCategoryId } from "@/databases/contentCategory";
import { Project } from "@/databases/_types";

const useFilteredProjects = (categoryId?: string | null) => {
  const projects = useProjectStore((state) => state.projects);
  const [filteredIds, setFilteredIds] = useState<string[]>([]);

  const filteredProjects =
    categoryId === "default"
      ? projects
      : projects.filter((project) => filteredIds.includes(project.id));

  const loadProjects = useCallback(() => {
    if (categoryId && categoryId !== "default") {
      getProjectListByCategoryId(categoryId).then((projects) => {
        setFilteredIds(projects);
      });
    }
  }, [categoryId]); // Remove loadProjectsByCategoryId from deps

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return { filteredProjects };
};

const sortProjects = (projects: Project[]) => {
  return projects.sort((a, b) => a.position - b.position);
};

function DiagramList({ categoryId }: { categoryId?: string | null }) {
  const { umlId } = useParams();
  const { filteredProjects } = useFilteredProjects(categoryId);

  if (!filteredProjects || filteredProjects.length === 0) {
    return null;
  }

  return sortProjects(filteredProjects).map((project, index) => {
    const nextProject = filteredProjects[index + 1];
    const prevProject = filteredProjects[index - 1];
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
