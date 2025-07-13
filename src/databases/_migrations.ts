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

  // Add position column to uml_projects if it doesn't exist
  try {
    console.log("Adding position column to uml_projects");
    await db.execute(`
      ALTER TABLE uml_projects 
      ADD COLUMN position NUMERIC(8,4) NOT NULL DEFAULT 1.0
    `);
  } catch (error: any) {
    console.log("migrate:error", error.message)
  }

  // Update categories position column type
  try {
    console.log("Updating categories position column type");
    // First create a temporary table with the new schema
    await db.execute(`
      CREATE TABLE categories_new (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        position NUMERIC(8,4) NOT NULL DEFAULT 1.0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )
    `);

    // Copy data from old table to new table
    await db.execute(`
      INSERT INTO categories_new 
      SELECT id, name, description, CAST(position AS NUMERIC(8,4)), created_at, updated_at 
      FROM categories
    `);

    // Drop the old table
    await db.execute(`DROP TABLE categories`);

    // Rename the new table to the original name
    await db.execute(`ALTER TABLE categories_new RENAME TO categories`);

    // Recreate the index
    await db.execute(`
      CREATE INDEX IF NOT EXISTS idx_categories_position ON categories(position)
    `);
  } catch (error: any) {
    console.log("migrate:error", error.message)
  }
}
