export interface Project {
  id: string;
  name: string;
  content: string;
  position: number;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  type: string | null;
}

// Alias for backward compatibility
export type UMLProject = Project;

export interface Category {
  id: string;
  name: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
}

export interface ContentCategory {
  project_id: string;
  category_id: string;
}