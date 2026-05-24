import type { PreparedSession } from '../types/session'
import { QuestionParser } from '../components/QuestionParser'
import { QuestionPreview } from '../components/QuestionPreview'

type SessionSetupProps = {
  rawQuestionBlock: string
  targetSecondsInput: string
  parsedQuestions: string[]
  errorMessage: string
  preparedSession: PreparedSession | null
  onQuestionBlockChange: (value: string) => void
  onTargetSecondsChange: (value: string) => void
  onStartSession: () => void
}

export function SessionSetup({
  rawQuestionBlock,
  targetSecondsInput,
  parsedQuestions,
  errorMessage,
  preparedSession,
  onQuestionBlockChange,
  onTargetSecondsChange,
  onStartSession,
}: SessionSetupProps) {
  return (
    <main className="setup-layout">
      <section className="setup-card">
        <div className="hero-copy">
          <p className="eyebrow">Session setup</p>
          <h1>Prepare your STAR practice session</h1>
          <p className="description">
            Paste the numbered questions from your teacher, define the target time,
            and review the generated order before starting.
          </p>
        </div>

        <div className="setup-grid">
          <section className="editor-panel">
            <QuestionParser
              value={rawQuestionBlock}
              onChange={onQuestionBlockChange}
            />

            <label className="field-group" htmlFor="target-seconds">
              <span className="field-label">Target time (seconds)</span>
              <input
                id="target-seconds"
                className="time-input"
                type="number"
                min="1"
                value={targetSecondsInput}
                onChange={(event) => onTargetSecondsChange(event.target.value)}
              />
            </label>

            {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

            <button type="button" className="primary-button" onClick={onStartSession}>
              Start session
            </button>
          </section>

          <QuestionPreview questions={parsedQuestions} />
        </div>

        {preparedSession ? (
          <section className="session-state" aria-live="polite">
            <h2>Session ready</h2>
            <p>
              Current index: <strong>{preparedSession.currentIndex}</strong>
            </p>
            <p>
              Questions loaded: <strong>{preparedSession.parsedQuestions.length}</strong>
            </p>
            <p>
              Target time: <strong>{preparedSession.targetSeconds} seconds</strong>
            </p>
          </section>
        ) : null}
      </section>
    </main>
  )
}
