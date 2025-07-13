import { atom, useAtom } from 'jotai';
import { UMLProject } from '@/databases/_types'
import { 
  listProjects, 
  updateProject, 
  deleteProject as deleteProjectFromDb, 
  detectUMLType, 
  restoreProject as restoreProjectFromDb 
} from '@/databases/projects'

interface ProjectState {
  projects: UMLProject[]
  projectByCategoryId: Record<string, UMLProject[]>
  loadProjectsByCategoryId: (categoryId: string) => Promise<void>
  loadProjects: (categoryId?: string | null) => Promise<void>
  updateProjectName: (id: string, name: string) => Promise<void>
  updateProjectContent: (id: string, content: string) => Promise<void>
  addProject: (project: UMLProject) => void
  deleteProject: (id: string) => Promise<void>
  restoreProject: (project: UMLProject) => Promise<void>
}

// Base atoms
const projectsAtom = atom<UMLProject[]>([]);
const projectByCategoryIdAtom = atom<Record<string, UMLProject[]>>({});

// Action atoms
const loadProjectsByCategoryIdAtom = atom(
  null,
  async (get, set, categoryId: string) => {
    const list = await listProjects(categoryId);
    const projectByCategoryId = get(projectByCategoryIdAtom);
    set(projectByCategoryIdAtom, { ...projectByCategoryId, [categoryId]: list });
  }
);

const loadProjectsAtom = atom(
  null,
  async (get, set, categoryId?: string | null) => {
    const list = await listProjects(categoryId);
    const sortedProjects = list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    set(projectsAtom, sortedProjects);
  }
);

const updateProjectNameAtom = atom(
  null,
  async (get, set, { id, name }: { id: string; name: string }) => {
    await updateProject(id, { name });
    const projects = get(projectsAtom);
    set(projectsAtom,
      projects.map((project: UMLProject) =>
        project.id === id ? { ...project, name } : project
      )
    );
  }
);

const updateProjectContentAtom = atom(
  null,
  async (get, set, { id, content }: { id: string; content: string }) => {
    const type = detectUMLType(content);
    await updateProject(id, { content });
    const projects = get(projectsAtom);
    set(projectsAtom,
      projects.map((project: UMLProject) =>
        project.id === id ? { ...project, content, type } : project
      )
    );
  }
);

const addProjectAtom = atom(
  null,
  (get, set, project: UMLProject) => {
    const projects = get(projectsAtom);
    set(projectsAtom, [project, ...projects]);
  }
);

const deleteProjectAtom = atom(
  null,
  async (get, set, id: string) => {
    await deleteProjectFromDb(id);
    const projects = get(projectsAtom);
    set(projectsAtom, projects.filter((project) => project.id !== id));
  }
);

const restoreProjectAtom = atom(
  null,
  async (get, set, project: UMLProject) => {
    await restoreProjectFromDb(project.id);
    const restoredProject = { ...project, is_deleted: 0 };
    const projects = get(projectsAtom);
    set(projectsAtom, [restoredProject, ...projects]);
  }
);

// Hook to use the store
export function useProjectStore<T>(selector?: (state: ProjectState) => T): T {
  const [projects] = useAtom(projectsAtom);
  const [projectByCategoryId] = useAtom(projectByCategoryIdAtom);
  const [, loadProjectsByCategoryId] = useAtom(loadProjectsByCategoryIdAtom);
  const [, loadProjects] = useAtom(loadProjectsAtom);
  const [, updateProjectName] = useAtom(updateProjectNameAtom);
  const [, updateProjectContent] = useAtom(updateProjectContentAtom);
  const [, addProject] = useAtom(addProjectAtom);
  const [, deleteProject] = useAtom(deleteProjectAtom);
  const [, restoreProject] = useAtom(restoreProjectAtom);

  const store: ProjectState = {
    projects,
    projectByCategoryId,
    loadProjectsByCategoryId: (categoryId) => loadProjectsByCategoryId(categoryId),
    loadProjects: (categoryId) => loadProjects(categoryId),
    updateProjectName: (id, name) => updateProjectName({ id, name }),
    updateProjectContent: (id, content) => updateProjectContent({ id, content }),
    addProject: (project) => addProject(project),
    deleteProject: (id) => deleteProject(id),
    restoreProject: (project) => restoreProject(project),
  };

  return selector ? selector(store) : store as T;
} 