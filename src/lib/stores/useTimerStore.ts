import { create } from "zustand";

type TimerState = {
  // Session State
  taskId: number | null;
  mode: "work" | "break" | "idle";
  // Timer State
  isRunning: boolean;
  workDuration: number;
  startTime: number | null;
  expectedEndTime: number | null;
  sessionDuration: number; // Total session including overtime (actual endTime - startTime)
  isBreakPending: boolean;
};

type TimerActions = {
  setTask: (taskId: number) => void;
  adjustTime: (minutes: number) => void;
  startWork: () => void;
  endSession: () => void;
  startBreak: () => void;
  skipBreak: () => void;
};

export const useTimerStore = create<TimerState & TimerActions>((set, get) => ({
  taskId: null,
  mode: "idle",
  isRunning: false,
  workDuration: 25 * 60,
  startTime: null,
  expectedEndTime: null,
  sessionDuration: 0,
  isBreakPending: false,

  // Select Task
  setTask: (taskId) => set({ taskId }),

  // Adjust timeLeft during or before starting a work session
  adjustTime: (minutes) => {
    const { mode, workDuration, expectedEndTime } = get();
    if (mode === "break") return;

    if (mode === "idle") {
      set({
        workDuration: workDuration + minutes * 60,
      });
    }
    if (mode === "work" && expectedEndTime) {
      const newExpectedEndTime = expectedEndTime + minutes * 60 * 1000;
      if (newExpectedEndTime < Date.now()) return;
      set({
        expectedEndTime: newExpectedEndTime,
      });
    }
  },

  // Start a Work Session
  startWork: () => {
    const { taskId, isRunning, workDuration } = get();
    if (isRunning) return;
    if (!taskId) return alert("Please select a task to work on.");

    set({
      mode: "work",
      isRunning: true,
      startTime: Date.now(),
      expectedEndTime: Date.now() + workDuration * 1000,
    });
  },

  // End Session
  endSession: () => {
    const { taskId, startTime, mode, workDuration } = get();
    if (!startTime) return;

    const actualEndTime = Date.now();
    const sessionDuration = (actualEndTime - startTime) / 1000;

    if (mode === "work") {
      console.log("Session Ended:", {
        taskId,
        startTime,
        actualEndTime,
        sessionDuration,
      });

      set({
        isRunning: false,
        mode: "idle",
        startTime: null,
        expectedEndTime: null,
        isBreakPending: true,
        workDuration,
      });
    } else if (mode === "break") {
      set({
        isRunning: false,
        mode: "idle",
        startTime: null,
        expectedEndTime: null,
        isBreakPending: false,
        workDuration,
      });
    }
  },

  // Start a Break Session
  startBreak: () => {
    const { mode, isRunning, workDuration } = get();
    if (mode === "break" || isRunning) return;

    set({
      mode: "break",
      isBreakPending: false,
      isRunning: true,
      startTime: Date.now(),
      expectedEndTime: Date.now() + 5 * 60 * 1000, // Set default 5 min break
    });

    setTimeout(() => {
      set({
        mode: "idle",
        isRunning: false,
        startTime: null,
        expectedEndTime: null,
        workDuration,
      });
    }, 5 * 60 * 1000);
  },

  skipBreak: () => {
    set({
      isBreakPending: false,
    });
  },
}));
