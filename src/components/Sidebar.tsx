import CategoriesSection from "@/features/Category/CategoriesSection";
import CategoryDefault from "@/features/Category/CategoryDefault";
import DiagramList from "@/features/Diagram/DiagramList";
import DiagramCreate from "@/features/Diagram/DiagramCreate";

export default function Sidebar() {
  return (
    <aside className="px-3 py-2 relative grow-0 shrink-0 w-[200px] border-r border-foreground/10">
      <DiagramCreate />

      <CategoryDefault className="mt-4">
        <DiagramList />
      </CategoryDefault>

      <CategoriesSection />
    </aside>
  );
}
