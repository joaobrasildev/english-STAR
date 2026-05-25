import type { SessionTimerState } from '../types/session'

type CountdownTimerProps = {
  timerState: SessionTimerState
  targetSeconds: number
  elapsedSeconds: number
  remainingSeconds: number
  overtimeSeconds: number
  onStart: () => void
  onComplete: () => void
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function getTimerStatusText(timerState: SessionTimerState): string {
  switch (timerState) {
    case 'idle':
      return 'Timer idle'
    case 'countdown':
      return 'Counting down'
    case 'overtime':
      return 'Overtime'
    case 'completed':
      return 'Question completed'
  }
}

type TimerDisplay = {
  title: string
  value: string
}

function getTimerDisplay(
  timerState: SessionTimerState,
  remainingSeconds: number,
  overtimeSeconds: number,
  elapsedSeconds: number,
): TimerDisplay {
  if (timerState === 'overtime') {
    return {
      title: 'Overtime',
      value: `+${formatDuration(overtimeSeconds)}`,
    }
  }

  if (timerState === 'completed') {
    return {
      title: 'Final elapsed time',
      value: formatDuration(elapsedSeconds),
    }
  }

  return {
    title: 'Time remaining',
    value: formatDuration(remainingSeconds),
  }
}

export function CountdownTimer({
  timerState,
  targetSeconds,
  elapsedSeconds,
  remainingSeconds,
  overtimeSeconds,
  onStart,
  onComplete,
}: CountdownTimerProps) {
  const timerDisplay = getTimerDisplay(
    timerState,
    remainingSeconds,
    overtimeSeconds,
    elapsedSeconds,
  )

  return (
    <section className="timer-panel" aria-labelledby="timer-title">
      <div className="timer-header">
        <div>
          <p className="eyebrow">Timer</p>
          <h2 id="timer-title">{timerDisplay.title}</h2>
        </div>
        <span className={`timer-status timer-status-${timerState}`}>
          {getTimerStatusText(timerState)}
        </span>
      </div>

      <div className="timer-value" aria-live="polite">
        {timerDisplay.value}
      </div>

      <p className="timer-copy">
        Target time: <strong>{formatDuration(targetSeconds)}</strong>
      </p>

      <div className="timer-actions">
        <button
          type="button"
          className="primary-button"
          onClick={onStart}
          disabled={timerState !== 'idle'}
        >
          Start question
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={onComplete}
          disabled={timerState === 'idle' || timerState === 'completed'}
        >
          Mark question as complete
        </button>
      </div>
    </section>
  )
}
