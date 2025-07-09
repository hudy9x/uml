import Database from "@tauri-apps/plugin-sql";

export async function migrate(db: Database) {

  // Add is_deleted column if it doesn't exist
  try {
    await db.execute(`
      ALTER TABLE uml_projects 
      ADD COLUMN is_deleted INTEGER DEFAULT 0
    `);
  } catch (error: any) {
    console.log("migrate:error", error.message)

  }

  // Add type column if it doesn't exist
  try {
    console.log("Adding type column");
    await db.execute(`
      ALTER TABLE uml_projects 
      ADD COLUMN type TEXT
    `);
  } catch (error: any) {
    // Column already exists, ignore the error
    console.log("migrate:error", error.message)
  }
}
