import { useCategoryStore } from "@/stores/category";
import { useContentCategoryStore } from "@/stores/contentCategory";
import { PREFIX as CATEGORY_PREFIX } from "./useUpdateCategoryPosition";
import { useProjectStore } from "@/stores/project";

const DIAGRAM_PREFIX = "diagram-";

export default function useConvertCategoryNDiagram(): {
  isLoading: boolean;
  categoryIds: string[];
  diagramIdsByCategory: Record<string, string[]>;
} {
  const diagramIds = useProjectStore((state) =>
    state.projects.map((project) => project.id)
  );
  const isSuccessProjects = useProjectStore((state) => state.isSuccess);

  const contentCategories = useContentCategoryStore(
    (state) => state.contentCategories
  );
  const isSuccessContentCategories = useContentCategoryStore(
    (state) => state.isSuccess
  );

  const categories = useCategoryStore((state) => state.categories);
  const isSuccessCategories = useCategoryStore((state) => state.isSuccess);

  // return loading state if any of the stores are not success
  if (
    !isSuccessCategories ||
    !isSuccessContentCategories ||
    !isSuccessProjects
  ) {
    return {
      isLoading: true,
      categoryIds: [],
      diagramIdsByCategory: {},
    };
  }

  // sort categories by position asc and only return category ids
  // Ex: ["category-1", "category-2", "category-3"]
  const categoryIds = categories
    .sort((a, b) => a.position - b.position)
    .map((category) => `${CATEGORY_PREFIX}${category.id}`);

  // default diagram ids is an object with a default key and an array of diagram ids
  // Ex: { default: ["diagram-1", "diagram-2", "diagram-3"] }
  const diagramIdsByCategory = { default: [] } as Record<string, string[]>;

  diagramIds.forEach((dId) => {
    const found = contentCategories.find(
      (contentCategory) => contentCategory.project_id === dId
    );
    if (found) {
      const key = `${CATEGORY_PREFIX}${found.category_id}`;
      if (!diagramIdsByCategory[key]) {
        diagramIdsByCategory[key] = [];
      }
      diagramIdsByCategory[key].push(`${DIAGRAM_PREFIX}${dId}`);
      return;
    }

    diagramIdsByCategory.default.push(`${DIAGRAM_PREFIX}${dId}`);
  });

  return {
    isLoading: false,
    categoryIds,
    diagramIdsByCategory,
  };
}
