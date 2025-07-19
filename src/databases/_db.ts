import Database from '@tauri-apps/plugin-sql';
import { migrate } from './_migrations';

const DB_PATH = 'sqlite:uml-editor.db';

export async function getDB() {
  return await Database.load(DB_PATH);
}

export async function initDB() {
  const db = await getDB();
  
  // Create UML Projects table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS uml_projects (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      content TEXT NOT NULL,
      position NUMERIC(8,4) NOT NULL DEFAULT 1.0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      is_deleted INTEGER DEFAULT 0,
      type TEXT
    )
  `);

  // Create Categories table with position field
  await db.execute(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      position NUMERIC(8,4) NOT NULL DEFAULT 1.0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // Create Content Categories linking table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS content_categories (
      project_id TEXT NOT NULL,
      category_id TEXT NOT NULL,
      PRIMARY KEY (project_id, category_id),
      FOREIGN KEY (project_id) REFERENCES uml_projects(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `);

  // Create indexes for better performance
  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position)
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_content_categories_project ON content_categories(project_id)
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_content_categories_category ON content_categories(category_id)
  `);

  await migrate(db);
}
