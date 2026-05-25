import type { AnswerRecord } from '../services/api'
import { SessionAnswersList } from '../components/SessionAnswersList'

type SessionSummaryProps = {
  sessionId: string
  answers: AnswerRecord[]
  onStartNewSession: () => void
  onOpenHistory: () => void
}

export function SessionSummary({
  sessionId,
  answers,
  onStartNewSession,
  onOpenHistory,
}: SessionSummaryProps) {
  return (
    <main className="setup-layout">
      <section className="setup-card">
        <div className="hero-copy">
          <p className="eyebrow">Session summary</p>
          <h1>Review the timing for this session</h1>
          <p className="description">
            Session ID: <strong>{sessionId}</strong>
          </p>
        </div>

        <section className="summary-panel">
          <div className="panel-header">
            <h2>Answered questions</h2>
            <span>{answers.length} item(s)</span>
          </div>

          <SessionAnswersList answers={answers} />
        </section>

        <div className="setup-actions">
          <button type="button" className="primary-button" onClick={onStartNewSession}>
            Start another session
          </button>
          <button type="button" className="secondary-button" onClick={onOpenHistory}>
            View saved history
          </button>
        </div>
      </section>
    </main>
  )
}
