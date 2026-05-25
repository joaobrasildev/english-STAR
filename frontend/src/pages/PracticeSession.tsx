import { useEffect } from 'react'
import { CountdownTimer } from '../components/CountdownTimer'
import { OvertimeAlert } from '../components/OvertimeAlert'
import { StarAnswerForm } from '../components/StarAnswerForm'
import { usePracticeSession } from '../hooks/usePracticeSession'
import type { PreparedSession } from '../types/session'
import { STAR_FIELD_LABELS } from '../utils/composeAnswer'
import { playOvertimeAlert } from '../utils/playOvertimeAlert'

type PracticeSessionProps = {
  session: PreparedSession
}

const EMPTY_PARAGRAPH_COPY = 'Keep typing in this STAR field to build the paragraph.'
const STAR_FIELD_ORDER = ['s', 't', 'a', 'r'] as const

export function PracticeSession({ session }: PracticeSessionProps) {
  const practiceSession = usePracticeSession(session)

  useEffect(() => {
    if (practiceSession.hasJustEnteredOvertime) {
      playOvertimeAlert()
    }
  }, [practiceSession.hasJustEnteredOvertime])

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

        <div className="practice-grid">
          <div className="practice-main-column">
            <CountdownTimer
              timerState={practiceSession.timerState}
              targetSeconds={practiceSession.targetSeconds}
              elapsedSeconds={practiceSession.elapsedSeconds}
              remainingSeconds={practiceSession.remainingSeconds}
              overtimeSeconds={practiceSession.overtimeSeconds}
              onStart={practiceSession.startQuestion}
              onComplete={practiceSession.completeQuestion}
            />

            {practiceSession.timerState === 'overtime' ? (
              <OvertimeAlert overtimeSeconds={practiceSession.overtimeSeconds} />
            ) : null}

            <StarAnswerForm
              answer={practiceSession.currentAnswer}
              onChange={practiceSession.updateAnswerField}
            />
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
    </main>
  )
}
