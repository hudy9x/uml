import { getDB } from './_db';
import { Category, CategoryWithProjects, ContentCategory, ProjectWithCategories, UMLProject } from './_types';

// Create a new category
export async function createCategory(name: string, description?: string, position?: number): Promise<Category> {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // If position is not provided, get the max position and add 1
  if (!position) {
    const result = await db.select<[{ max_position: number }]>(
      'SELECT COALESCE(COUNT(position), 0) as max_position FROM categories'
    );
    console.log('max_position', result[0].max_position);
    position = (result[0].max_position + 1) * 1000;
    console.log('position', position);
  }

  const category: Category = {
    id,
    name,
    description,
    position,
    created_at: now,
    updated_at: now,
  };

  await db.execute(
    'INSERT INTO categories (id, name, description, position, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6)',
    [category.id, category.name, category.description, category.position, category.created_at, category.updated_at]
  );

  return category;
}

// Update a category
export async function updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
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
    `UPDATE categories SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`,
    values
  );

  const result = await db.select<Category[]>(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );

  return result[0];
}

// Delete a category
export async function deleteCategory(id: string): Promise<void> {
  const db = await getDB();
  await db.execute('DELETE FROM categories WHERE id = $1', [id]);
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  return await db.select<Category[]>(
    'SELECT * FROM categories ORDER BY position'
  );
}

// Get category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const db = await getDB();
  const result = await db.select<Category[]>(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result[0] || null;
}

// Get category with its projects
export async function getCategoryWithProjects(id: string): Promise<CategoryWithProjects | null> {
  const db = await getDB();
  const category = await getCategoryById(id);
  
  if (!category) return null;

  const projects = await db.select<UMLProject[]>(`
    SELECT p.* FROM uml_projects p
    JOIN content_categories cc ON p.id = cc.project_id
    WHERE cc.category_id = $1 AND p.is_deleted = 0
    ORDER BY p.updated_at DESC
  `, [id]);

  return {
    ...category,
    projects
  };
}

// Add project to category
export async function addProjectToCategory(projectId: string, categoryId: string): Promise<void> {
  const db = await getDB();
  await db.execute(
    'INSERT OR IGNORE INTO content_categories (project_id, category_id) VALUES ($1, $2)',
    [projectId, categoryId]
  );
}

// Remove project from category
export async function removeProjectFromCategory(projectId: string, categoryId: string): Promise<void> {
  const db = await getDB();
  await db.execute(
    'DELETE FROM content_categories WHERE project_id = $1 AND category_id = $2',
    [projectId, categoryId]
  );
}

// Get categories for a project
export async function getCategoriesForProject(projectId: string): Promise<Category[]> {
  const db = await getDB();
  return await db.select<Category[]>(`
    SELECT c.* FROM categories c
    JOIN content_categories cc ON c.id = cc.category_id
    WHERE cc.project_id = $1
    ORDER BY c.position
  `, [projectId]);
}

// Get project with its categories
export async function getProjectWithCategories(projectId: string): Promise<ProjectWithCategories | null> {
  const db = await getDB();
  const project = await db.select<UMLProject[]>(
    'SELECT * FROM uml_projects WHERE id = $1 AND is_deleted = 0',
    [projectId]
  );

  if (!project[0]) return null;

  const categories = await getCategoriesForProject(projectId);

  return {
    ...project[0],
    categories
  };
}

// Reorder categories
export async function reorderCategories(categoryIds: string[]): Promise<void> {
  const db = await getDB();
  
  // Start a transaction
  await db.execute('BEGIN TRANSACTION');
  
  try {
    // Update positions
    for (let i = 0; i < categoryIds.length; i++) {
      await db.execute(
        'UPDATE categories SET position = $1 WHERE id = $2',
        [i + 1, categoryIds[i]]
      );
    }
    
    // Commit the transaction
    await db.execute('COMMIT');
  } catch (error) {
    // Rollback on error
    await db.execute('ROLLBACK');
    throw error;
  }
} 