import { create } from "zustand";
import { DeepWorkSessionType } from "../types/deepwork_sessions";

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
  endSession: (saveSession: (session: DeepWorkSessionType) => void) => void;
  startBreak: () => void;
  skipBreak: () => void;
};

export const useTimerStore = create<TimerState & TimerActions>((set, get) => {
  return {
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
    endSession: async (saveSession: (session: DeepWorkSessionType) => void) => {
      const { taskId, startTime, mode, workDuration } = get();
      if (!startTime || !taskId) return;

      // TODO: Fix notes adding here
      const notes = "";

      const actualEndTime = Date.now();
      const sessionDuration = (actualEndTime - startTime) / 1000;

      if (mode === "work") {
        try {
          saveSession({
            taskId,
            startTime,
            endTime: actualEndTime,
            sessionDuration,
            notes,
          });
          console.log("Session saved successfully.");
        } catch (error) {
          console.error("Error saving session:", error);
        }
      }

      // Reset State for both Work & Break
      set({
        isRunning: false,
        mode: "idle",
        startTime: null,
        expectedEndTime: null,
        isBreakPending: mode === "work", // Only prompt break after work session
        workDuration,
      });
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
  };
});
