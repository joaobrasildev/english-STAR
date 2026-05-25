import { useEffect } from 'react'
import type { AnswerRecord } from '../services/api'
import { CountdownTimer } from '../components/CountdownTimer'
import { FinishConfirmation } from '../components/FinishConfirmation'
import { OvertimeAlert } from '../components/OvertimeAlert'
import { StarAnswerForm } from '../components/StarAnswerForm'
import { usePracticeSession } from '../hooks/usePracticeSession'
import type { PreparedSession } from '../types/session'
import { STAR_FIELD_LABELS } from '../utils/composeAnswer'
import { playOvertimeAlert } from '../utils/playOvertimeAlert'

type PracticeSessionProps = {
  session: PreparedSession
  onSessionComplete?: (answers: AnswerRecord[]) => void
}

const EMPTY_PARAGRAPH_COPY = 'Keep typing in this STAR field to build the paragraph.'
const STAR_FIELD_ORDER = ['s', 't', 'a', 'r'] as const

export function PracticeSession({ session, onSessionComplete }: PracticeSessionProps) {
  const practiceSession = usePracticeSession(session)

  useEffect(() => {
    if (practiceSession.hasJustEnteredOvertime) {
      playOvertimeAlert()
    }
  }, [practiceSession.hasJustEnteredOvertime])

  useEffect(() => {
    if (practiceSession.isSessionComplete && practiceSession.savedAnswers.length > 0) {
      onSessionComplete?.(practiceSession.savedAnswers)
    }
  }, [
    onSessionComplete,
    practiceSession.isSessionComplete,
    practiceSession.savedAnswers,
  ])

  return (
    <main className="practice-layout">
      <section className="practice-card">
        <header className="practice-header">
          <div className="hero-copy">
            <p className="eyebrow">Practice mode</p>
            <h1>Practice the current STAR answer</h1>
            <p className="description">
              Work through one question at a time. The timer only starts when you
              are ready, then keeps counting into overtime without interrupting
              your writing.
            </p>
          </div>

          <aside className="question-summary">
            <span>Question progress</span>
            <strong>
              {practiceSession.currentIndex + 1} / {practiceSession.parsedQuestions.length}
            </strong>
          </aside>
        </header>

        <section className="question-panel" aria-labelledby="current-question-title">
          <p className="question-label" id="current-question-title">
            Current question
          </p>
          <p className="question-text">{practiceSession.currentQuestion}</p>
        </section>

        <section className="practice-main-column" aria-label="Primary writing flow">
          <StarAnswerForm
            answer={practiceSession.currentAnswer}
            onChange={practiceSession.updateAnswerField}
          />
        </section>

        <section className="practice-secondary-section" aria-label="Supporting panels">
          <div className="practice-support-grid">
            <div className="practice-support-column">
              <CountdownTimer
                timerState={practiceSession.timerState}
                targetSeconds={practiceSession.targetSeconds}
                elapsedSeconds={practiceSession.elapsedSeconds}
                remainingSeconds={practiceSession.remainingSeconds}
                overtimeSeconds={practiceSession.overtimeSeconds}
                disableStart={
                  practiceSession.isSavingAnswer || practiceSession.isSessionComplete
                }
                disableComplete={
                  practiceSession.isSavingAnswer || practiceSession.isSessionComplete
                }
                onStart={practiceSession.startQuestion}
                onComplete={practiceSession.requestFinishConfirmation}
              />

              {practiceSession.timerState === 'overtime' ? (
                <OvertimeAlert overtimeSeconds={practiceSession.overtimeSeconds} />
              ) : null}

              {practiceSession.saveError ? (
                <section className="save-error-banner" role="alert">
                  {practiceSession.saveError}
                </section>
              ) : null}

              {practiceSession.isAwaitingFinishConfirmation ? (
                <FinishConfirmation
                  isSaving={practiceSession.isSavingAnswer}
                  onCancel={practiceSession.cancelFinishConfirmation}
                  onConfirm={() => {
                    void practiceSession.confirmFinishQuestion()
                  }}
                />
              ) : null}

              {practiceSession.isSessionComplete ? (
                <section className="session-complete-banner" role="status">
                  Session complete. Your final answer was saved successfully.
                </section>
              ) : null}
            </div>

            <section
              className="answer-preview-panel"
              aria-labelledby="full-answer-preview-title"
            >
              <div className="panel-header">
                <h2 id="full-answer-preview-title">Full answer preview</h2>
                <span>{practiceSession.composedAnswer.length} characters</span>
              </div>

              <ol className="answer-preview-list">
                {practiceSession.answerParagraphs.map((paragraph, index) => {
                  const fieldKey = STAR_FIELD_ORDER[index]

                  return (
                    <li className="answer-preview-item" key={fieldKey}>
                      <h3>{STAR_FIELD_LABELS[fieldKey]}</h3>
                      <p>{paragraph || EMPTY_PARAGRAPH_COPY}</p>
                    </li>
                  )
                })}
              </ol>
            </section>
          </div>
        </section>
      </section>
    </main>
  )
}
