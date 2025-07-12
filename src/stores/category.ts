import { create } from 'zustand';
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

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],

  loadCategories: async () => {
    const categories = await getAllCategories();
    set({ categories });
  },

  addCategory: (category: Category) => {
    set((state) => ({
      categories: [...state.categories, category]
    }));
  },

  updateCategoryInStore: (category: Category) => {
    set((state) => ({
      categories: state.categories.map((c) => 
        c.id === category.id ? category : c
      )
    }));
  },

  deleteCategoryFromStore: (id: string) => {
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id)
    }));
  },

  createNewCategory: async (name: string, description?: string) => {
    const category = await createCategory(name, description);
    get().addCategory(category);
    return category;
  },

  updateExistingCategory: async (id: string, updates: Partial<Category>) => {
    const updatedCategory = await updateCategory(id, updates);
    get().updateCategoryInStore(updatedCategory);
  },

  deleteExistingCategory: async (id: string) => {
    await deleteCategory(id);
    get().deleteCategoryFromStore(id);
  },

  reorderCategoryList: async (categoryIds: string[]) => {
    await reorderCategories(categoryIds);
    const categories = await getAllCategories();
    set({ categories });
  },
})); 