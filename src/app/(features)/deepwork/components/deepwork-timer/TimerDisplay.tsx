export default function TimerDisplay() {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-md">
      {/* TIME LEFT DISPLAY */}
      <div className="text-3xl font-bold mt-4 text-center">
        {!isTimerRunning ? (
          <div className="flex gap-2 justify-center">
            <Input
              type="number"
              min={1}
              max={120}
              value={isBreak ? breakDuration : workDuration}
              onChange={(e) =>
                isBreak
                  ? setBreakDuration(Number(e.target.value))
                  : setWorkDuration(Number(e.target.value))
              }
              className="p-1 text-center"
            />
            <span>min</span>
          </div>
        ) : timeLeft >= 0 ? (
          // Normal Timer Display
          <div className="text-4xl font-bold">
            {String(
              Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, "0")
            )}
            :{String((timeLeft % 60).toString().padStart(2, "0"))}
          </div>
        ) : (
          // Overtime Display
          <div className="text-4xl font-bold text-green-500">
            + {String(Math.floor(Math.abs(timeLeft) / 60)).padStart(2, "0")}:
            {String(Math.abs(timeLeft) % 60).padStart(2, "0")}
          </div>
        )}
      </div>
    </div>
  );
}
