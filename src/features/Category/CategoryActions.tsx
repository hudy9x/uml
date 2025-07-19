import { useState } from "react";
import { Category } from "@/databases/_types";
import CategoryContextMenu from "./CategoryContextMenu";
import RenameCategory from "./RenameCategory";

interface CategoryActionsProps {
  category: Category;
  children: React.ReactNode;
}

export default function CategoryActions({
  category,
  children,
}: CategoryActionsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleEndEdit = () => {
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <RenameCategory
          category={category}
          isEditing={isEditing}
          onEditEnd={handleEndEdit}
        />
      );
    }
    return children;
  };

  return (
    <CategoryContextMenu
      category={category}
      onStartEdit={handleStartEdit}
    >
      {renderContent()}
    </CategoryContextMenu>
  );
} 