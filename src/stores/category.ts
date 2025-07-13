import { atom, useAtom } from 'jotai';
import { Category } from '@/databases/_types';
import { 
  createCategory, 
  deleteCategory, 
  getAllCategories, 
  reorderCategories, 
  updateCategory 
} from '@/databases/categories';

interface CategoryStore {
  categories: Category[];
  loadCategories: () => Promise<void>;
  addCategory: (category: Category) => void;
  updateCategoryInStore: (category: Category) => void;
  deleteCategoryFromStore: (id: string) => void;
  createNewCategory: (name: string, description?: string) => Promise<Category>;
  updateExistingCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteExistingCategory: (id: string) => Promise<void>;
  reorderCategoryList: (categoryIds: string[]) => Promise<void>;
}

// Base atom for categories
const categoriesAtom = atom<Category[]>([]);

// Action atoms
const loadCategoriesAtom = atom(
  null,
  async (get, set) => {
    const categories = await getAllCategories();
    
    if (!categories.find((c) => c.name === "Default")) {
      categories.unshift({
        id: "default",
        name: "Default",
        description: "Default category",
        position: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    set(categoriesAtom, categories);
  }
);

const addCategoryAtom = atom(
  null,
  (get, set, category: Category) => {
    const categories = get(categoriesAtom);
    set(categoriesAtom, [...categories, category]);
  }
);

const updateCategoryInStoreAtom = atom(
  null,
  (get, set, category: Category) => {
    const categories = get(categoriesAtom);
    set(categoriesAtom, categories.map((c) => 
      c.id === category.id ? category : c
    ));
  }
);

const deleteCategoryFromStoreAtom = atom(
  null,
  (get, set, id: string) => {
    const categories = get(categoriesAtom);
    set(categoriesAtom, categories.filter((c) => c.id !== id));
  }
);

const createNewCategoryAtom = atom(
  null,
  async (get, set, { name, description }: { name: string; description?: string }) => {
    const category = await createCategory(name, description);
    const categories = get(categoriesAtom);
    set(categoriesAtom, [...categories, category]);
    return category;
  }
);

const updateExistingCategoryAtom = atom(
  null,
  async (get, set, { id, updates }: { id: string; updates: Partial<Category> }) => {
    const updatedCategory = await updateCategory(id, updates);
    const categories = get(categoriesAtom);
    set(categoriesAtom, categories.map((c) => 
      c.id === id ? updatedCategory : c
    ));
  }
);

const deleteExistingCategoryAtom = atom(
  null,
  async (get, set, id: string) => {
    await deleteCategory(id);
    const categories = get(categoriesAtom);
    set(categoriesAtom, categories.filter((c) => c.id !== id));
  }
);

const reorderCategoryListAtom = atom(
  null,
  async (get, set, categoryIds: string[]) => {
    await reorderCategories(categoryIds);
    const categories = await getAllCategories();
    set(categoriesAtom, categories);
  }
);

// Hook to use the store
export function useCategoryStore<T>(selector?: (state: CategoryStore) => T): T {
  const [categories] = useAtom(categoriesAtom);
  const [, loadCategories] = useAtom(loadCategoriesAtom);
  const [, addCategory] = useAtom(addCategoryAtom);
  const [, updateCategoryInStore] = useAtom(updateCategoryInStoreAtom);
  const [, deleteCategoryFromStore] = useAtom(deleteCategoryFromStoreAtom);
  const [, createNewCategory] = useAtom(createNewCategoryAtom);
  const [, updateExistingCategory] = useAtom(updateExistingCategoryAtom);
  const [, deleteExistingCategory] = useAtom(deleteExistingCategoryAtom);
  const [, reorderCategoryList] = useAtom(reorderCategoryListAtom);

  const store: CategoryStore = {
    categories,
    loadCategories: () => loadCategories(),
    addCategory: (category) => addCategory(category),
    updateCategoryInStore: (category) => updateCategoryInStore(category),
    deleteCategoryFromStore: (id) => deleteCategoryFromStore(id),
    createNewCategory: (name, description) => createNewCategory({ name, description }),
    updateExistingCategory: (id, updates) => updateExistingCategory({ id, updates }),
    deleteExistingCategory: (id) => deleteExistingCategory(id),
    reorderCategoryList: (categoryIds) => reorderCategoryList(categoryIds),
  };

  return selector ? selector(store) : store as T;
} 