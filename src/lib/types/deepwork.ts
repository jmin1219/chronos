export type DeepWorktype = {
  id: number;
  taskId: number;
  startTime: number;
  endTime: number | null;
  sessionDuration: number;
  workDuration: number;
  pauseDuration: number;
  notes: string;
};
