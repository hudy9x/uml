import AddCategoryButton from "@/features/Category/AddCategoryButton";
import { cn } from "@/lib/utils";

export default function CategoryDefault({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("category-section mb-4", className)}>
      <div className="flex items-center justify-between px-2 pb-2">
        <h2 className="text-primary uppercase text-[10px]">My diagrams</h2>
        <AddCategoryButton />
      </div>
      <nav className="flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
        {children}
      </nav>
    </div>
  );
}
