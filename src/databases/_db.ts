import Database from '@tauri-apps/plugin-sql';
import { migrate } from './_migrations';

export interface UMLProject {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_deleted: number;
  type?: string;
}

const DB_PATH = 'sqlite:uml-editor.db';

export async function getDB() {
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
      is_deleted INTEGER DEFAULT 0,
      type TEXT
    )
  `);

  await migrate(db);

}
