import { useEffect, useState } from "react";
import { UMLProject } from "../databases/_types";
import {
  getDeletedProjects,
  permanentlyDeleteProject,
} from "../databases/projects";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { History, RotateCcw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useProjectStore } from "@/stores/project";

export function DeletedProjectsDialog() {
  const [open, setOpen] = useState(false);
  const [deletedProjects, setDeletedProjects] = useState<UMLProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const restoreProject = useProjectStore((state) => state.restoreProject);

  const loadDeletedProjects = async () => {
    const projects = await getDeletedProjects();
    setDeletedProjects(projects);
  };

  useEffect(() => {
    if (open) {
      loadDeletedProjects();
    }
  }, [open]);

  const handleRestore = async (project: UMLProject) => {
    setLoading(true);
    try {
      await restoreProject(project);
      await loadDeletedProjects();
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    setLoading(true);
    try {
      await permanentlyDeleteProject(id);
      await loadDeletedProjects();
      setConfirmDelete(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="flex cursor-pointer items-center gap-1 text-xs hover:bg-primary/10 px-1 py-0.5 rounded"
        onClick={() => setOpen(true)}
      >
        <History className="h-3 w-3" />
        History
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Deleted UML Diagrams
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {deletedProjects.length > 1 ? (
              <div className="flex items-center justify-between pb-2">
                <p className="text-sm text-muted-foreground">
                  There are {deletedProjects.length} deleted diagrams left
                </p>
              </div>
            ) : null}
            {deletedProjects.length === 0 ? (
              <p className="border border-dashed border-muted-foreground/50 rounded-md p-4 text-sm text-muted-foreground text-center">
                No deleted diagrams found
              </p>
            ) : (
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {deletedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                  >
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium text-foreground">
                        {project.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        Updated{" "}
                        {format(
                          new Date(project.updated_at),
                          "MMM d, yyyy HH:mm"
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleRestore(project)}
                        disabled={loading}
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setConfirmDelete(project.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!confirmDelete}
        onOpenChange={() => setConfirmDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Confirm Permanent Delete
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the UML
              diagram.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="space-y-2 sm:space-y-0">
            <Button variant="outline" onClick={() => setConfirmDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                confirmDelete && handlePermanentDelete(confirmDelete)
              }
              disabled={loading}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
