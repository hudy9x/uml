import { Card } from "@/components/ui/card";
import SortableTest from "./SortableTest";

export default function TestSection() {
  return <div className="flex flex-col gap-4 p-10">
    <h2>This is a test section</h2>
    <Card className="p-4">
      <SortableTest />
    </Card>
  </div>;
}