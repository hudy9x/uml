import { create } from 'zustand'
import { UMLProject, listProjects, updateProject } from '@/lib/db'

interface ProjectState {
  projects: UMLProject[]
  loadProjects: () => Promise<void>
  updateProjectName: (id: string, name: string) => Promise<void>
  addProject: (project: UMLProject) => void
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  loadProjects: async () => {
    const list = await listProjects()
    const sortedProjects = list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    set({ projects: sortedProjects })
  },
  updateProjectName: async (id: string, name: string) => {
    await updateProject(id, { name })
    set((state: ProjectState) => ({
      projects: state.projects.map((project: UMLProject) =>
        project.id === id ? { ...project, name } : project
      ),
    }))
  },
  addProject: (project: UMLProject) => {
    set((state: ProjectState) => ({
      projects: [project, ...state.projects]
    }))
  }
})) 