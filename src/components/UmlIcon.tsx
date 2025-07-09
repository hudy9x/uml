import { cn } from "@/lib/utils";

export default function UmlIcon({ type }: { type: string }) {
  const classes =
    "w-4 h-4 rounded flex items-center justify-center p-1 text-white text-xs";
  const name = type.slice(0, 1).toLowerCase();
  switch (type) {
    case "class":
      return <span className={cn(classes, "bg-red-600/90")}>{name}</span>;
    case "use-case":
      return <span className={cn(classes, "bg-blue-600/90")}>{name}</span>;
    case "sequence":
      return <span className={cn(classes, "bg-green-600/90")}>{name}</span>;
    case "activity":
      return <span className={cn(classes, "bg-yellow-600/90")}>{name}</span>;
    case "state":
      return <span className={cn(classes, "bg-purple-600/90")}>{name}</span>;
    case "component":
      return <span className={cn(classes, "bg-orange-600/90")}>{name}</span>;
    case "deployment":
      return <span className={cn(classes, "bg-pink-600/90")}>{name}</span>;
    case "gantt":
      return <span className={cn(classes, "bg-gray-600/90")}>{name}</span>;
    default:
      return <span className={cn(classes, "bg-gray-600/90")}>{name}</span>;
  }
}
