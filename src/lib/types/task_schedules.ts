export type TaskScheduleType = {
  id: number;
  taskId: number;
  scheduledStart: number;
  scheduledEnd: number;
};

export type EnrichedTaskScheduleType = {
  id: number;
  scheduledStart: number;
  scheduledEnd: number;
  taskId: number;
  taskTitle: string;
  projectId: number;
  projectColor: string;
  projectName: string;
  notes: string;
};
