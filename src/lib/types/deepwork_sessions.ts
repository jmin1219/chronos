export type DeepWorkSessionType = {
  id: number;
  taskId: number;
  startTime: number;
  endTime: number;
  sessionDuration: number;
  notes: string;
};

export type EnrichedSessionType = {
  id: number;
  startTime: number;
  endTime: number;
  sessionDuration: number;
  taskId: number;
  taskTitle: string;
  projectId: number;
  projectColor: string;
  projectName: string;
  notes: string;
};
