import { getDB } from "./_db";
import { Category } from "./_types";

// Create a new category
export async function createCategory(
  name: string,
  description?: string,
  position?: number
): Promise<Category> {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // If position is not provided, get the max position and add 1
  if (!position) {
    const result = await db.select<[{ max_position: number }]>(
      "SELECT COALESCE(MAX(position), 0) as max_position FROM categories"
    );
    console.log("max_position", result[0].max_position);
    position = result[0].max_position + 200;
    console.log("position", position);
  }

  const category: Category = {
    id,
    name,
    description: description || null,
    position,
    created_at: now,
    updated_at: now,
  };

  await db.execute(
    "INSERT INTO categories (id, name, description, position, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)",
    [
      category.id,
      category.name,
      category.description,
      category.position,
      category.created_at,
      category.updated_at,
    ]
  );

  return category;
}

// Update a category
export async function updateCategory(
  id: string,
  updates: Partial<Category>
): Promise<Category> {
  const db = await getDB();
  const now = new Date().toISOString();

  const updateFields: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    updateFields.push(`name = $${paramIndex}`);
    values.push(updates.name);
    paramIndex++;
  }

  if (updates.description !== undefined) {
    updateFields.push(`description = $${paramIndex}`);
    values.push(updates.description);
    paramIndex++;
  }

  if (updates.position !== undefined) {
    updateFields.push(`position = $${paramIndex}`);
    values.push(updates.position);
    paramIndex++;
  }

  updateFields.push(`updated_at = $${paramIndex}`);
  values.push(now);
  paramIndex++;

  values.push(id);

  await db.execute(
    `UPDATE categories SET ${updateFields.join(
      ", "
    )} WHERE id = $${paramIndex}`,
    values
  );

  const result = await db.select<Category[]>(
    "SELECT * FROM categories WHERE id = $1",
    [id]
  );

  return result[0];
}

// Delete a category
export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB();
  await db.execute("DELETE FROM categories WHERE id = $1", [id]);
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return await db.select<Category[]>(
    "SELECT * FROM categories ORDER BY position"
  );
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDB();
  const result = await db.select<Category[]>(
    "SELECT * FROM categories WHERE id = $1",
    [id]
  );
  return result[0] || null;
}

// Add project to category
export async function addProjectToCategory(
  projectId: string,
  categoryId: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "INSERT OR IGNORE INTO content_categories (project_id, category_id) VALUES ($1, $2)",
    [projectId, categoryId]
  );
}

// Remove project from category
export async function removeProjectFromCategory(
  projectId: string,
  categoryId: string
): Promise<void> {
  const db = await getDB();
  await db.execute(
    "DELETE FROM content_categories WHERE project_id = $1 AND category_id = $2",
    [projectId, categoryId]
  );
}

// Get categories for a project
export async function getCategoriesForProject(
  projectId: string
): Promise<Category[]> {
  const db = await getDB();
  return await db.select<Category[]>(
    `
    SELECT c.* FROM categories c
    JOIN content_categories cc ON c.id = cc.category_id
    WHERE cc.project_id = $1
    ORDER BY c.position
  `,
    [projectId]
  );
}

export async function reorderCategory({
  categoryId,
  toCategoryId,
  beforeToCategoryId,
}: {
  categoryId: string;
  toCategoryId: string;
  beforeToCategoryId: string;
}) {
  const db = await getDB();

  console.log('---------------------------------------')
  console.log("categoryId", categoryId);
  console.log("toCategoryId", toCategoryId);
  console.log("beforeToCategoryId", beforeToCategoryId);

  // const toCategory = await getCategoryById(toCategoryId);
  // if (!toCategory) {
  //   throw new Error("To category not found");
  // }

  // await db.execute(
  //   "UPDATE categories SET position = position + 1 WHERE position >= $1",
  //   [toCategoryId]
  // );
  // await db.execute(
  //   "UPDATE categories SET position = $1 WHERE id = $2",
  // )
}

// Reorder categories
export async function reorderCategories(categoryIds: string[]): Promise<void> {
  const db = await getDB();

  // Start a transaction
  await db.execute("BEGIN TRANSACTION");

  try {
    // Update positions
    for (let i = 0; i < categoryIds.length; i++) {
      await db.execute("UPDATE categories SET position = $1 WHERE id = $2", [
        i + 1,
        categoryIds[i],
      ]);
    }

    // Commit the transaction
    await db.execute("COMMIT");
  } catch (error) {
    // Rollback on error
    await db.execute("ROLLBACK");
    throw error;
  }
}
