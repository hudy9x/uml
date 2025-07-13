import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/stores/category";
import { cn } from "@/lib/utils";

export default function AddCategoryButton({className}: {className?: string}) {
  const { createNewCategory } = useCategoryStore();

  const handleCreateCategory = async () => {
    const name = "New Category";
    await createNewCategory(name);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-4 w-4 group", className)}
      onClick={handleCreateCategory}
    >
      <Plus className="!h-3 !w-3 text-foreground/30 group-hover:text-foreground" />
    </Button>
  );
} 