import { Button } from "@/components/ui/button";
import ProjectForm from "./ProjectForm";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function AddProjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild autoFocus={open}>
        <Button variant="outline" className="w-full">
          Add New Project
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <ProjectForm onSubmitSuccess={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  );
}
