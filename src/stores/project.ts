import { atom, useAtom } from "jotai";
import { UMLProject } from "@/databases/_types";
import { listProjects } from "@/databases/projects";

interface ProjectState {
  projects: UMLProject[];
  loadProjects: (categoryId?: string | null) => Promise<void>;
  addProject: (project: UMLProject) => void;
}

// Base atoms
const projectsAtom = atom<UMLProject[]>([]);

// Action atoms
const loadProjectsAtom = atom(
  null,
  async (_get, set, categoryId?: string | null) => {
    const list = await listProjects(categoryId);
    const sortedProjects = list.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    set(projectsAtom, sortedProjects);
  }
);

const addProjectAtom = atom(null, (get, set, project: UMLProject) => {
  const projects = get(projectsAtom);
  set(projectsAtom, [project, ...projects]);
});

// Hook to use the store
export function useProjectStore<T>(selector?: (state: ProjectState) => T): T {
  const [projects] = useAtom(projectsAtom);
  const [, loadProjects] = useAtom(loadProjectsAtom);
  const [, addProject] = useAtom(addProjectAtom);

  const store: ProjectState = {
    projects,
    loadProjects: (categoryId) => loadProjects(categoryId),
    addProject: (project) => addProject(project),
  };

  return selector ? selector(store) : (store as T);
}
