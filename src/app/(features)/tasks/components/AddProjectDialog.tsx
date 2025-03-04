import ProjectForm from "./ProjectForm";

import { ProjectType } from "@/lib/types/projects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function AddProjectDialog({
  open,
  onClose,
  onProjectAdded,
}: {
  open: boolean;
  onClose: () => void;
  onProjectAdded: (newProject: ProjectType) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <ProjectForm
          onSubmitSuccess={(newProject) => {
            onProjectAdded(newProject);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
