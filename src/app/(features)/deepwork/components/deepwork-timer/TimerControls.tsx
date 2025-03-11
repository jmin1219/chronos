export default function TimerControls() {
  return (
    {/* CONTROL BUTTONS */}
    <div className="flex justify-center gap-3 mt-4">
    {!isTimerRunning ? (
      <Button onClick={handleStartWork}>Start Work</Button>
    ) : !isTimerRunning ? (
      <Button
        onClick={() =>
          startWork(selectedTaskId as number, workDuration)
        }
      >
        Stark Work
      </Button>
    ) : (
      <Button onClick={pause}>Pause</Button>
    )}
    <Button onClick={reset} variant="destructive">
      Reset
    </Button>
  </div>
  {/* POST-WORK OPTIONS */}
  {!isTimerRunning && timeLeft === 0 && (
    <div className="mt-4 flex justify-center gap-3">
      {isBreak ? (
        <>
          <Button
            onClick={() =>
              startWork(selectedTaskId as number, workDuration * 60)
            }
          >
            Start Next Work Block
          </Button>
          <Button variant="destructive" onClick={reset}>
            End Session
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => startBreak(workDuration * 60)}>
            Start Break
          </Button>
          <Button onClick={reset}>Skip Break</Button>
        </>
      )}
    </div>
  )}
</div>
  );
}
