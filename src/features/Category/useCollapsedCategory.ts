import { useState } from "react";

const getExpandedKey = (categoryId: string) => {
  return `category-${categoryId}-isExpanded`;
};

export const useCollapsedCategory = (categoryId: string) => {
  const cachedValue = localStorage.getItem(getExpandedKey(categoryId));
  const [isExpanded, setIsExpanded] = useState(
    !cachedValue ? true : cachedValue === "true"
  );

  const setIsExpandedHandler = () => {
    const newIsExpanded = !isExpanded;
    localStorage.setItem(getExpandedKey(categoryId), newIsExpanded.toString());
    setIsExpanded(newIsExpanded);
  };

  return {
    isExpanded,
    toggleExpanded: setIsExpandedHandler,
  };
};
