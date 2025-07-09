import { getDB } from "./_db";

export async function migrate() {
  const db = await getDB();

  // Add is_deleted column if it doesn't exist
  try {
    await db.execute(`
      ALTER TABLE uml_projects 
      ADD COLUMN is_deleted INTEGER DEFAULT 0
    `);
  } catch (error: any) {
    // Column already exists, ignore the error
    if (!error.message?.includes("duplicate column name")) {
      throw error;
    }
  }

  // Add type column if it doesn't exist
  try {
    await db.execute(`
      ALTER TABLE uml_projects 
      ADD COLUMN type TEXT
    `);
  } catch (error: any) {
    // Column already exists, ignore the error
    if (!error.message?.includes("duplicate column name")) {
      throw error;
    }
  }
}
