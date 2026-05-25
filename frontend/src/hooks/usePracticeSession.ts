import { useEffect, useMemo, useReducer } from 'react'
import { createAnswer, type AnswerRecord, type CreateAnswerPayload } from '../services/api'
import type { PreparedSession } from '../types/session'
import {
  composeAnswer,
  composeAnswerParagraphs,
} from '../utils/composeAnswer'
import {
  cancelFinishConfirmation,
  createPracticeSessionState,
  failSavingAnswer,
  finishSavingAnswer,
  getOvertimeSeconds,
  getRemainingSeconds,
  type AnswerFieldKey,
  type PracticeSessionState,
  requestFinishConfirmation,
  startPracticeTimer,
  startSavingAnswer,
  tickPracticeTimer,
  updatePracticeAnswer,
} from '../utils/practiceSessionState'

type PracticeSessionAction =
  | { type: 'update-answer'; field: AnswerFieldKey; value: string }
  | { type: 'start-question' }
  | { type: 'tick' }
  | { type: 'request-finish-confirmation' }
  | { type: 'cancel-finish-confirmation' }
  | { type: 'start-saving-answer' }
  | { type: 'finish-saving-answer'; savedAnswer: AnswerRecord }
  | { type: 'fail-saving-answer'; errorMessage: string }

type UsePracticeSessionOptions = {
  saveAnswer?: (payload: CreateAnswerPayload) => Promise<AnswerRecord>
}

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
    case 'request-finish-confirmation':
      return requestFinishConfirmation(state)
    case 'cancel-finish-confirmation':
      return cancelFinishConfirmation(state)
    case 'start-saving-answer':
      return startSavingAnswer(state)
    case 'finish-saving-answer':
      return finishSavingAnswer(state, action.savedAnswer)
    case 'fail-saving-answer':
      return failSavingAnswer(state, action.errorMessage)
    default:
      return state
  }
}

function buildCreateAnswerPayload(
  state: PracticeSessionState,
  fullAnswer: string,
): CreateAnswerPayload {
  return {
    sessionId: state.sessionId,
    questionOrder: state.currentIndex + 1,
    questionText: state.parsedQuestions[state.currentIndex] ?? '',
    fullAnswer,
    targetSeconds: state.targetSeconds,
    elapsedSeconds: state.elapsedSeconds,
  }
}

export function usePracticeSession(
  session: PreparedSession,
  options: UsePracticeSessionOptions = {},
) {
  const saveAnswer = options.saveAnswer ?? createAnswer
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
    requestFinishConfirmation() {
      dispatch({ type: 'request-finish-confirmation' })
    },
    cancelFinishConfirmation() {
      dispatch({ type: 'cancel-finish-confirmation' })
    },
    async confirmFinishQuestion() {
      if (!state.isAwaitingFinishConfirmation || state.isSavingAnswer) {
        return false
      }

      dispatch({ type: 'start-saving-answer' })

      try {
        const savedAnswer = await saveAnswer(
          buildCreateAnswerPayload(state, composedAnswer),
        )

        dispatch({ type: 'finish-saving-answer', savedAnswer })
        return true
      } catch (error: unknown) {
        dispatch({
          type: 'fail-saving-answer',
          errorMessage:
            error instanceof Error
              ? error.message
              : 'Failed to save the answer. Please try again.',
        })
        return false
      }
    },
  }
}
