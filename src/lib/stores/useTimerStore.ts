import { create } from "zustand";

type TimerState = {
  taskId: number | null;
  isTimerRunning: boolean; // Tracks if timer is running for EITHER work or break.
  isPaused: boolean;
  isBreak: boolean;
  timeLeft: number;
  startTime: number | null;
  sessionDuration: number;
  workDuration: number;
  pauseDuration: number;
  overtimeDuration: number;
  selectTask: (taskId: number) => void;
  startWork: (taskId: number, duration: number) => void;
  startBreak: (duration: number) => void;
  skipBreak: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
  endSession: () => void;
};

export const useTimerStore = create<TimerState>((set, get) => ({
  taskId: null,
  isTimerRunning: false,
  isPaused: false,
  isBreak: false,
  timeLeft: 25 * 60,
  startTime: null,
  sessionDuration: 0,
  workDuration: 0,
  pauseDuration: 0,
  overtimeDuration: 0,

  // Select Task
  selectTask: (taskId) => {
    set({ taskId });
  },

  // Start a Work Session
  startWork: (duration) =>
    set({
      isTimerRunning: true,
      isPaused: false,
      isBreak: false,
      timeLeft: duration,
      startTime: Date.now(),
      sessionDuration: 0,
      workDuration: 0,
      pauseDuration: 0,
      overtimeDuration: 0,
    }),

  // Start a Break Session
  startBreak: (duration) =>
    set({
      isTimerRunning: true,
      isPaused: false,
      isBreak: true,
      timeLeft: duration,
      startTime: Date.now(),
      sessionDuration: 0,
      workDuration: 0,
      pauseDuration: 0,
      overtimeDuration: 0,
    }),

  // Skip Break (Return to Task Selection)
  skipBreak: () =>
    set({
      taskId: null,
      isTimerRunning: false,
      isPaused: false,
      isBreak: false,
      timeLeft: 25 * 60,
      startTime: null,
      sessionDuration: 0,
      workDuration: 0,
      pauseDuration: 0,
      overtimeDuration: 0,
    }),

  // Pause current work session
  pause: () => {
    const { pauseDuration, isTimerRunning, isBreak, startTime, timeLeft } =
      get();
    if (isTimerRunning && !isBreak) {
      const now = Date.now();
      set({
        isTimerRunning: false,
        isPaused: true,
        timeLeft: Math.max(timeLeft - (now - (startTime || now)) / 1000, 0),
        pauseDuration: pauseDuration + (now - (startTime || now)),
      });
    }
  },

  // Resume current work session from pause
  resume: () => {
    set({
      isTimerRunning: true,
      isPaused: false,
    });
  },

  // Reset Session and Timer (End Session)
  reset: () =>
    set({
      taskId: null,
      isTimerRunning: false,
      isPaused: false,
      isBreak: false,
      timeLeft: 25 * 60,
      startTime: null,
      sessionDuration: 0,
      workDuration: 0,
      pauseDuration: 0,
      overtimeDuration: 0,
    }),

  // End Session
  endSession: () => {
    const { startTime, pauseDuration, timeLeft } = get();
    const now = Date.now();
    const sessionDuration = startTime ? now - startTime : 0;
    const workDuration = sessionDuration - pauseDuration;
    const overtimeDuration = timeLeft < 0 ? Math.abs(timeLeft) : 0;
    console.log("Session Ended:", {
      startTime,
      endTime: now,
      sessionDuration,
      workDuration,
      pauseDuration,
      overtimeDuration,
    });

    set({
      taskId: null,
      isTimerRunning: false,
      isPaused: false,
      isBreak: false,
      timeLeft: 25 * 60,
      startTime: null,
      sessionDuration,
      workDuration,
      pauseDuration,
      overtimeDuration,
    });
  },
}));
