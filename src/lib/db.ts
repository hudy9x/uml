import Database from '@tauri-apps/plugin-sql';

export interface UMLProject {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const DB_PATH = 'sqlite:uml-editor.db';

async function getDB() {
  return await Database.load(DB_PATH);
}

export async function initDB() {
  const db = await getDB();
  await db.execute(`
    CREATE TABLE IF NOT EXISTS uml_projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);
}

export async function createProject(name: string = 'Untitled UML'): Promise<UMLProject> {
  const db = await getDB();
  const project: UMLProject = {
    id: crypto.randomUUID(),
    name,
    content: `@startuml\nclass Example\n@enduml`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  await db.execute(
    'INSERT INTO uml_projects (id, name, content, created_at, updated_at) VALUES ($1, $2, $3, $4, $5)',
    [project.id, project.name, project.content, project.created_at, project.updated_at]
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
  updates: Partial<Pick<UMLProject, 'content' | 'name'>>
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
}

export async function listProjects(): Promise<UMLProject[]> {
  const db = await getDB();
  return await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects ORDER BY updated_at DESC'
  );
}
