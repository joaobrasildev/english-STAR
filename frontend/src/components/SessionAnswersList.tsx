import type { AnswerRecord } from '../services/api'
import {
  formatAnswerTiming,
  sortAnswerRecordsByQuestionOrder,
} from '../utils/sessionReview'

type SessionAnswersListProps = {
  answers: AnswerRecord[]
}

export function SessionAnswersList({ answers }: SessionAnswersListProps) {
  const sortedAnswers = sortAnswerRecordsByQuestionOrder(answers)

  return (
    <ol className="session-review-list">
      {sortedAnswers.map((answer) => (
        <li className="session-review-item" key={answer.id}>
          <div className="session-review-header">
            <span>Question {answer.questionOrder}</span>
            <strong>{formatAnswerTiming(answer.targetSeconds, answer.elapsedSeconds)}</strong>
          </div>
          <p className="session-review-question">{answer.questionText}</p>
        </li>
      ))}
    </ol>
  )
}
