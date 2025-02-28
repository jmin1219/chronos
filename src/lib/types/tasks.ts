export type TaskType = {
  id: number;
  title: string;
  projectId: number;
  estimatedDuration: number; // minutes
  actualDuration?: number;
  dueDate?: number | null;
  description?: string;
  completed: boolean;
};

export type TaskFormValuesType = {
  title: string;
  projectId: number;
  estimatedDuration: number;
  dueDate?: Date | null;
  description?: string;
};

export type TaskAPIRequestType = {
  title: string;
  projectId: number;
  estimatedDuration: number;
  dueDate?: number | null;
  description?: string;
};
