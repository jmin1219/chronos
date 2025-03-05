import { Button } from "@/components/ui/button";

export default function TasksFilters() {
  return (
    <div className="flex justify-between mb-4">
      <div className="flex gap-4 items-center">
        <span className="text-sm font-semibold">FILTERS:</span>
        <Button variant="outline">Project</Button>
        <Button variant="outline">Due Date</Button>
        <Button variant="outline">Priority</Button>
      </div>
    </div>
  );
}
