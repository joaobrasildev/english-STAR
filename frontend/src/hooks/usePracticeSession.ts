import { useEffect, useMemo, useReducer } from 'react'
import type { PreparedSession } from '../types/session'
import {
  composeAnswer,
  composeAnswerParagraphs,
} from '../utils/composeAnswer'
import {
  createPracticeSessionState,
  getOvertimeSeconds,
  getRemainingSeconds,
  type AnswerFieldKey,
  type PracticeSessionState,
  completePracticeTimer,
  startPracticeTimer,
  tickPracticeTimer,
  updatePracticeAnswer,
} from '../utils/practiceSessionState'

type PracticeSessionAction =
  | { type: 'update-answer'; field: AnswerFieldKey; value: string }
  | { type: 'start-question' }
  | { type: 'tick' }
  | { type: 'complete-question' }

function practiceSessionReducer(
  state: PracticeSessionState,
  action: PracticeSessionAction,
): PracticeSessionState {
  switch (action.type) {
    case 'update-answer':
      return updatePracticeAnswer(state, action.field, action.value)
    case 'start-question':
      return startPracticeTimer(state)
    case 'tick':
      return tickPracticeTimer(state)
    case 'complete-question':
      return completePracticeTimer(state)
    default:
      return state
  }
}

export function usePracticeSession(session: PreparedSession) {
  const [state, dispatch] = useReducer(
    practiceSessionReducer,
    session,
    createPracticeSessionState,
  )

  useEffect(() => {
    if (state.timerState !== 'countdown' && state.timerState !== 'overtime') {
      return undefined
    }

    const timerId = window.setInterval(() => {
      dispatch({ type: 'tick' })
    }, 1000)

    return () => {
      window.clearInterval(timerId)
    }
  }, [state.timerState])

  const composedAnswer = useMemo(
    () => composeAnswer(state.currentAnswer),
    [state.currentAnswer],
  )
  const answerParagraphs = useMemo(
    () => composeAnswerParagraphs(state.currentAnswer),
    [state.currentAnswer],
  )

  return {
    ...state,
    currentQuestion: state.parsedQuestions[state.currentIndex] ?? '',
    composedAnswer,
    answerParagraphs,
    remainingSeconds: getRemainingSeconds(state),
    overtimeSeconds: getOvertimeSeconds(state),
    hasJustEnteredOvertime:
      state.timerState === 'overtime' &&
      state.elapsedSeconds === state.targetSeconds,
    updateAnswerField(field: AnswerFieldKey, value: string) {
      dispatch({ type: 'update-answer', field, value })
    },
    startQuestion() {
      dispatch({ type: 'start-question' })
    },
    completeQuestion() {
      dispatch({ type: 'complete-question' })
    },
  }
}
