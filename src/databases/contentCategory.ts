import { getDB } from "./_db";

export async function getProjectListByCategoryId(categoryId: string) {
  const db = await getDB();
  const result = await db.select<{ project_id: string }[]>(
    "SELECT project_id FROM content_categories WHERE category_id = $1",
    [categoryId]
  );
  return result.map((r) => r.project_id);
}