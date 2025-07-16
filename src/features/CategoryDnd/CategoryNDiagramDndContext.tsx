import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

export const CategoryNDiagramDnDContext = createContext<{
  categoryIds: string[];
  diagramIdByCategoryId: Record<string, string[]>;
  setCategoryIds: Dispatch<SetStateAction<string[]>>;
  setDiagramIdByCategoryId: Dispatch<SetStateAction<Record<string, string[]>>>;
}>({
  categoryIds: [],
  diagramIdByCategoryId: {},
  setCategoryIds: () => {},
  setDiagramIdByCategoryId: () => {},
});

export const CategoryNDiagramDnDProvider = ({
  children,
  categoryIdsData,
  diagramIdByCategoryIdData,
}: {
  categoryIdsData: string[];
  diagramIdByCategoryIdData: Record<string, string[]>;
  children: React.ReactNode;
}) => {
  const [categoryIds, setCategoryIds] = useState<string[]>(categoryIdsData);
  const [diagramIdByCategoryId, setDiagramIdByCategoryId] = useState<
    Record<string, string[]>
  >(diagramIdByCategoryIdData);

  useEffect(() => {
    setCategoryIds(categoryIdsData);
  }, [categoryIdsData]);

  useEffect(() => {
    setDiagramIdByCategoryId(diagramIdByCategoryIdData);
  }, [diagramIdByCategoryIdData]);

  return (
    <CategoryNDiagramDnDContext.Provider
      value={{
        categoryIds,
        diagramIdByCategoryId,
        setCategoryIds,
        setDiagramIdByCategoryId,
      }}
    >
      {children}
    </CategoryNDiagramDnDContext.Provider>
  );
};

export const useCategoryNDiagramDnD = () => {
  return useContext(CategoryNDiagramDnDContext);
};
