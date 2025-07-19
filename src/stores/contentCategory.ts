import { atom, useAtom } from "jotai";
import { ContentCategory } from "@/databases/_types";
import {
  getAllDiagramInCategory,
  addDiagramToCategory,
  updateDiagramCategory,
  removeDiagramFromCategory,
} from "@/databases/contentCategory";

interface ContentCategoryStore {
  contentCategories: ContentCategory[];
  isLoading: boolean;
  isSuccess: boolean;
  loadData: () => Promise<void>;
  addDiagramToCategory: (
    projectId: string,
    categoryId: string
  ) => Promise<void>;
  updateDiagramCategory: (
    projectId: string,
    categoryId: string
  ) => Promise<void>;
  removeDiagramFromCategory: (
    projectId: string,
    categoryId: string
  ) => Promise<void>;
}

// Base atom for categories
const contentCategoriesAtom = atom<ContentCategory[]>([]);

const loadingContentCategoriesAtom = atom(false);
const successContentCategoriesAtom = atom(false);

// Action atoms
const loadContentCategoriesAtom = atom(null, async (get, set) => {
  const isLoading = get(loadingContentCategoriesAtom);
  
  if (isLoading) {
    return;
  }

  set(loadingContentCategoriesAtom, true);
  set(successContentCategoriesAtom, false);

  const diagramInAllCategories = await getAllDiagramInCategory();

  set(contentCategoriesAtom, diagramInAllCategories);

  set(loadingContentCategoriesAtom, false);
  set(successContentCategoriesAtom, true);
});

const addDiagramToCategoryAtom = atom(
  null,
  async (
    get,
    set,
    { projectId, categoryId }: { projectId: string; categoryId: string }
  ) => {
    await addDiagramToCategory(projectId, categoryId);
    const contentCategories = get(contentCategoriesAtom);
    set(contentCategoriesAtom, [
      ...contentCategories,
      { project_id: projectId, category_id: categoryId },
    ]);
  }
);

const updateDiagramCategoryAtom = atom(
  null,
  async (
    get,
    set,
    { projectId, categoryId }: { projectId: string; categoryId: string }
  ) => {
    await updateDiagramCategory(projectId, categoryId);
    const contentCategories = get(contentCategoriesAtom);
    set(
      contentCategoriesAtom,
      contentCategories.map((c) =>
        c.project_id === projectId ? { ...c, category_id: categoryId } : c
      )
    );
  }
);

const removeDiagramFromCategoryAtom = atom(
  null,
  async (
    get,
    set,
    { projectId, categoryId }: { projectId: string; categoryId: string }
  ) => {
    await removeDiagramFromCategory(projectId, categoryId);
    const contentCategories = get(contentCategoriesAtom);
    set(
      contentCategoriesAtom,
      contentCategories.filter(
        (c) => c.project_id !== projectId && c.category_id !== categoryId
      )
    );
  }
);

// Hook to use the store
export function useContentCategoryStore<T>(
  selector?: (state: ContentCategoryStore) => T
): T {
  const [loadingContentCategories] = useAtom(loadingContentCategoriesAtom);
  const [successContentCategories] = useAtom(successContentCategoriesAtom);
  const [contentCategories] = useAtom(contentCategoriesAtom);
  const [, loadContentCategories] = useAtom(loadContentCategoriesAtom);
  const [, addDiagramToCategory] = useAtom(addDiagramToCategoryAtom);
  const [, updateDiagramCategory] = useAtom(updateDiagramCategoryAtom);
  const [, removeDiagramFromCategory] = useAtom(removeDiagramFromCategoryAtom);

  const store: ContentCategoryStore = {
    contentCategories,
    isLoading: loadingContentCategories,
    isSuccess: successContentCategories,
    loadData: () => loadContentCategories(),
    addDiagramToCategory: (projectId, categoryId) =>
      addDiagramToCategory({ projectId, categoryId }),
    updateDiagramCategory: (projectId, categoryId) =>
      updateDiagramCategory({ projectId, categoryId }),
    removeDiagramFromCategory: (projectId, categoryId) =>
      removeDiagramFromCategory({ projectId, categoryId }),
  };

  return selector ? selector(store) : (store as T);
}
