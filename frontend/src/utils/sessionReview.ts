import type { AnswerRecord, SessionSummary } from '../services/api'

export function sortAnswerRecordsByQuestionOrder(
  answers: AnswerRecord[],
): AnswerRecord[] {
  return [...answers].sort((left, right) => left.questionOrder - right.questionOrder)
}

export function sortSessionSummariesByCompletedAt(
  sessions: SessionSummary[],
): SessionSummary[] {
  return [...sessions].sort((left, right) =>
    right.completedAt.localeCompare(left.completedAt),
  )
}

export function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(totalSeconds, 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = safeSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function formatAnswerTiming(
  targetSeconds: number,
  elapsedSeconds: number,
): string {
  return `Target ${formatDuration(targetSeconds)} · Actual ${formatDuration(elapsedSeconds)}`
}

export function formatSessionCompletedAt(value: string): string {
  return new Date(value).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
