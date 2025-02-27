export type Task = {
  id: number;
  title: string;
  projectId: number;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  dueDate?: number | null;
  description?: string;
  completed: boolean;
};

export type TaskFormValues = {
  title: string;
  projectId: number;
  estimatedDuration: number;
  dueDate?: Date | null;
  description?: string;
};

export type TaskAPIRequest = {
  title: string;
  projectId: number;
  estimatedDuration: number;
  dueDate?: number | null;
  description?: string;
};
