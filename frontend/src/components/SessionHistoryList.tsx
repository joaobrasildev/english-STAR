import type { SessionSummary } from '../services/api'
import {
  formatDuration,
  formatSessionCompletedAt,
  sortSessionSummariesByCompletedAt,
} from '../utils/sessionReview'

type SessionHistoryListProps = {
  sessions: SessionSummary[]
  selectedSessionId: string | null
  onSelectSession: (sessionId: string) => void
}

export function SessionHistoryList({
  sessions,
  selectedSessionId,
  onSelectSession,
}: SessionHistoryListProps) {
  const sortedSessions = sortSessionSummariesByCompletedAt(sessions)

  return (
    <ul className="history-session-list">
      {sortedSessions.map((session) => (
        <li key={session.sessionId}>
          <button
            type="button"
            className={`history-session-card${
              selectedSessionId === session.sessionId ? ' history-session-card-active' : ''
            }`}
            onClick={() => onSelectSession(session.sessionId)}
          >
            <div className="history-session-card-header">
              <strong>{session.sessionId}</strong>
              <span>{formatSessionCompletedAt(session.completedAt)}</span>
            </div>
            <p>
              {session.answeredCount} answer(s) · Total {formatDuration(session.totalElapsedSeconds)}
            </p>
          </button>
        </li>
      ))}
    </ul>
  )
}
