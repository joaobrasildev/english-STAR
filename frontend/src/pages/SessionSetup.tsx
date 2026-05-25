import { QuestionParser } from '../components/QuestionParser'
import { QuestionPreview } from '../components/QuestionPreview'

type SessionSetupProps = {
  rawQuestionBlock: string
  targetSecondsInput: string
  parsedQuestions: string[]
  errorMessage: string
  onQuestionBlockChange: (value: string) => void
  onTargetSecondsChange: (value: string) => void
  onOpenHistory: () => void
  onStartSession: () => void
}

export function SessionSetup({
  rawQuestionBlock,
  targetSecondsInput,
  parsedQuestions,
  errorMessage,
  onQuestionBlockChange,
  onTargetSecondsChange,
  onOpenHistory,
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

            <div className="setup-actions">
              <button type="button" className="primary-button" onClick={onStartSession}>
                Start session
              </button>
              <button type="button" className="secondary-button" onClick={onOpenHistory}>
                View history
              </button>
            </div>
          </section>

          <QuestionPreview questions={parsedQuestions} />
        </div>
      </section>
    </main>
  )
}
