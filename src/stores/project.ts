import { create } from 'zustand'
import { UMLProject } from '@/databases/_types'
import { listProjects, updateProject, deleteProject, detectUMLType } from '@/databases/projects'

interface ProjectState {
  projects: UMLProject[]
  loadProjects: () => Promise<void>
  updateProjectName: (id: string, name: string) => Promise<void>
  updateProjectContent: (id: string, content: string) => Promise<void>
  addProject: (project: UMLProject) => void
  deleteProject: (id: string) => Promise<void>
}

export const useProjectStore = create<ProjectState>()((set) => ({
  projects: [],
  loadProjects: async () => {
    const list = await listProjects()
    const sortedProjects = list.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    console.log('sortedProjects', sortedProjects)
    set({ projects: sortedProjects })
  },
  updateProjectName: async (id: string, name: string) => {
    updateProject(id, { name })
    set((state: ProjectState) => ({
      projects: state.projects.map((project: UMLProject) =>
        project.id === id ? { ...project, name } : project
      ),
    }))
  },
  updateProjectContent: async (id: string, content: string) => {
    const type = detectUMLType(content);
    updateProject(id, { content })
    set((state: ProjectState) => ({
      projects: state.projects.map((project: UMLProject) =>
        project.id === id ? { ...project, content, type } : project
      ),
    }))
  },
  addProject: (project: UMLProject) => {
    set((state: ProjectState) => ({
      projects: [project, ...state.projects]
    }))
  },
  deleteProject: async (id: string) => {
    await deleteProject(id)
    set((state: ProjectState) => ({
      projects: state.projects.filter((project) => project.id !== id)
    }))
  }
})) 