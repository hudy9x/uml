import { getDB } from './_db';
import { UMLProject } from './_types';

export async function createProject(name: string = 'Untitled UML', type?: string): Promise<UMLProject> {
  const db = await getDB();
  const project: UMLProject = {
    id: crypto.randomUUID(),
    name,
    content: `@startuml\nclass Example\n@enduml`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: 0,
    type
  };
  
  await db.execute(
    'INSERT INTO uml_projects (id, name, content, created_at, updated_at, is_deleted, type) VALUES ($1, $2, $3, $4, $5, $6, $7)',
    [project.id, project.name, project.content, project.created_at, project.updated_at, project.is_deleted, project.type]
  );
  
  return project;
}

export async function getProject(id: string): Promise<UMLProject | undefined> {
  const db = await getDB();
  const result = await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects WHERE id = $1',
    [id]
  );
  return result[0];
}

export async function updateProject(
  id: string, 
  updates: Partial<Pick<UMLProject, 'content' | 'name' | 'type'>>
): Promise<void> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  if (updates.content !== undefined) {
    await db.execute(
      'UPDATE uml_projects SET content = $1, updated_at = $2 WHERE id = $3',
      [updates.content, now, id]
    );
  }
  
  if (updates.name !== undefined) {
    await db.execute(
      'UPDATE uml_projects SET name = $1, updated_at = $2 WHERE id = $3',
      [updates.name, now, id]
    );
  }

  if (updates.type !== undefined) {
    await db.execute(
      'UPDATE uml_projects SET type = $1, updated_at = $2 WHERE id = $3',
      [updates.type, now, id]
    );
  }
}

export async function deleteProject(id: string): Promise<void> {
  const db = await getDB();
  const now = new Date().toISOString();
  
  await db.execute(
    'UPDATE uml_projects SET is_deleted = 1, updated_at = $1 WHERE id = $2',
    [now, id]
  );
}

export async function listProjects(): Promise<UMLProject[]> {
  const db = await getDB();
  return await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects WHERE is_deleted = 0 ORDER BY updated_at DESC'
  );
}
