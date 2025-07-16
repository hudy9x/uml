import { getDB } from "./_db";
import { ContentCategory } from "./_types";

export async function getProjectListByCategoryId(categoryId: string) {
  const db = await getDB();
  if (!categoryId) {
    const result = await db.select<{ id: string }[]>(
      "SELECT id FROM uml_projects WHERE id NOT IN (SELECT project_id FROM content_categories)"
    );
    return result.map((r) => r.id);
  } else {
  }
  const result = await db.select<{ project_id: string }[]>(
    "SELECT project_id FROM content_categories WHERE category_id = $1",
    [categoryId]
  );
  return result.map((r) => r.project_id);
}

export async function getAllDiagramInCategory(): Promise<ContentCategory[]> {
  const db = await getDB();
  const result = await db.select<{ project_id: string; category_id: string }[]>(
    "SELECT project_id, category_id FROM content_categories"
  );
  return result.map((r) => ({
    project_id: r.project_id,
    category_id: r.category_id,
  }));
}

export async function addDiagramToCategory(
  projectId: string,
  categoryId: string
) {
  const db = await getDB();
  await db.execute(
    "INSERT INTO content_categories (project_id, category_id) VALUES ($1, $2)",
    [projectId, categoryId]
  );
}

export async function updateDiagramCategory(
  projectId: string,
  newCategoryId: string
) {
  const db = await getDB();
  await db.execute(
    "UPDATE content_categories SET category_id = $1 WHERE project_id = $2",
    [newCategoryId, projectId]
  );
}

export async function removeDiagramFromCategory(
  projectId: string,
  categoryId: string
) {
  const db = await getDB();
  await db.execute(
    "DELETE FROM content_categories WHERE project_id = $1 AND category_id = $2",
    [projectId, categoryId]
  );
}
