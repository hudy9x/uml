import CategoriesSection from "@/features/Category/CategoriesSection";
import CategoryDefault from "@/features/Category/CategoryDefault";
import DiagramList from "@/features/Diagram/DiagramList";
import DiagramCreate from "@/features/Diagram/DiagramCreate";

export default function Sidebar() {
  return (
    <aside className="py-2 relative grow-0 shrink-0 w-[200px] border-r border-foreground/10">
      <DiagramCreate />

      <div className="overflow-x-hidden overflow-y-auto h-[calc(100vh-100px)] px-3">
        <CategoryDefault className="mt-4">
          <DiagramList />
        </CategoryDefault>

        <CategoriesSection />
      </div>
    </aside>
  );
}
