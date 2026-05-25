import { useEffect, useState } from 'react'
import {
  listAnswersBySession,
  listSessions,
  type AnswerRecord,
  type SessionSummary,
} from '../services/api'
import { SessionAnswersList } from '../components/SessionAnswersList'
import { SessionHistoryList } from '../components/SessionHistoryList'

type HistoryProps = {
  onBack: () => void
}

export function History({ onBack }: HistoryProps) {
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const [sessionAnswers, setSessionAnswers] = useState<AnswerRecord[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(true)
  const [isLoadingAnswers, setIsLoadingAnswers] = useState(false)
  const [sessionsError, setSessionsError] = useState('')
  const [answersError, setAnswersError] = useState('')

  useEffect(() => {
    async function loadSessions() {
      setIsLoadingSessions(true)
      setSessionsError('')

      try {
        setSessions(await listSessions())
      } catch (error: unknown) {
        setSessionsError(
          error instanceof Error
            ? error.message
            : 'Failed to load the saved sessions.',
        )
      } finally {
        setIsLoadingSessions(false)
      }
    }

    void loadSessions()
  }, [])

  async function handleSelectSession(sessionId: string) {
    setSelectedSessionId(sessionId)
    setSessionAnswers([])
    setAnswersError('')
    setIsLoadingAnswers(true)

    try {
      setSessionAnswers(await listAnswersBySession(sessionId))
    } catch (error: unknown) {
      setAnswersError(
        error instanceof Error
          ? error.message
          : 'Failed to load the session answers.',
      )
    } finally {
      setIsLoadingAnswers(false)
    }
  }

  return (
    <main className="setup-layout">
      <section className="setup-card">
        <div className="history-header">
          <div className="hero-copy">
            <p className="eyebrow">History</p>
            <h1>Review saved sessions</h1>
            <p className="description">
              Open any past session to review the saved answers in question order.
            </p>
          </div>

          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
        </div>

        {sessionsError ? <p className="error-text">{sessionsError}</p> : null}

        <div className="history-grid">
          <section className="summary-panel">
            <div className="panel-header">
              <h2>Saved sessions</h2>
              <span>{sessions.length} item(s)</span>
            </div>

            {isLoadingSessions ? (
              <p className="helper-copy">Loading saved sessions...</p>
            ) : sessions.length === 0 ? (
              <p className="helper-copy">No saved sessions yet.</p>
            ) : (
              <SessionHistoryList
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelectSession={handleSelectSession}
              />
            )}
          </section>

          <section className="summary-panel">
            <div className="panel-header">
              <h2>Session details</h2>
              <span>{selectedSessionId ?? 'Select a session'}</span>
            </div>

            {answersError ? <p className="error-text">{answersError}</p> : null}

            {isLoadingAnswers ? (
              <p className="helper-copy">Loading session answers...</p>
            ) : sessionAnswers.length > 0 ? (
              <SessionAnswersList answers={sessionAnswers} />
            ) : (
              <p className="helper-copy">
                Select a saved session to load its answers.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  )
}
