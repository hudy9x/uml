export interface UMLProject {
    id: string;
    name: string;
    content: string;
    position: number;
    created_at: string;
    updated_at: string;
    is_deleted: number;
    type?: string;
  }

export interface Category {
  id: string;
  name: string;
  description?: string;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ContentCategory {
  project_id: string;
  category_id: string;
}

export type CategoryWithProjects = Category & {
  projects: UMLProject[];
}

export type ProjectWithCategories = UMLProject & {
  categories: Category[];
}