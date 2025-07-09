import Database from '@tauri-apps/plugin-sql';

export interface UMLProject {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
}

const DB_PATH = 'sqlite:uml-editor.db';

async function getDB() {
  return await Database.load(DB_PATH);
}

export async function initDB() {
  const db = await getDB();
  
  // Create table if not exists
  await db.execute(`
    CREATE TABLE IF NOT EXISTS uml_projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_deleted INTEGER DEFAULT 0
    )
  `);

  // Add is_deleted column if it doesn't exist
  try {
    await db.execute(`
      ALTER TABLE uml_projects 
      ADD COLUMN is_deleted INTEGER DEFAULT 0
    `);
  } catch (error: any) {
    // Column already exists, ignore the error
    if (!error.message?.includes('duplicate column name')) {
      throw error;
    }
  }
}

export async function createProject(name: string = 'Untitled UML'): Promise<UMLProject> {
  const db = await getDB();
  const project: UMLProject = {
    id: crypto.randomUUID(),
    name,
    content: `@startuml\nclass Example\n@enduml`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: 0
  };
  
  await db.execute(
    'INSERT INTO uml_projects (id, name, content, created_at, updated_at, is_deleted) VALUES ($1, $2, $3, $4, $5, $6)',
    [project.id, project.name, project.content, project.created_at, project.updated_at, project.is_deleted]
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
