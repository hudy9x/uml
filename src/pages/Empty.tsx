import { Button } from "@/components/ui/button";
import { PackageOpen, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function Empty() {
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <div className="max-w-[400px] w-full px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <PackageOpen className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">
              Create Your First Diagram
            </h2>
            <p className="text-sm text-muted-foreground">
              Start by creating a new UML diagram. You can choose from various
              diagram types like sequence, class, activity, and more.
            </p>
          </div>
          <Link to="/">
            <Button variant="outline">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
